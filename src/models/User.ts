import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/user.type";

export interface IUserModel extends Document {
  _id: Object; // Khai báo rõ ràng kiểu của _id
  name: string;
  email: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  houses: [{ type: mongoose.Schema.Types.ObjectId, ref: "House" }],
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
