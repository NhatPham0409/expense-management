import Expense from "@/models/Expense";
import House from "@/models/House";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    const { houseId } = await req.json();

    const house = await House.findById(houseId)
      .populate("member", "_id name")
      .populate("admin", "_id name")
      .lean();
    if (!house || Array.isArray(house)) {
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
    const expenses = await Expense.find({ idHouse: houseId })
      .populate("createBy", "_id name")
      .populate("buyer", "_id name")
      .lean();
    console.log(expenses);

    const totalByUser: Record<string, { name: string; totalSpent: number }> = {};
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
