import { IUser } from "./user.type";

export interface IExpense {
  _id: string;
  idHouse: string;
  buyer: IUser;
  cost: number;
  note: string;
  share: Map<string, number>;
  expenseType: string;
  createBy: IUser;
  createAt: string;
}
