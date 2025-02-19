import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/user.type";

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  houses: [{ type: mongoose.Schema.Types.ObjectId, ref: "House" }],
});

export default mongoose.models.User ||
  mongoose.model<IUserModel>("User", UserSchema);
