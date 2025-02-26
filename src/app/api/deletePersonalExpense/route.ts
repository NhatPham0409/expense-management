import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import PersonalExpense from "@/models/PersonalExpense";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Kết nối MongoDB

    const { userId } = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: "Bạn chưa đăng nhập!" }, { status: 401 });
    }

    const { expenseId } = await req.json();
    if (!expenseId) {
      return NextResponse.json({ message: "Thiếu ID khoản chi tiêu!" }, { status: 400 });
    }

    const expense = await PersonalExpense.findById(expenseId);
    if (!expense) {
      return NextResponse.json({ message: "Khoản chi tiêu không tồn tại!" }, { status: 404 });
    }

    if (expense.userId.toString() !== userId) {
      return NextResponse.json({ message: "Bạn không có quyền xóa khoản chi tiêu này!" }, { status: 403 });
    }

    await PersonalExpense.findByIdAndDelete(expenseId);

    return NextResponse.json({ message: "Xóa khoản chi tiêu thành công!" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xóa PersonalExpense:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
