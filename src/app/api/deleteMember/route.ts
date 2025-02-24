import Expense from "@/models/Expense";
import House from "@/models/House";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { houseId, member } = await req.json();
    const { userId } = getUserIdFromToken(req);
    const house = await House.findById(houseId)
      .populate("member", "_id name")
      .populate("admin", "_id name");
    if (!house || Array.isArray(house)) {
      return NextResponse.json(
        { message: "Nhà không tồn tại" },
        { status: 404 }
      );
    }

    if (house.admin._id.toString() !== userId) {
      return NextResponse.json(
        {
          message: "Bạn không có quyền xoá thành viên!",
        },
        { status: 400 }
      );
    }
    const expenses = await Expense.find({ idHouse: houseId }).lean();

    if (!expenses.length) {
      deleteMember();
    }

    const debtMap = new Map();
    expenses.forEach((expense) => {
      const { buyer, cost, share } = expense;
      if (!buyer || !cost || !share) return;

      const buyerId = buyer._id.toString();
      const totalShare: any = Object.values(share).reduce(
        (sum: any, val) => sum + val,
        0
      );
      const perUnitCost = cost / totalShare;

      debtMap.set(buyerId, (debtMap.get(buyerId) || 0) + cost);

      Object.entries(share).forEach(([userId, ratio]) => {
        const amountOwed = perUnitCost * (ratio as number);
        debtMap.set(userId, (debtMap.get(userId) || 0) - amountOwed);
      });
    });
    if (Math.abs(+debtMap.get(member)) > 1) {
      return NextResponse.json(
        { message: "Thành viên cần phải thanh toán hết dư nợ!" },
        { status: 400 }
      );
    }
    deleteMember();
    function deleteMember() {
      const memberIds = house.member.map((item: any) => item._id.toString());
      const resultDelete: string[] = [];
      memberIds.forEach((item: string) => {
        if (member !== item) {
          resultDelete.push(item);
        }
      });
      house.member = resultDelete;
      house.save();
      return NextResponse.json(
        { message: "Xoá thành viên thành công!" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Server error!" }, { status: 500 });
  }
}
