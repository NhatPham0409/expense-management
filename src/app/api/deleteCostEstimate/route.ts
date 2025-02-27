import CostEstimate from "@/models/CostEstimate";
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

    const { expenseType } = await req.json();

    if (!expenseType) {
      return NextResponse.json(
        { message: "Thiếu loại chi tiêu!" },
        { status: 400 }
      );
    }

    // Xóa costEstimate theo userId và expenseType
    const deletedEstimate = await CostEstimate.findOneAndDelete({ userId, expenseType });

    if (!deletedEstimate) {
      return NextResponse.json(
        { message: "Không tìm thấy dự kiến chi tiêu để xóa!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Xóa dự kiến chi tiêu thành công!", deletedEstimate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xóa dự kiến chi tiêu:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
