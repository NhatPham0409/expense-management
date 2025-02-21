import User from "@/models/User";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    const user = await User.findById(userId, "_id email name");
    if (!user) {
      return NextResponse.json({ message: "Không tìm thấy người dùng!" }, { status: 401 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
