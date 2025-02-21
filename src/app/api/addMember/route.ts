import House from "@/models/House";
import connectDB from "@/utils/db";
import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";
import { list } from "postcss";

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
    const listAdd: string[] = [];
    const memberIds = house.member.map((item: any) => item._id.toString());
    listMember.forEach((item: string) => {
      if (!memberIds.includes(item)) {
        listAdd.push(item);
      }
    });
    if (!listAdd.length) {
      return NextResponse.json(
        { message: "Thành viên đã thuộc nhà!" },
        { status: 400 }
      );
    }
    house.member = [...house.member, ...listAdd];

    house.save();
    return NextResponse.json(
      { message: "Thêm thành viên thành công!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
