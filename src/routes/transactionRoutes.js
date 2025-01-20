import express from "express";
import { addTransactions } from "../controllers/transactionController.js";

export const transactionRouter = express.Router();

transactionRouter.route("/add").post(addTransactions);
