import express from "express";
import {
    loginUser,
    registerUser,
    getUser,
    resetPassword,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

export const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/").get(authenticateUser, getUser);
userRouter.route("/reset-password").post(authenticateUser, resetPassword);
