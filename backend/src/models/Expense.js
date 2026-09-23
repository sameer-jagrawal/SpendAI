import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      default:0,
      min: 0
    },

    currency: {
      type: String,
      default: "INR"
    },

    category: {
      type: String,
      required: true
    },

    merchant: {
      type: String,
      default: null
    },

    description: {
      type: String,
      default: null
    },

    date: {
      type: Date,
      required: true
    },

    source: {
      type: String,
      enum: ["text", "voice", "receipt"],
      default: "text"
    }
  },
  {
    timestamps: true
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;