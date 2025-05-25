import Expense from "../models/expense.js";

const create = async (req, res) => {
  const user = req.user.id;

  if (!req.body) {
    return res.status(400).json({
      status: "error",
      message: "There are mandatory fields",
    });
  }

  const { description, amount } = req.body;

  if (!description || !amount) {
    return res.status(400).json({
      status: "error",
      message: "There are mandatory fields",
    });
  }

  try {
    const newExpense = Expense({
      user,
      description,
      amount,
    });

    await newExpense.save();

    return res.status(200).json({
      status: "success",
      message: "Expense created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const list = async (req, res) => {
  const id = req.user.id;

  try {
    const expensesList = await Expense.find({ user: id });

    if (expensesList.length == 0) {
      return res.status(200).json({
        status: "success",
        message: "There is not expenses",
      });
    }

    return res.status(200).json({
      status: "success",
      expensesList,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    await Expense.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Expense deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const edit = async (req, res) => {
  const id = req.params.id;

  if (!req.body) {
    return res.status(400).json({
      status: "error",
      message: "There are mandatory fields",
    });
  }

  const { description, amount } = req.body;

  let params = {};

  if (description) {
    params.description = description;
  }

  if (amount) {
    params.amount = amount;
  }

  try {
    await Expense.findByIdAndUpdate(id, params, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      message: "Expense updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

export default {
  create,
  list,
  remove,
  edit,
};
