import House from "@/models/House";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { houseId, teleToken, teleId } = await req.json();
    console.log(teleId, teleToken);
    const { userId } = getUserIdFromToken(req);
    const house = await House.findById(houseId)
      .populate("member", "_id name")
      .populate("admin", "_id name");

    if (!house || Array.isArray(house)) {
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
    if (!houseId || !teleToken || !teleId) {
      return NextResponse.json(
        { message: "Thiếu thông tin houseId, teleToken hoặc teleId" },
        { status: 400 }
      );
    }
    house.teleToken = teleToken;
    house.teleId = teleId;

    console.log(house);
    await house.save();
    return NextResponse.json(
      { message: "Cập nhật thông tin Telegram bot thành công", house },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
