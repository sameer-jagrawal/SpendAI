import "dotenv/config";
import connectDB from "../config/db.js";
import addExpense from "../tools/addExpense.tool.js";
import toolExecutor from "../tools/tool.Executor.js"
await connectDB();

const result = await toolExecutor("addExpense",{
    amount: 450,
  currency: "INR",
  category: "Food",
  merchant: "Domino's",
  description: "Dinner",
  date: new Date(),
  source: "text"
})

//  = await addExpense({
//   amount: 450,
//   currency: "INR",
//   category: "Food",
//   merchant: "Domino's",
//   description: "Dinner",
//   date: new Date(),
//   source: "text"
// });

console.log(result);
process.exit(0);