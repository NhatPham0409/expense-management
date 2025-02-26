import House from "@/models/House";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    const { houseId } = await req.json();
    const house = await House.findById(houseId);
    if (!house) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }
    if (userId !== house.admin.toString()) {
      return NextResponse.json(
        { message: "Bạn không phải Admin của nhà này!" },
        { status: 400 }
      );
    }
    await House.findByIdAndDelete(houseId);
    return NextResponse.json(
      { message: "Xoá nhà thành công!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xoá nhà!", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
