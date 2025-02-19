import mongoose from "mongoose";

export interface IUser {
  email: string;
  password: string;
  name: string;
  houses:  mongoose.Types.ObjectId[];
}
