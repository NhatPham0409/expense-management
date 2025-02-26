import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    connectDB();
    const { userId } = getUserIdFromToken(req);
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error!" }, { status: 500 });
  }
}
