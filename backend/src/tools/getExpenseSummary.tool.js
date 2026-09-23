import Expense from "../models/Expense.js";

const getExpenseSummary = async (args) => {
  const { period } = args;

  const now = new Date();
  let startDate = null;

  // Determine the starting date
  if (period === "today") {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
  }

  if (period === "week") {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);
  }

  if (period === "month") {
    startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
  }

  // Build MongoDB query
  const query = {};

  if (startDate) {
    query.date = {
      $gte: startDate,
      $lte: now
    };
  }

  // Get matching expenses
  const expenses = await Expense.find(query).lean();

  // Calculate total
  const totalAmount = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Calculate category breakdown
  const categoryBreakdown = {};

  for (const expense of expenses) {
    if (!categoryBreakdown[expense.category]) {
      categoryBreakdown[expense.category] = 0;
    }

    categoryBreakdown[expense.category] += expense.amount;
  }

  return {
    success: true,
    period,
    totalAmount,
    expenseCount: expenses.length,
    categoryBreakdown
  };
};

export default getExpenseSummary;
