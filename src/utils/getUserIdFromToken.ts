import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function getUserIdFromToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: "Bạn chưa đăng nhập", status: 401 };
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET chưa được cấu hình!");
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    return { userId: decoded.userId };
  } catch (err) {
    return { error: "Token không hợp lệ", status: 401 };
  }
}
