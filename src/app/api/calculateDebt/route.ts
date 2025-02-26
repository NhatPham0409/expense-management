import Expense from "@/models/Expense";
import House from "@/models/House";
import connectDB from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { houseId } = await req.json();
    const house = await House.findById(houseId).populate("member", "_id name");
    if (!house) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }
    const memberMap = new Map();
    house.member.forEach((member: any) => {
      memberMap.set(member._id.toString(), member.name);
    });

    const expenses = await Expense.find({ idHouse: houseId })
      .populate("buyer", "_id name")
      .lean();
    if (!expenses.length) {
      return NextResponse.json(
        { message: "Chưa có chi tiêu nào!" },
        { status: 404 }
      );
    }
    const debtMap = new Map();
    expenses.forEach((expense) => {
      const { buyer, cost, share } = expense;
      if (!buyer || !cost || !share) return;

      const buyerId = buyer._id.toString();
      const totalShare: any = Object.values(share).reduce(
        (sum: any, val) => sum + val,
        0
      );
      const perUnitCost = cost / totalShare;

      debtMap.set(buyerId, (debtMap.get(buyerId) || 0) + cost);

      Object.entries(share).forEach(([userId, ratio]) => {
        const amountOwed = perUnitCost * (ratio as number);
        debtMap.set(userId, (debtMap.get(userId) || 0) - amountOwed);
      });
    });

    const result = Array.from(debtMap.entries()).map(([userId, balance]) => ({
      userId,
      name: memberMap.get(userId) || "Unknown", // Lấy name từ memberMap
      balance,
    }));
    return NextResponse.json({ debt: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
