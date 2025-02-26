import Expense from "@/models/Expense";
import House from "@/models/House";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    const { houseId, page = 1, limit = 20, year, month } = await req.json();

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
      console.log(m._id.toString());
      console.log("userID", userId);
      return m._id.toString() === userId;
    });
    if (!isMember) {
      return NextResponse.json(
        { message: "Bạn không có quyền truy cập vào nhà này!" },
        { status: 403 }
      );
    }

    const filter: any = { idHouse: houseId };
    if (year && !month) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);
      filter.createAt = { $gte: startDate, $lt: endDate };
    }
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      filter.createAt = { $gte: startDate, $lt: endDate };
    }

    // isGetTotal = true

    const totalExpense = await Expense.countDocuments(filter);
    const totalPage = Math.ceil(totalExpense / limit);
    const expenses = await Expense.find(filter)
      .populate("createBy", "_id name")
      .populate("buyer", "_id name")
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        listExpense: expenses,
        totalExpense: totalExpense,
        totalPage: totalPage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi lấy thông tin nhà:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
