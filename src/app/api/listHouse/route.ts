import House from "@/models/House";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import next from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);

    const houses = await House.find(
      { member: userId },
      "_id name des member admin expenseType expense"
    )
      .populate("member", "_id email name") // Lấy thông tin _id, email, name của thành viên
      .populate("admin", "_id email name") // Lấy thông tin _id, email, name của admin
      .lean();
    return NextResponse.json({ houses }, { status: 200 });
  } catch (error) {
    console.error("Lỗi lấy danh sách User:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
