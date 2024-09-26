import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import ConnectDB from './utils/db.js'
import path from "path"
import userRouter from './routes/user.routes.js'
import productRouter from "./routes/product.routes.js"
import {v2 as cloudinary} from "cloudinary"
const app=express()
dotenv.config()
const corOption={
    credentials:true,
    origin:['http://localhost:5173']
}
ConnectDB()
const __dirname=path.resolve()
console.log(path.join(__dirname,'/client/dist'))
// cloudinary api keys
cloudinary.config({
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME
})
// Apply middleware
app.use(cors(corOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Define routes
app.use('/api/user', userRouter);
app.use('/api/product',productRouter)
app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res)=>{
    return res.sendFile(path.join(__dirname,'client','dist','index.html'))
})
const server=app.listen(8000,()=>{
    console.log(`Server Started at http://localhost:${server.address().port}`)
})


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500
    const message=err.message || "Internal Server Error"
    res.status(statusCode).send({success:false,statusCode,message})
    next()
})