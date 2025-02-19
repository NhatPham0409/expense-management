import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "@/models/User";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";

export async function POST(req: NextRequest) {
  try {
    // Kết nối MongoDB
    await connectDB();

    const { error, status } = getUserIdFromToken(req);
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    // Lấy danh sách user, bao gồm cả _id, email, name, houses
    const users = await User.find({}, "_id email name houses").lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Lỗi lấy danh sách User:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

export async function GET(id: string) {}
