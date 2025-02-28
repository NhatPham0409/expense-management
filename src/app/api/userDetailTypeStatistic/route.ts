import Expense from "@/models/Expense";
import PersonalExpense from "@/models/PersonalExpense";
import CostEstimate from "@/models/CostEstimate";
import House from "@/models/House";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import connectDB from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = await getUserIdFromToken(req);
    const { houseId, month, year } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Không tìm thấy userId!" },
        { status: 401 }
      );
    }

    const houses = await House.find({ member: userId }, "_id").lean();
    let houseIds = houseId
      ? [houseId]
      : houses.map((house: any) => house._id.toString());

    const dateFilter: any = {};
    if (year) {
      dateFilter.$gte = new Date(`${year}-01-01T00:00:00.000Z`);
      dateFilter.$lt = new Date(`${year}-12-31T23:59:59.999Z`);
    }
    if (month && year) {
      dateFilter.$gte = new Date(
        `${year}-${String(month).padStart(2, "0")}-01T00:00:00.000Z`
      );
      dateFilter.$lt = new Date(
        `${year}-${String(month).padStart(2, "0")}-31T23:59:59.999Z`
      );
    }

    const personalExpenses = await PersonalExpense.find({
      userId,
      createAt: dateFilter,
    }).lean();

    const sharedExpenses = await Expense.find({
      idHouse: { $in: houseIds },
      [`share.${userId}`]: { $exists: true },
      createAt: dateFilter,
    }).lean();

    const costEstimates = await CostEstimate.find({ userId }).lean();

    const expenseSummary: Record<
      string,
      { totalCost: number; costEstimate: number }
    > = {};

    personalExpenses.forEach(({ expenseType, cost }) => {
      if (!expenseSummary[expenseType]) {
        expenseSummary[expenseType] = { totalCost: 0, costEstimate: 0 };
      }
      expenseSummary[expenseType].totalCost += cost;
    });

    sharedExpenses.forEach(({ expenseType, cost, share }) => {
      if (!share[userId]) return;

      const totalShare = Object.values(share).reduce(
        (sum: number, val) => sum + (val as number),
        0
      );
      const userShare = (cost / totalShare) * share[userId];

      if (!expenseSummary[expenseType]) {
        expenseSummary[expenseType] = { totalCost: 0, costEstimate: 0 };
      }
      expenseSummary[expenseType].totalCost += userShare;
    });

    costEstimates.forEach(({ expenseType, costEstimate }) => {
      if (!expenseSummary[expenseType]) {
        expenseSummary[expenseType] = { totalCost: 0, costEstimate: 0 };
      }
      expenseSummary[expenseType].costEstimate = costEstimate;
    });

    const result = Object.keys(expenseSummary).map((expenseType) => ({
      expenseType,
      totalCost: expenseSummary[expenseType].totalCost,
      costEstimate: expenseSummary[expenseType].costEstimate,
    }));

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Lỗi API thống kê chi tiêu:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
