import Expense from "@/models/Expense";
import House from "@/models/House";
import User from "@/models/User";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Đảm bảo kết nối DB

    const { userId } = getUserIdFromToken(req);
    const user = await User.findById(userId, "_id email name").lean();
    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy User!" },
        { status: 404 }
      );
    }

    const houses = await House.find({}, "").lean();
    const listHouses = [];
    let totalDebt = 0;
    for (const house of houses) {
      for (const mem of house.member) {
        let userDebt = 0;
        if (mem.toString() == userId) {
          const expenses = await Expense.find({ idHouse: house._id })
            .populate("buyer", "_id name")
            .lean();
          if (expenses.length) {
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

              Object.entries(share).forEach(([memberId, ratio]) => {
                const amountOwed = perUnitCost * (ratio as number);
                debtMap.set(
                  memberId,
                  (debtMap.get(memberId) || 0) - amountOwed
                );
              });
            });

            userDebt = debtMap.get(userId) || 0;
            totalDebt += userDebt;
          }
          listHouses.push({ ...house, userDebt });
        }
      }
    }

    return NextResponse.json({
      ...user,
      houses: listHouses,
      totalDebt,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ message: "Server Error!" }, { status: 500 });
  }
}
