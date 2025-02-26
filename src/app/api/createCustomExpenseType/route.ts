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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, costEstimate } = await req.json();

    if (!name || !costEstimate) {
      return NextResponse.json(
        { message: "Thiếu thông tin bắt buộc!" },
        { status: 400 }
      );
    }

    await CustomExpenseType.create({
      userId,
      name,
      costEstimate,
    });

    return NextResponse.json(
      { message: "Tạo loại chi tiêu thành công!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo CustomExpenseType:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
