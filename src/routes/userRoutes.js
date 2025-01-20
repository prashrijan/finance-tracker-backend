import express from "express";
import {
  loginUser,
  registerUser,
  showAllUsers,
} from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.route("/").get(showAllUsers);
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
