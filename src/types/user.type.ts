import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  houses: mongoose.Types.ObjectId[];
}
