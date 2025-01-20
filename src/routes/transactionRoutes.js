import express from "express";
import {
  addTransactions,
  deleteTransaction,
} from "../controllers/transactionController.js";

export const transactionRouter = express.Router();

transactionRouter.route("/add").post(addTransactions);
transactionRouter.route("/delete/:id").delete(deleteTransaction);
