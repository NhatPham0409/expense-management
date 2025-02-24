import { HouseService } from "@/service";
import { expenseTypes } from "@/utils/constant";
import { Pie, Column } from "@ant-design/charts";
import { Card, Empty, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import LoadingData from "@/components/LoadingData";
import { formatCurrency } from "@/utils/utils";

interface ExpenseChartProps {
  houseId: string | undefined;
  lastUpdated: number;
}

function ExpenseChart({ houseId, lastUpdated }: ExpenseChartProps) {
  const [houseStatistic, setHouseStatistic] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHouseStatistic = async () => {
    setIsLoading(true);
    try {
      if (houseId) {
        const response = await HouseService.statistic(houseId);
        if (response.data) {
          setHouseStatistic(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching house list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseStatistic();
  }, [houseId, lastUpdated]);

  const userData = houseStatistic.totalByUser?.map((item: any) => ({
    type: item.name,
    value: item.totalSpent,
    color: item.name,
  }));

  const typeData = Object.keys(houseStatistic.totalByType || {}).map((key) => {
    const expense = expenseTypes.find((item) => item.value === key);
    return {
      type: expense ? expense.label : key,
      value: houseStatistic.totalByType[key],
    };
  });

  const pieConfig = {
    data: typeData || [],
    angleField: "value",
    colorField: "type",
    label: {
      text: (originData: any) => {
        return formatCurrency(originData.value);
      },
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      position: "bottom",
    },
  };

  const columnConfig = {
    data: userData || [],
    xField: "type",
    yField: "value",
    colorField: "color",
    label: {
      position: "top",
      style: {
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
      },
      text: (originData: any) => {
        return formatCurrency(originData.value);
      },
    },
    legend: false,
  };

  const tabItems = [
    {
      key: "1",
      label: "Thống kê theo người",
      children: isLoading ? (
        <LoadingData />
      ) : houseStatistic.totalByUser?.length ? (
        <Column {...columnConfig} />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có dữ liệu thống kê"
        />
      ),
    },
    {
      key: "2",
      label: "Thống kê theo loại",
      children: isLoading ? (
        <LoadingData />
      ) : houseStatistic.totalByType ? (
        <Pie {...pieConfig} />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có dữ liệu thống kê"
        />
      ),
    },
  ];

  return (
    <Card
      title="Biểu đồ chi phí"
      className="w-full md:w-1/2 flex-grow mb-4 md:mb-0"
    >
      <Tabs defaultActiveKey="1" items={tabItems} />
    </Card>
  );
}

export default ExpenseChart;
