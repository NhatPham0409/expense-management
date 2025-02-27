import mongoose, { Date, Document } from "mongoose";

export interface IPersonalExpense extends Document {
  cost: number;
  note: string;
  expenseType: string;
  createAt: Date;
  userId: mongoose.Types.ObjectId;
}
