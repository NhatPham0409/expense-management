import { ICustomExpenseType } from "@/types/customExpenseType";
import mongoose, { Schema } from "mongoose";

const CustomExpenseTypeSchema: Schema<ICustomExpenseType> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  costEstimate: { type: Number, required: true },
});
export default mongoose.models.CustomExpenseType ||
  mongoose.model<ICustomExpenseType>(
    "CustomExpenseType",
    CustomExpenseTypeSchema
  );
