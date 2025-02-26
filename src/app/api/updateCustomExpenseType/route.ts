import CustomExpenseType from "@/models/CustomExpenseType";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import connectDB from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { message } from "antd";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Kết nối MongoDB
    const { userId } = await getUserIdFromToken(req);

    if (!userId) {
      return NextResponse.json({ message: "Bạn chưa đăng nhập!" }, { status: 401 });
    }

    const { updatedData, customExpenseTypeId } = await req.json();

    await CustomExpenseType.findByIdAndUpdate(
      customExpenseTypeId,
      updatedData,
      { new: true }
    );
    return NextResponse.json(
      { message: "Cập nhật loại chi tiêu thành công!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo CustomExpenseType:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
