import { IHouse } from "@/types/house.type";
import mongoose, { Schema } from "mongoose";
import Expense from "./Expense";

export interface IHouseModal extends IHouse, Document {}

const HouseSchema: Schema = new Schema({
  name: { type: String, require: true },
  des: { type: String },
  expenseType: { type: String },
  expense: [{ type: mongoose.Schema.ObjectId, ref: "Expense" }],
  member: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.models.House ||
  mongoose.model<IHouseModal>("House", HouseSchema);
