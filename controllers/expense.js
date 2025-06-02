import Expense from "../models/expense.js";
import User from "../models/user.js";

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
    const user = await User.findById(id);

    const expensesList = await Expense.find({ user: id, period: "" }).select(
      "-__v"
    );

    const unpaidExpenses = await Expense.find({
      user: id,
      period: "",
      currentState: "unpaid",
    }).select("-__v");

    let toBePaid = 0;

    if (unpaidExpenses.length > 0) {
      unpaidExpenses.forEach((expense) => {
        toBePaid += expense.amount;
      });
    }

    const paidExpenses = await Expense.find({
      user: id,
      period: "",
      currentState: "paid",
    }).select("-__v");

    let paid = 0;

    if (paidExpenses.length > 0) {
      paidExpenses.forEach((expense) => {
        paid += expense.amount;
      });
    }

    if (expensesList.length == 0) {
      return res.status(200).json({
        status: "success",
        message: "There is not expenses",
        user,
      });
    }

    return res.status(200).json({
      status: "success",
      expensesList,
      user,
      toBePaid,
      paid,
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

const payExpense = async (req, res) => {
  const id = req.params.id;

  try {
    await Expense.findByIdAndUpdate(id, { currentState: "paid" });

    return res.status(200).json({
      status: "success",
      message: "Expense paid successfully",
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const unpaidList = async (req, res) => {
  const user = req.user.id;

  try {
    const unpaidExpenses = await Expense.find({
      user: user,
      period: "",
      currentState: "unpaid",
    }).select("-__v");

    let toBePaid = 0;

    if (unpaidExpenses.length > 0) {
      unpaidExpenses.forEach((expense) => {
        toBePaid += expense.amount;
      });
    }

    return res.status(200).json({
      status: "success",
      toBePaid,
    });
  } catch (error) {
    console.log(error);
  }
};

const paidList = async (req, res) => {
  const user = req.user.id;

  try {
    const paidExpenses = await Expense.find({
      user: user,
      period: "",
      currentState: "paid",
    }).select("-__v");

    let paid = 0;

    if (paidExpenses.length > 0) {
      paidExpenses.forEach((expense) => {
        paid += expense.amount;
      });
    }

    return res.status(200).json({
      status: "success",
      paid,
    });
  } catch (error) {
    console.log(error);
  }
};

const unmark = async (req, res) => {
  const id = req.params.id;

  try {
    await Expense.findByIdAndUpdate(id, { currentState: "unpaid" });

    return res.status(200).json({
      status: "success",
      message: "Expense unmarked",
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const setPeriod = async (req, res) => {
  const { month, year, expenses } = req.body;

  if (!month || !year) {
    return res.status(400).json({
      status: "error",
      message: "There are mandatory fields",
    });
  }

  const period = `${month} - ${year}`;
  const id = [];

  expenses.forEach((expense) => {
    id.push(expense._id);
  });

  try {
    await Expense.updateMany({ _id: { $in: id } }, { $set: { period } });

    return res.status(200).json({
      status: "success",
      message: "Period setted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "success",
      message: "Something went wrong",
    });
  }
};

export default {
  create,
  list,
  remove,
  edit,
  payExpense,
  unmark,
  setPeriod,
  unpaidList,
  paidList,
};
