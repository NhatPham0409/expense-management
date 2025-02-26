import PersonalExpense from "@/models/PersonalExpense";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import connectDB from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Kết nối MongoDB
    const { userId } = await getUserIdFromToken(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!" },
        { status: 401 }
      );
    }

    const { expenseType, note, cost } = await req.json();

    if (!expenseType || !cost) {
      return NextResponse.json(
        { message: "Thiếu dữ liệu bắt buộc!" },
        { status: 400 }
      );
    }

    const newExpense = new PersonalExpense({
      userId,
      expenseType,
      note,
      cost,
      createAt: new Date(),
    });
    console.log("qeqwqew", newExpense.toObject());

    await newExpense.save();

    return NextResponse.json(
      { message: "Tạo chi tiêu cá nhân thành công!", expense: newExpense },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo chi tiêu cá nhân:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
