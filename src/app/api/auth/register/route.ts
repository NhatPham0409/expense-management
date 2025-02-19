import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import connectDB from "@/utils/db";
import { sendVerificationEmail } from "@/utils/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { message: "Email, Tên là bắt buộc" },
        { status: 400 }
      );
    }

    // Kết nối MongoDB
    await connectDB();

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã tồn tại" },
        { status: 400 }
      );
    }

    // Tạo mật khẩu ngẫu nhiên
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Lưu user vào MongoDB
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      houses: [],
    });
    await newUser.save();

    sendVerificationEmail(email, randomPassword);

    return NextResponse.json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email.",
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
