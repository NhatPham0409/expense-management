import { ICustomExpenseType } from "@/types/customExpenseType.type";
import { IPersonalExpense } from "@/types/personalExpense.type";
import mongoose, { Schema } from "mongoose";

const PersonalExpenseSchema: Schema<IPersonalExpense> = new Schema({
  expenseType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomExpenseType",
  },
  note: { type: String },
  cost: { type: Number, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createAt: { type: Date, default: () => new Date() },
});
export default mongoose.models.PersonalExpense ||
  mongoose.model<IPersonalExpense>("PersonalExpense", PersonalExpenseSchema);
