import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";
import ErrorHandler from "../utils/error.handler.js";
import { v2 } from "cloudinary";
import userModel from "../models/user.model.js";
import tokenService from "../services/token.service.js";
import ResetYourPassword from "../utils/emailService.js";
class UserController {
  async register(req, res, next) {
    const result = validationResult(req.body);
    if (!result.isEmpty()) {
      return next(ErrorHandler(400, result.array()));
    }
    const body = req.body;
    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return next(ErrorHandler(401, "Please provide all fields"));
    }
    try {
      var user = await userModel.findOne({ email: body.email });
      if (user) {
        return next(ErrorHandler(401, "User already Exists"));
      }
      user = new userModel(body);
      let salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(body.password, salt);
      await user.save();
      return res.status(200).send("User Registered Successfully");
    } catch (error) {
      return next(error);
    }
  }
  async login(req, res, next) {
    const body = req.body;
    const result = validationResult(body);
    if (!result.isEmpty()) {
      return next(ErrorHandler(401, result.array()));
    }
    if (!body.email || !body.password) {
      return next(ErrorHandler(401, "Please provide all the fields"));
    }
    try {
      var user = await userModel.findOne({ email: body.email });
      if (!user) {
        return next(ErrorHandler(401, "User not registered"));
      }
      const comparePwd = await bcryptjs.compare(body.password, user.password);
      if (!comparePwd) {
        return next(ErrorHandler(401, "Invalid Email/Password"));
      }
      const { accessToken, refreshToken } = tokenService.generateToken({
        user,
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      const { password, ...rest } = user._doc;
      console.log(rest);
      rest.ttl=tokenService.verifyAccessToken(accessToken, "mysecretkey").exp
      return res.status(201).send(rest)
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).send("User Logout Successfully");
    } catch (error) {
      next(error);
    }
  }
  async updateProfile(req, res, next) {
    console.log(req.body);
    const userId = req.userId;
    const { firstName, lastName, email, newPwd, confirmPwd, currentPwdVerify } =
      req.body;
    let infoWithoutPwd = { firstName, lastName, email };
    try {
      if (req.userId !== req?.params?.userId) {
        return next(ErrorHandler(401, "You can't update other's profile"));
      }
      const avatar = req.files && req.files[0];
      var imageURL;
      if (avatar) {
        const base64 = Buffer.from(avatar.buffer).toString("base64");
        const dataURI = "data:" + avatar.mimetype + ";base64," + base64;
        const response = await v2.uploader.upload(dataURI);
        imageURL = response.url;
        const user = await userModel.findByIdAndUpdate(
          userId.toString(),
          { $set: { avatar: response.url } },
          { new: true }
        );
        await user.save();
      }
      infoWithoutPwd = { firstName, lastName, email, avatar: imageURL };
      if (!firstName || !lastName || !email) {
        return next(ErrorHandler(401, "Please provide all fields"));
      }
      if (!firstName || !lastName || !email) {
        return res.status(400).send("Please provide all the fileds");
      }
      var updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $set: { firstName, lastName, email } },
        { new: true }
      );
      // if(imageURL){
      //     updatedUser.avatar=imageURL.toString()
      // }
      if (currentPwdVerify && currentPwdVerify !== "0") {
        console.log("new password block");
        const salt = await bcryptjs.genSalt(10);
        updatedUser.password = await bcryptjs.hash(newPwd, salt);
        await updatedUser.save();
        return res
          .status(201)
          .send({ msg: "User Profile Updated With Password", updatedUser });
      }
      await updatedUser.save();
      return res
        .status(201)
        .send({ msg: "User Profile Updated Without Password", updatedUser });
    } catch (error) {
      next(error);
    }
  }
  async currentPwdStatus(req, res, next) {
    try {
      console.log(req.body);
      const { userId } = req.params;
      if (userId !== req.userId) {
        next(ErrorHandler(401, "You can't verify other's password"));
      }
      const user = await userModel.findById(userId);
      console.log(user);
      const result = await bcryptjs.compare(req.body.currentPwd, user.password);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async resetUserPasswordByGmail(req, res, next) {
    try {
      const { password, confirmPassword } = req.body;
      const { email } = req.params;
      if (!password || !confirmPassword) {
        return next(ErrorHandler(400, "please provide all the fileds"));
      }
      if (password !== confirmPassword) {
        return next(ErrorHandler(400, "confirm password is not matching"));
      }
      const user = await userModel.findOne({email})
      if (!user) {
        return next(ErrorHandler(404, "User Not Found"));
      }
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);
      await user.save();
      return res
        .status(201)
        .send("Your password has been changed successfully");
    } catch (error) {
      next(error);
    }
  }
  async passwordResetLink(req, res, next) {
    // const userId = req.userId;
    const { email } = req.params;
    console.log(console.log(email));
    try {
      const result = await ResetYourPassword(email);
      console.log(result);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
