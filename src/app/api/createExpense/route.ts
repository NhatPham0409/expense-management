import { message } from "antd";
import Expense from "@/models/Expense";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { sendTeleMessage } from "@/utils/sendTeleMessage";
import { NextRequest, NextResponse } from "next/server";
import House from "@/models/House";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    const { idHouse, buyer, note, cost, share, expenseType } = await req.json();
    if (!idHouse || !buyer || !cost || !share) {
      return NextResponse.json(
        { message: "Thiếu thông tin cần thiết" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId, "_id email name");
    const buyerName = await User.findById(buyer, "_id email name");
    // const ratioMessage=

    const house = await House.findById(idHouse).lean();
    if (!house || Array.isArray(house)) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }

    const newExpense = new Expense({
      idHouse,
      buyer,
      note,
      cost,
      share,
      expenseType,
      createBy: userId,
      createAt: new Date(),
    });

    // await newExpense.save();
    const message = `${user.name} vừa thêm chi tiêu cho nhà ${house.name}. Người mua: ${buyerName.name}. Số tiền: ${cost}. Loại chi tiêu: ${expenseType}. Tỉ lệ: ${share}`;
    console.log(message);
    // const token = sendTeleMessage();
    return NextResponse.json(
      { message: "Tạo expense thành công", expense: newExpense },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi tạo expense:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
