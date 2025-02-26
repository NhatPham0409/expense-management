import Expense from "@/models/Expense";
import House, { IHouseModal } from "@/models/House";
import { IUser } from "@/types/user.type";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!" },
        { status: 401 }
      );
    }
    const { houseId, updateData } = await req.json();
    const house = await House.findById(houseId)
      // .populate("member", "_id name")
      // .populate("admin", "_id name")
      // .exec();
    if (!house) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }
    console.log("house", house);
    const isMember = house.member.some((m: IUser) => {
      return m._id.toString() === userId;
    });
    if (!isMember) {
      return NextResponse.json(
        { message: "Bạn không có quyền cập nhật thông tin này!" },
        { status: 403 }
      );
    }
    await House.findByIdAndUpdate(houseId, updateData, { new: true });
    return NextResponse.json(
      { message: "Cập nhật thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi cập nhật nhà!", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
