import { Schema, model } from "mongoose";

const expenseSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currentState: {
    type: String,
    default: "unpaid",
  },
  period: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default model("Expense", expenseSchema);
