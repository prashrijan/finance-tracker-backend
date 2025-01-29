import { Transaction } from "../models/transactionModel.js";
import ApiResponse from "../utils/ApiResponse.js";

// adding transactions
const addTransactions = async (req, res) => {
  try {
    const { type, amount, date, description } = req.body;

    if (!type || !amount || !date || !description) {
      return res
        .status(400)
        .json(new ApiResponse("All fields are required.", 400));
    }

    const transaction = await Transaction.create({
      userId: req.userData._id,
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

// deleting single transaction
const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;

    const transactionData = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.userData._id,
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

// getting transactions
const getTransactions = async (req, res) => {
  try {
    const transactionData = await Transaction.find({
      userId: req.userData._id,
    });

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

// delete all transactions
const deleteAllTransaction = async (req, res) => {
  try {
    const transactionsIds = req.body.transactions;

    const response = await Transaction.deleteMany({
      _id: { $in: transactionsIds },
      userId: req.userData._id,
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

// updating transaction
const updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const update = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      {
        _id: transactionId,
        userId: req.userData._id,
      },
      update,
      {
        new: true,
      }
    );

    if (!transaction) {
      return res
        .status(400)
        .json(
          new ApiResponse("There was an error updating the transaction.", 400)
        );
    }

    return res
      .status(201)
      .json(
        new ApiResponse("Transaction updated successfully.", 201, transaction)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          "An internal server error occurred while updating transactions.",
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
  updateTransaction,
};
