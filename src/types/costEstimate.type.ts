import mongoose, { Document } from "mongoose";

export interface ICostEstimate extends Document {
  userId: mongoose.Types.ObjectId;
  expenseType: string;
  costEstimate: number;
}
