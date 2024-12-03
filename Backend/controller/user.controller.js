import { User } from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";
export const register = async (req, res) => {
    try {
        if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).json({message: "No files were uploaded."});
    }
    const { photo } = req.files;
    const allowedFormats = ["image/jpg", "image/jpeg", "image/png", "image/gif"]
    if(!allowedFormats.includes(photo.mimetype)){
        return res.status(400).json({message: "Invalid file format."});
    }
    const { name, email, phone, password, education, role,  } = req.body;
    if(!email || !password || !name || !phone || !education || !role || !photo){
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const cloudinaryResponse = await cloudinary.uploader.upload
        (photo.tempFilePath,   
    )
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log(cloudinaryResponse.error);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        education,
        role,
        photo: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.url,
    } });
    await newUser.save();
    if (newUser) {
        const token = await createTokenAndSaveCookies(newUser, res);
        console.log("Register :",token);
        return res.status(201).json({ message: "User registered successfully", newUser, token: token });
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        const user = await User.findOne({ email }).select("+password");
        console.log(user);
        if (!user.password) {
            return res.status(400).json({ message: "User password is missing" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (user.role !== role && role !== "admin") {
            console.log(user.role);
            return res.status(400).json({ message: `Given role ${role} not found` });
        }
        let token = await createTokenAndSaveCookies(user._id, res);
        console.log("Login :",token);
        res.status(200).json({
            message: "User logged in successfully", user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }, token: token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", { httpOnly: true, });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getMyProfile = async (req, res) => { 
    const user = await req.user;
    res.status(200).json({ user });
}

export const getAdmins = async (req, res) => { 
    const admins = await User.find({ role: "admin" });
    res.status(200).json( admins );
}
