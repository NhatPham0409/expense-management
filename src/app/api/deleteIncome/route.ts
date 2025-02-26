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

    const { incomeId } = await req.json();

    const deletedIncome = await Income.findOneAndDelete({
      _id: incomeId,
      userId,
    });

    if (!deletedIncome) {
      return NextResponse.json(
        { message: "Không tìm thấy thu nhập!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Xóa thu nhập thành công!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xóa thu nhập:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
