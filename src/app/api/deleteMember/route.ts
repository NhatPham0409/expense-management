import House from "@/models/House";
import connectDB from "@/utils/db";
import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { houseId, listMember } = await req.json();
    const house = await House.findById(houseId)
      .populate("member", "_id name")
      .populate("admin", "_id name");
    if (!house || Array.isArray(house)) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }
    const memberIds = house.member.map((item: any) => item._id.toString());
    const resultDelete: string[] = [];
    memberIds.forEach((item: string) => {
      if (!listMember.includes(item)) {
        resultDelete.push(item);
      }
    });
    house.member = resultDelete;
    house.save();
    return NextResponse.json(
      { message: "Xoá thành viên thành công!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error!" }, { status: 500 });
  }
}
