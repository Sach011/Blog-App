import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import fileUpload from 'express-fileupload'
import cloudinary from 'cloudinary'
import cookieParser from 'cookie-parser'

import userRoute from "./routes/user.routes.js"
import blogRoute from "./routes/blog.routes.js"
import  cors from "cors";
const app = express();
dotenv.config();

const port = process.env.PORT;
const MONGO_URL = process.env.MONG_URI
// console.log(MONGO_URL)

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));



//Db code
try {
    mongoose.connect(MONGO_URL)
    console.log("Database connected")
} catch (error) {
    console.log(error)
}

// Cloudinary code
cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_SECRET_KEY // Click 'View API Keys' above to copy your API secret
    });


// defining routes 
app.use("/api/user", userRoute);
app.use("/api/blog", blogRoute);
app.get("/", (req, res) => {
  res.send("Hello from server")
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})