import express from 'express'
import userController from '../controllers/user.controller.js'
import {check} from "express-validator"
import verifyToken from '../utils/middleware.js'
import multer from "multer"
const userRouter=express.Router()
const memoryStorage=multer.memoryStorage()
const upload=multer({storage:memoryStorage,limits:{fileSize:4*1024*1024}})
const userRegistrationFields=[
    check("firstName","firstName is required").isString(),
    check("lastName","lastName is required").isString(),
    check("email","email is required").isEmail(),
    check("password","password is required with minimum 8 characters").isLength({min:8})
]

const userLoginFields=[
    check("email","email is required").isEmail(),
    check("password","password is required with minimum 8 characters").isLength({min:8})
]
userRouter.post("/register",userRegistrationFields,userController.register)
userRouter.post("/login",userLoginFields,userController.login)
userRouter.get("/logout",userController.logout)
userRouter.post("/currentpwdstatus/:userId",verifyToken,userController.currentPwdStatus)
userRouter.put("/updateprofile/:userId",verifyToken,upload.array('avatar',1),userController.updateProfile)
userRouter.put("/resetpasswordbygmail/:email",userController.resetUserPasswordByGmail)
userRouter.post("/passwordresetlink/:email",userController.passwordResetLink)

// userRouter.post('/additem/:userId',verifyToken,)
export default userRouter;