import { User} from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Authentication
export const isAuthenticated = async (req, res, next) => {
    try {
        let { jwt: token } = req.body;
        if (token) {
            token = JSON.parse(token);
            console.log("MiddleWare: ", token)
        // console.log("req.headers: ", req.headers)
        }else {
            token = req.headers.token;
            // token = JSON.parse(token);
            console.log('token');
        }
        
        if (!token) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = req.user = await User.findById(decoded.userId);
        if (!req.user) {
            return res.status(404).json({ error: "User not authenticated" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error occuring in Authentication:" + error);
        return res.status(401).json({error: "You are not authenticated"});
    }
}

// Authorization
export const isAdmin = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: `User with given role ${req.user.role} not allowed` });
        }
        next();
    }
}