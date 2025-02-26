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

    const incomes = await Income.find({ userId }).sort({ createAt: -1 });

    return NextResponse.json({ incomes }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thu nhập:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
