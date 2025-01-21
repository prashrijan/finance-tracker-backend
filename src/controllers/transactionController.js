import { Transaction } from "../models/transactionModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const addTransactions = async (req, res) => {
  try {
    // Token Validation
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json(new ApiResponse("Unauthorized access. Invalid token.", 401));
    }

    // Find the user
    const userData = await User.findOne({
      email: decoded.email,
      userName: decoded.userName,
    });

    if (!userData) {
      return res.status(404).json(new ApiResponse("User not found.", 404));
    }

    const { type, amount, date, description } = req.body;

    if (!type || !amount || !date || !description) {
      return res
        .status(400)
        .json(new ApiResponse("All fields are required.", 400));
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
        new ApiResponse(
          "Transaction has been successfully added.",
          201,
          transaction
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse("An internal server error occurred.", 500, error));
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json(new ApiResponse("Unauthorized access. Invalid token.", 401));
    }

    // Find the user
    const userData = await User.findOne({
      email: decoded.email,
      userName: decoded.userName,
    });

    if (!userData) {
      return res.status(404).json(new ApiResponse("User not found.", 404));
    }

    const id = req.params.id;

    const transactionData = await Transaction.findOneAndDelete({
      _id: id,
      userId: userData._id,
    });

    if (!transactionData) {
      return res
        .status(404)
        .json(new ApiResponse("No matching transaction found to delete.", 404));
    }

    return res
      .status(200)
      .json(new ApiResponse("Transaction has been successfully deleted.", 200));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse("An internal server error occurred.", 500, error));
  }
};

const getTransactions = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json(new ApiResponse("Unauthorized access. Invalid token.", 401));
    }

    // Find the user
    const userData = await User.findOne({
      email: decoded.email,
      userName: decoded.userName,
    });

    if (!userData) {
      return res.status(404).json(new ApiResponse("Unauthorized user.", 404));
    }

    const transactionData = await Transaction.find({ userId: userData._id });

    if (transactionData.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse("No transactions found for the user.", 404));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          "Transactions retrieved successfully.",
          200,
          transactionData
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse("An internal server error occurred.", 500, error));
  }
};

const deleteAllTransaction = async (req, res) => {
  try {
    const transactionsIds = req.body.transactions;

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json(new ApiResponse("Unauthorized access. Invalid token.", 401));
    }

    const userData = await User.findOne({
      email: decoded.email,
      userName: decoded.userName,
    });

    if (!userData) {
      return res.status(404).json(new ApiResponse("Unauthorized user.", 404));
    }

    const response = await Transaction.deleteMany({
      _id: { $in: transactionsIds },
      userId: userData._id,
    });

    if (!response.deletedCount) {
      return res
        .status(404)
        .json(new ApiResponse("No transactions found for deletion.", 404));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          `${response.deletedCount} transaction(s) have been successfully deleted.`,
          200
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          "An internal server error occurred while deleting transactions.",
          500,
          error
        )
      );
  }
};

export {
  addTransactions,
  deleteTransaction,
  getTransactions,
  deleteAllTransaction,
};
