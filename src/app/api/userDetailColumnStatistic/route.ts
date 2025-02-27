import Expense from "@/models/Expense";
import House from "@/models/House";
import PersonalExpense from "@/models/PersonalExpense";
import User from "@/models/User";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserIdFromToken(req);
    const { houseId } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { message: "Không tìm thấy userId!" },
        { status: 401 }
      );
    }

    const houses = await House.find({ member: userId }, "_id").lean();
    let houseIds;
    if (!houseId) {
      houseIds = houses.map((house) => house._id as string);
    } else {
      houseIds = [houseId];
    }
    const filter: any = {
      idHouse: { $in: houseIds },
      [`share.${userId}`]: { $exists: true },
    };

    const expenses = await Expense.find(filter)
      .populate("buyer", "_id name")
      .lean();
    const personalExpense = await PersonalExpense.find({ userId });
    personalExpense.forEach((personalExpense) => {
      const { createAt, cost } = personalExpense;
      const monthYear = new Date(createAt).toISOString().slice(0, 7);
      if (!debtByMonth[monthYear]) {
        debtByMonth[monthYear] = 0;
      }
      debtByMonth[monthYear] += cost;
      console.log("aasdsads", debtByMonth);
    });
    const debtByMonth: Record<string, number> = {};

    expenses.forEach((expense) => {
      const { createAt, cost, share } = expense;
      if (!createAt || !cost || !share[userId]) return;

      const monthYear = new Date(createAt).toISOString().slice(0, 7);
      const totalShare: any = Object.values(share).reduce(
        (sum: any, val) => sum + val,
        0
      );
      const userShare = (cost / totalShare) * share[userId];

      if (!debtByMonth[monthYear]) {
        debtByMonth[monthYear] = 0;
      }
      debtByMonth[monthYear] += userShare;
    });

    return NextResponse.json(debtByMonth);
  } catch (error) {
    console.error("Lỗi API:", error);
    return NextResponse.json({ message: "Server Error!" }, { status: 500 });
  }
}
