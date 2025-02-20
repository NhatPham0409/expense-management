import House from "@/models/House";
import User from "@/models/User";
import { IUser } from "@/types/user.type";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Name is required!" }, { status: 400 });
    }
    const { userId } = getUserIdFromToken(req);

    let memberIds = body.member || [];
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      memberIds = [userId];
    }
    for (const id of memberIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: `UserId không hợp lệ: ${id}` },
          { status: 400 }
        );
      }

      const userExists = await User.exists({ _id: id });
      if (!userExists) {
        return NextResponse.json(
          { error: `User với ID ${id} không tồn tại` },
          { status: 400 }
        );
      }
    }
    const newHouse = new House({
      name: body.name,
      des: body.des || "",
      member: [...(body.member || []), userId],
      admin: userId,
    });
    await newHouse.save();
    return NextResponse.json(
      { message: "Tạo nhà thành công!", house: newHouse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo nhà!", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}
