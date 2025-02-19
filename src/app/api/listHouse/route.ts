import House from "@/models/House";
import connectDB from "@/utils/db";
import next from "next";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();
    const houses = await House.find(
      {},
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
