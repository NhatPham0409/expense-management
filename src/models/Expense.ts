import mongoose, { Schema } from "mongoose";

export interface IExpenseModal {}

const ExpenseSchema: Schema = new Schema({
  idHouse: { type: String, require: true },
  buyer: { type: String, require: true },
  note: { type: String },
  cost: { type: Number, require: true },
  share: {},
});
export default mongoose.models.Expense ||
  mongoose.model<IExpenseModal>("Expense", ExpenseSchema);
