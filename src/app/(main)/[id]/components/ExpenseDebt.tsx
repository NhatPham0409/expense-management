import { DebtType } from "@/app/(main)/[id]/page";
import LoadingData from "@/components/LoadingData";
import { HouseService } from "@/service";
import { formatCurrency } from "@/utils/utils";
import { Card, Empty } from "antd";
import React, { useEffect, useState } from "react";

interface ExpenseDebtProps {
  houseId: string | undefined;
  lastUpdated: number;
}

function ExpenseDebt({ houseId, lastUpdated }: ExpenseDebtProps) {
  const [calculateDebt, setCalculateDebt] = useState<DebtType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchExpenseDebtData = async () => {
    setIsLoading(true);
    try {
      if (houseId) {
        try {
          const responseCalculate = await HouseService.calculateDebt(houseId);
          if (responseCalculate.data) {
            setCalculateDebt(responseCalculate.data.debt);
          }
        } catch (error) {
          console.error("Lỗi khi tính toán dư nợ:", error);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phòng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseDebtData();
  }, [houseId, lastUpdated]);

  return (
    <Card title="Thông tin dư nợ" className="w-full md:w-1/2 flex-grow">
      {isLoading ? (
        <LoadingData />
      ) : calculateDebt && calculateDebt.length > 0 ? (
        <div className="flex flex-col h-full justify-between">
          <ul className="list-none p-0 mb-4">
            {calculateDebt.map((member, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 last:border-b-0"
              >
                <span className="text-base md:text-lg font-medium">
                  {member.name}
                </span>
                <div className="flex items-center">
                  <span
                    className={`text-base md:text-lg font-semibold ${
                      member.balance > 0
                        ? "text-green-600"
                        : member.balance < 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {formatCurrency(member.balance)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có thông tin dư nợ"
        />
      )}
    </Card>
  );
}

export default ExpenseDebt;
