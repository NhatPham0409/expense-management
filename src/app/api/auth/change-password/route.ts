import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db";
import User from "@/models/User";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {userId} = getUserIdFromToken(req);
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Vui lòng nhập mật khẩu cũ và mật khẩu mới" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Mật khẩu cũ không đúng" },
        { status: 400 }
      );
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu trong DB
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Đổi mật khẩu thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
