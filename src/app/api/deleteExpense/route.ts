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
    const { expenseId } = await req.json();
    const { userId } = getUserIdFromToken(req);
    const user = await User.findById(userId, "_id email name");
    const expense = await Expense.findById(expenseId).populate("buyer");
    const houseId = expense.idHouse.toString();
    const house = await House.findById(houseId)
      .populate("member", "_id name")
      .populate("admin", "_id name")
      .lean();
    if (!house || Array.isArray(house)) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }
    const isMember = house.member.some((m: any) => {
      return m._id.toString() === userId;
    });
    if (!isMember) {
      return NextResponse.json(
        { message: "Bạn không có quyền xoá chi tiêu này!" },
        { status: 403 }
      );
    }
    let expenseConvert = "";

    expenseTypes.map((item) => {
      if (item.value === expense.expenseTypes) {
        expenseConvert = item.label;
      }
    });
    await Expense.findByIdAndDelete(expenseId);
    const teleMessage = `
    <b>${user.name}</b> vừa xoá chi tiêu cho nhà <b>${house.name}</b>.\n
    <b>👤 Người mua:</b> <i>${expense.buyer.name}</i>\n
    <b>💰 Số tiền:</b> <b style="color:green;">${formatCurrency(
      expense.cost
    )} VND</b>\n
  `;
    if (house.teleId) {
      sendTeleMessage(house.teleId, teleMessage);
    }
    return NextResponse.json(
      { message: "Xoá chi tiêu thành công!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
