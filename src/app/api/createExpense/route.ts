import Expense from "@/models/Expense";
import connectDB from "@/utils/db";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getUserIdFromToken(req);
    const { idHouse, buyer, note, cost, share, expenseType } = await req.json();
    console.log(req.json());
    console.log({ idHouse, buyer, note, cost, share, expenseType });
    if (!idHouse || !buyer || !cost || !share) {
      return NextResponse.json(
        { message: "Thiếu thông tin cần thiết" },
        { status: 400 }
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

    await newExpense.save();

    return NextResponse.json(
      { message: "Tạo expense thành công", expense: newExpense },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi tạo expense:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
