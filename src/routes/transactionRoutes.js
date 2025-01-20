import express from "express";

export const transactionRouter = express.Router();

transactionRouter.get("/", (req, res, next) => {
  res.json({
    message: "Transaction Route is live",
  });
});
