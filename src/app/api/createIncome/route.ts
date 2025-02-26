import Income from "@/models/Income";
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

    const { note, cost } = await req.json();

    if (!cost) {
      return NextResponse.json(
        { message: "Thiếu dữ liệu bắt buộc!" },
        { status: 400 }
      );
    }

    const newIncome = new Income({
      userId,
      note,
      cost,
    });

    await newIncome.save();

    return NextResponse.json(
      { message: "Tạo khoản thu nhập thành công!", income: newIncome },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo thu nhập:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
