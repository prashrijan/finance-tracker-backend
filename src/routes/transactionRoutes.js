import express from "express";
import {
  addTransactions,
  deleteTransaction,
  getTransactions,
  deleteAllTransaction,
} from "../controllers/transactionController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

export const transactionRouter = express.Router();

// transaction routes
transactionRouter.route("/add").post(authenticateUser, addTransactions);

transactionRouter
  .route("/delete/:id")
  .delete(authenticateUser, deleteTransaction);

transactionRouter
  .route("/delete")
  .delete(authenticateUser, deleteAllTransaction);

transactionRouter.route("/").get(authenticateUser, getTransactions);
