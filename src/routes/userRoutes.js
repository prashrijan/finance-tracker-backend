import express from "express";
import { registerUser } from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
