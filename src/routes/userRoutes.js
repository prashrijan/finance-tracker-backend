import express from "express";
import {
  loginUser,
  registerUser,
  getUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

export const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/").get(authenticateUser, getUser);
