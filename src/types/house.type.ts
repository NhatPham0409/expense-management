import { IExpense } from "./expense.type";
import { IUser } from "./user.type";

export interface IHouse {
  _id: string;
  name: string;
  des: string;
  member: IUser[];
  admin: IUser;
  expense: IExpense[];
}
