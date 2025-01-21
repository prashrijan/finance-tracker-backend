import { Transaction } from "../models/transactionModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const addTransactions = async (req, res) => {
  try {
    // Token Validation
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.json(new ApiError(404, "", "Invalid Authorization."));
    }

    // Find the user
    const userData = await User.findOne({
      email: decoded.email,
      userName: decoded.userName,
    });

    if (!userData) {
      return res.json(new ApiError(404, "", "User Not Found."));
    }
    const { type, amount, date, description } = req.body;

    if (!type || !amount || !date || !description) {
      res.json(new ApiError(400, "", "All fields required."));
      return;
    }

    const transaction = await Transaction.create({
      userId: userData._id,
      type,
      amount,
      date,
      description,
    });

    return res
      .status(201)
      .json(
        new ApiResponse("Transaction Added Successfully", 200, transaction)
      );
  } catch (error) {
    console.log(error);
    res.json(new ApiError(500, "Something went wrong", error));
  }
};

const deleteTransaction = async (req, res, next) => {
  const token = req.headers.authorization;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return res.json(new ApiError(404, "", "Invalid Authorization."));
  }

  // Find the user
  const userData = await User.findOne({
    email: decoded.email,
    userName: decoded.userName,
  });
  if (!userData) {
    return res.json(new ApiError(404, "", "User Not Found."));
  }

  const id = req.params.id;

  const transactionData = await Transaction.findById(id);

  if (transactionData.userId.toString() !== userData._id.toString()) {
    return res.json(new ApiResponse("Cannot delete", 403));
  }
  const response = await Transaction.findByIdAndDelete(id);
  if (!response) {
    return res.json(new ApiResponse("Issue Deleting transaction", 500));
  }

  return res.json(new ApiResponse("Transaction deleted successfully", 200));
};

const getTransactions = async (req, res) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.json(new ApiError(404, "", "Invalid Authorization."));
    }

    // Find the user
    const userData = await User.findOne({
      email: decoded.email,
      userName: decoded.userName,
    });

    if (!userData) {
      return res.json(new ApiError(404, "", "User Not Found."));
    }

    console.log(userData);

    const transactionData = await Transaction.find({ userId: userData._id });

    if (transactionData.length === 0) {
      return res.json(new ApiError(404, "", "No transactions found."));
    }

    return res
      .status(201)
      .json(new ApiResponse("Transactions Found", 200, transactionData));
  } catch (error) {
    console.log(error);
    return res.json(new ApiError(500, "", "Something went wrong"));
  }
};

export { addTransactions, deleteTransaction, getTransactions };
