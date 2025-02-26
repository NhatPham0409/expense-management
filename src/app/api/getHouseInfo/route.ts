import Expense from "@/models/Expense";
import House from "@/models/House";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    const { houseId } = await req.json();

    const house = await House.findById(houseId)
      .populate("member", "_id name")
      .populate("admin", "_id name")
      .lean();
    if (!house) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }
    const isMember = house.member.some((m: any) => {
      console.log(m._id.toString());
      console.log("userID", userId);
      return m._id.toString() === userId;
    });
    if (!isMember) {
      return NextResponse.json(
        { message: "Bạn không có quyền truy cập vào nhà này!" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        houseInfo: house,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi lấy thông tin nhà:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
