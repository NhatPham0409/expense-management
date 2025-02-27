import { IIncome } from "@/types/income.type";
import mongoose, { Schema } from "mongoose";

const IncomeSchema: Schema<IIncome> = new Schema({
  note: { type: String },
  cost: { type: Number, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createAt: { type: Date, default: () => new Date() },
});
export default mongoose.models.Income ||
  mongoose.model<IIncome>("Income", IncomeSchema);
