import { IExpense } from "./expense.type";
import { IUser } from "./user.type";

export interface IHouse {
  name: string;
  des: string;
  member: IUser[];
  admin: IUser;
  expenseType: string;
  expense: IExpense[];
}
