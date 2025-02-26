import Expense from "@/models/Expense";
import House from "@/models/House";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    const { houseId, year, month } = await req.json();

    const house = await House.findById(houseId)
      .populate("member", "_id name")
      .populate("admin", "_id name")
      .lean();
    if (!house) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }
    // console.log("house", house.member);
    const isMember = house.member.some((m: any) => {
      console.log(m._id.toString());
      console.log("userID", userId);
      return m._id.toString() === userId;
    });
    // if (!isMember) {
    //   return NextResponse.json(
    //     { message: "Bạn không có quyền truy cập vào nhà này!" },
    //     { status: 403 }
    //   );
    // }
    const filter: any = { idHouse: houseId };
    if (year && !month) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);
      filter.createAt = { $gte: startDate, $lt: endDate };
    }
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      filter.createAt = { $gte: startDate, $lt: endDate };
    }
    const expenses = await Expense.find(filter)
      .populate("createBy", "_id name")
      .populate("buyer", "_id name")
      .lean();

    const totalByUser: Record<string, { name: string; totalSpent: number }> =
      {};
    const totalByType: Record<string, number> = {};

    expenses.forEach((expense) => {
      const buyerId = expense.buyer._id.toString();
      const buyerName = expense.buyer.name;
      const expenseType = expense.expenseType;
      const cost = expense.cost;

      // Tính tổng tiền đã mua của mỗi người
      if (!totalByUser[buyerId]) {
        totalByUser[buyerId] = { name: buyerName, totalSpent: 0 };
      }
      totalByUser[buyerId].totalSpent += cost;

      // Tính tổng tiền theo loại chi tiêu
      if (!totalByType[expenseType]) {
        totalByType[expenseType] = 0;
      }
      totalByType[expenseType] += cost;
    });

    return NextResponse.json({
      totalByUser: Object.values(totalByUser),
      totalByType,
    });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
