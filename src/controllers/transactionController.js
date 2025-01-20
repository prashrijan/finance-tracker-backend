import { Transaction } from "../models/transactionModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const addTransactions = async (req, res, next) => {
  try {
    const { type, amount, date, description } = req.body;

    if (!type || !amount || !date || !description) {
      res.json(new ApiError(400, "", "All fields required."));
      return;
    }

    const transaction = await Transaction.create({
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
  }
};

const deleteTransaction = async (req, res, next) => {
  const id = req.params.id;

  const response = await Transaction.findByIdAndDelete(id);

  return res.json(
    new ApiResponse("Transaction deleted successfully", 200, response)
  );
};

export { addTransactions, deleteTransaction };
