import express from "express";
import {
  addTransactions,
  deleteTransaction,
  getTransactions,
} from "../controllers/transactionController.js";

export const transactionRouter = express.Router();

transactionRouter.route("/add").post(addTransactions);
transactionRouter.route("/delete/:id").delete(deleteTransaction);
transactionRouter.route("/").get(getTransactions);
