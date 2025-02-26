import { IHouse } from "@/types/house.type";
import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  houses: mongoose.Types.ObjectId[];
}

export interface IUserDetail extends Document {
  _id: string;
  email: string;
  name: string;
  houses: IHouse[];
  totalDebt: number;
}
