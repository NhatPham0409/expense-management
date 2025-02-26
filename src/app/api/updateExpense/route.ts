import Expense from "@/models/Expense";
import House from "@/models/House";
import User from "@/models/User";
import { expenseTypes } from "@/utils/constant";
import connectDB from "@/utils/db";
import { formatCurrency } from "@/utils/formatCurrency";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { sendTeleMessage } from "@/utils/sendTeleMessage";
import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    const { idExpense, updateData } = await req.json();

    const user = await User.findById(userId, "_id email name");
    if (!userId) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!" },
        { status: 401 }
      );
    }

    const expense = await Expense.findById(idExpense).populate("buyer");
    if (!expense) {
      return NextResponse.json(
        { message: "Chi tiêu không tồn tại" },
        { status: 404 }
      );
    }

    const house = await House.findById(expense.idHouse)
      .populate("member", "_id name")
      .populate("admin", "_id name")
      .lean();
    if (!house || Array.isArray(house)) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }
    await Expense.findByIdAndUpdate(idExpense, updateData, { new: true });

    let expenseConvert = "";

    expenseTypes.map((item) => {
      if (item.value === expense.expenseTypes) {
        expenseConvert = item.label;
      }
    });
    const teleMessage = `
    <b>${user.name}</b> vừa câp nhật chi tiêu cho nhà <b>${house.name}</b>.\n
    <b>👤 Người mua:</b> <i>${expense.buyer.name}</i>\n
    <b>💰 Số tiền:</b> <b style="color:green;">${formatCurrency(
      updateData.cost || expense.cost
    )} VND</b>\n
  `;
    if (house.teleId) {
      sendTeleMessage(house.teleId, teleMessage);
    }

    return NextResponse.json(
      { message: "Cập nhật thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi cập nhật chi tiêu", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
