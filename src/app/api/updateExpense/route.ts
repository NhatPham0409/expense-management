import Expense from "@/models/Expense";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!" },
        { status: 401 }
      );
    }
    const { idExpense, updateData } = await req.json();
    console.log(updateData);
    const expense = await Expense.findById(idExpense);
    if (!expense) {
      return NextResponse.json(
        { message: "Chi tiêu không tồn tại" },
        { status: 404 }
      );
    }
    await Expense.findByIdAndUpdate(idExpense, updateData, { new: true });
    return NextResponse.json(
      { message: "Cập nhật thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi cập nhật chi tiêu", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
