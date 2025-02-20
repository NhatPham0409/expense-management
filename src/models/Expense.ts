import mongoose, { Schema } from "mongoose";

export interface IExpenseModal {}

const ExpenseSchema: Schema = new Schema({
  idHouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    require: true,
  },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  note: { type: String },
  cost: { type: Number, require: true },
  share: { type: Map, of: Number, required: true },
  expenseType: { type: String },
  createBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createAt: { type: Date, default: Date.now },
});
export default mongoose.models.Expense ||
  mongoose.model<IExpenseModal>("Expense", ExpenseSchema);
