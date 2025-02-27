import { ICostEstimate } from "@/types/costEstimate.type";
import mongoose, { Schema } from "mongoose";

const CostEstimateSchema: Schema<ICostEstimate> = new Schema({
  costEstimate: { type: Number, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expenseType: { type: String, required: true },
});
export default mongoose.models.CostEstimate ||
  mongoose.model<ICostEstimate>("CostEstimate", CostEstimateSchema);
