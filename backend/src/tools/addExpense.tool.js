import Expense from "../models/Expense.js";
import { recentExpensesKey } from "../services/cacheKeys.js";
import { deleteCache } from "../services/redis.service.js";
async function addExpense(args){
    const expense = await Expense.create({
        amount:args.amount,
        currency: args.currency,
        category: args.category,
        merchant: args.merchant,
        description: args.description,
        date: args.date
    })

    const key = recentExpensesKey(5);

    await deleteCache(key);

    return {
        success: true,
        expenseId: expense._id,
        amount: expense.amount,
        category: expense.category,
        merchant: expense.merchant,
    }
}


export default addExpense;