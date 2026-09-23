import Expense from "../models/Expense.js";

const getLatestExpense = async () => {
  const expense = await Expense.findOne().sort({ createdAt: -1 }).lean();

  if (!expense) {
    return {
      success: true,
      expense: null,
      message: "No expenses found.",
    };
  }

  return {
    success: true,
    expense
  };
};

export default getLatestExpense;
