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

    const { note, cost, incomeId } = await req.json();

    // if (!note || !cost) {
    //   return NextResponse.json(
    //     { message: "Thiếu dữ liệu bắt buộc!" },
    //     { status: 400 }
    //   );
    // }

    const updatedIncome = await Income.findOneAndUpdate(
      { _id: incomeId, userId },
      { note, cost },
      { new: true } // Trả về dữ liệu sau khi cập nhật
    );

    if (!updatedIncome) {
      return NextResponse.json(
        { message: "Không tìm thấy thu nhập!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cập nhật thu nhập thành công!", income: updatedIncome },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật thu nhập:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
