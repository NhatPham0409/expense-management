import Expense from "@/models/Expense";
import House from "@/models/House";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserIdFromToken(req);
    const { page = 1, limit = 20, year, month } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Không tìm thấy userId!" },
        { status: 401 }
      );
    }

    const houses = await House.find({ member: userId }, "_id").lean();
    const houseIds = houses.map((house) => house._id);

    const filter: any = {
      idHouse: { $in: houseIds },
      [`share.${userId}`]: { $exists: true }, 
    };

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

    const totalRecords = await Expense.countDocuments(filter);

    const expenses = await Expense.find(filter)
      .populate("buyer", "_id name")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Tính tổng số trang
    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json({
      data: expenses,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Server Error!" }, { status: 500 });
  }
}
