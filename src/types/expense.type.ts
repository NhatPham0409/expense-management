import { IUser } from "./user.type";

export interface IExpense {
  idHouse: string;
  buyer: IUser;
  cost: number;
  note: string;
  share: {};
}
