import mongoose, { Document } from "mongoose";

export interface ICustomExpenseType extends Document {
  name: string;
  costEstimate: number;
  userId: mongoose.Types.ObjectId;
}
