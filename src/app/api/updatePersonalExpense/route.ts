import PersonalExpense from "@/models/PersonalExpense";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import connectDB from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Kết nối MongoDB
    const { userId } = await getUserIdFromToken(req);
    const { expenseId, expenseType, note, cost } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!" },
        { status: 401 }
      );
    }

    if (!expenseId) {
      return NextResponse.json(
        { message: "Thiếu ID của khoản chi tiêu!" },
        { status: 400 }
      );
    }

    const updatedExpense = await PersonalExpense.findOneAndUpdate(
      { _id: expenseId },
      { expenseType, note, cost },
      { new: true }
    ).populate("expenseType", "name");

    if (!updatedExpense) {
      return NextResponse.json(
        { message: "Không tìm thấy khoản chi tiêu!" },
        { status: 404 }
      );
    }

    return NextResponse.json({ updatedExpense }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật Personal Expense:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
