import Expense from "@/models/Expense";
import House from "@/models/House";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { expenseId } = await req.json();
    const { userId } = getUserIdFromToken(req);
    const expense = await Expense.findById(expenseId);
    const houseId = expense.idHouse.toString();
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
    const isMember = house.member.some((m: any) => {
      return m._id.toString() === userId;
    });
    if (!isMember) {
      return NextResponse.json(
        { message: "Bạn không có quyền xoá chi tiêu này!" },
        { status: 403 }
      );
    }
    await Expense.findByIdAndDelete(expenseId);
    return NextResponse.json(
      { message: "Xoá chi tiêu thành công!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
