import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Cấu hình CORS
  response.headers.set("Access-Control-Allow-Origin", "*"); // Cho phép tất cả các domain
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Xử lý preflight request (OPTIONS request)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

// Chỉ áp dụng Middleware cho API routes
export const config = {
  matcher: "/api/:path*", // Áp dụng cho tất cả API trong `/api`
};
