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

    const { expenseType, costEstimate } = await req.json();

    if (!expenseType || costEstimate === undefined) {
      return NextResponse.json(
        { message: "Thiếu dữ liệu bắt buộc!" },
        { status: 400 }
      );
    }

    // Kiểm tra xem expenseType đã tồn tại hay chưa
    const existingEstimate = await CostEstimate.findOne({ userId, expenseType });

    if (existingEstimate) {
      // Nếu đã tồn tại, cập nhật lại costEstimate
      existingEstimate.costEstimate = costEstimate;
      await existingEstimate.save();

      return NextResponse.json(
        { message: "Cập nhật dự kiến chi tiêu thành công!", costEstimate: existingEstimate },
        { status: 200 }
      );
    } else {
      // Nếu chưa có, tạo mới
      const newEstimate = new CostEstimate({
        userId,
        expenseType,
        costEstimate,
      });

      await newEstimate.save();

      return NextResponse.json(
        { message: "Tạo dự kiến chi tiêu thành công!", costEstimate: newEstimate },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Lỗi khi tạo/cập nhật dự kiến chi tiêu:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
