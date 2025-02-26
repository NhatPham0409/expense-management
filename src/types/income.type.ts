import mongoose, { Date, Document } from "mongoose";

export interface IIncome extends Document {
  cost: number;
  note: string;
  createAt: Date;
  userId: mongoose.Types.ObjectId;
}
