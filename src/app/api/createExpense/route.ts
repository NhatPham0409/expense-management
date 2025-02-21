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
    const listShare = await User.find({
      _id: { $in: Object.keys(share) },
    }).select("_id name");

    const userMap = listShare.reduce((acc, user) => {
      acc[user._id.toString()] = user.name;
      return acc;
    }, {} as Record<string, string>);

    const shareMessage = Object.entries(share)
      .map(([id, ratio]) => `${userMap[id] || "Unknown"}: ${ratio}`)
      .join(", ");

    const house = await House.findById(idHouse).lean();
    if (!house || Array.isArray(house)) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }

    const teleToken = house.teleToken;
    const teleId = house.teleId;
    console.log(teleId, teleToken);

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

    await newExpense.save();
    const teleMessage = `
    <b>${user.name}</b> vừa thêm chi tiêu cho nhà <b>${house.name}</b>.\n
    <b>👤 Người mua:</b> <i>${buyerName.name}</i>\n
    <b>💰 Số tiền:</b> <b style="color:green;">${cost} VND</b>\n
    <b>📌 Loại chi tiêu:</b> ${expenseType}\n
    <b>📊 Tỉ lệ:</b> ${shareMessage}
  `;
    if (teleToken && teleId) {
      // sendTeleMessage(teleToken, teleId, teleMessage);
    }
    return NextResponse.json(
      { message: "Tạo expense thành công", expense: newExpense },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi tạo expense:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
