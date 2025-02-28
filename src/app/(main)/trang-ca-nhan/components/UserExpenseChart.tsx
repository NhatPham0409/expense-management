"use client";

import { UserService } from "@/service";
import { generateColors } from "@/utils/utils";
import { Card, Empty, Select, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { formatCurrency } from "@/utils/formatCurrency";
import LoadingData from "@/components/LoadingData";
import ExpenseFilter from "@/app/(main)/[id]/components/ExpenseFilter";
import dayjs from "dayjs";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels
);

interface UserData {
  type: string;
  value: number;
}

interface UserExpenseChartProps {
  listHouse: any[];
}

function UserExpenseChart({ listHouse }: UserExpenseChartProps) {
  const [houseStatistic, setHouseStatistic] = useState<any>({});
  const [typeStatistic, setTypeStatistic] = useState<any[]>([]); // Khởi tạo là mảng rỗng
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHouseId, setSelectedHouseId] = useState<string | undefined>(
    undefined
  );
  const [year, setYear] = useState<number | null>(dayjs().year());
  const [month, setMonth] = useState<number | null>(dayjs().month() + 1);

  const handleFilter = (
    selectedYear: number | null,
    selectedMonth: number | null
  ) => {
    setYear(selectedYear);
    setMonth(selectedMonth);
  };

  const fetchMonthStatistic = async (houseId?: string) => {
    setIsLoading(true);
    try {
      const response = await UserService.getUserDetailColumnStatistic(houseId);
      if (response.data) {
        setHouseStatistic(response.data);
      }
    } catch (error) {
      console.error("Error fetching house statistic:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTypeStatistic = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.userDetailTypeStatistic(
        year ?? undefined,
        month ?? undefined
      );
      if (response.data && Array.isArray(response.data.data)) {
        setTypeStatistic(response.data.data);
      } else {
        setTypeStatistic([]);
        console.warn("Dữ liệu không phải mảng:", response.data);
      }
    } catch (error) {
      console.error("Error fetching type statistic:", error);
      setTypeStatistic([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthStatistic();
  }, []);

  useEffect(() => {
    fetchTypeStatistic();
  }, [year, month]);

  const handleHouseChange = (value: string | undefined) => {
    setSelectedHouseId(value);
    fetchMonthStatistic(value);
  };

  const userData: UserData[] = Object.entries(houseStatistic).map(
    ([month, amount]) => ({
      type: month,
      value: Number(amount),
    })
  );

  const maxValue = Math.max(...userData.map((user) => user.value));
  const paddedMaxValue = maxValue * 1.1;

  const typeData = {
    labels: Array.isArray(typeStatistic)
      ? typeStatistic.map((item: any) => item.expenseType)
      : [],
    datasets: [
      {
        label: "Chi phí thực tế",
        data: Array.isArray(typeStatistic)
          ? typeStatistic.map((item: any) =>
              item.totalCost === 0 ? null : item.totalCost
            )
          : [],
        backgroundColor: "#1890ff",
        barThickness: 30,
      },
      {
        label: "Chi phí dự kiến",
        data: Array.isArray(typeStatistic)
          ? typeStatistic.map((item: any) =>
              item.costEstimate === 0 ? null : item.costEstimate
            )
          : [],
        backgroundColor: "#faad14",
      },
    ],
  };

  const typeOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
      datalabels: {
        display: true,
        anchor: "end" as const,
        align: "top" as const,
        formatter: (value: number) => (value ? formatCurrency(value) : ""), // Ẩn nhãn nếu giá trị là null hoặc 0
        color: "#000",
        font: {
          weight: "bold" as const,
          size: 12,
        },
        offset: 4,
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        max:
          Math.max(
            ...typeStatistic.map((item: any) =>
              Math.max(item.totalCost || 0, item.costEstimate || 0)
            )
          ) * 1.1 || 100, // Đảm bảo max không bị ảnh hưởng bởi giá trị 0
      },
    },
  };

  const barData = {
    labels: userData.map((user) => user.type),
    datasets: [
      {
        label: "Chi phí",
        data: userData.map((user) => user.value),
        backgroundColor: generateColors(userData.length),
        barThickness: 40,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          generateLabels: (chart: any) => {
            const { data } = chart;
            return data.labels.map((label: string, index: number) => ({
              text: label,
              fillStyle: data.datasets[0].backgroundColor[index],
              hidden: !chart.getDataVisibility(index),
              index,
            }));
          },
        },
        onClick: (e: any, legendItem: any, legend: any) => {
          const index = legendItem.index;
          const ci = legend.chart;
          ci.toggleDataVisibility(index);
          ci.update();
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            const label = context.chart.data.labels[context.dataIndex];
            const value = context.raw;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
      datalabels: {
        display: true,
        anchor: "end" as const,
        align: "top" as const,
        formatter: (value: number) => formatCurrency(value),
        color: "#000",
        font: {
          weight: "bold" as const,
          size: 12,
        },
        offset: 4,
      },
    },
    scales: {
      x: { stacked: false },
      y: {
        beginAtZero: true,
        max: paddedMaxValue,
      },
    },
  };

  const houseOptions = listHouse.map((house) => ({
    value: house._id,
    label: house.name,
  }));

  const tabItems = [
    {
      key: "1",
      label: "Thống kê theo tháng",
      children: (
        <div>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Chọn nhà"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={houseOptions}
            onChange={handleHouseChange}
            allowClear
            value={selectedHouseId}
          />
          {isLoading ? (
            <LoadingData />
          ) : houseStatistic && Object.keys(houseStatistic).length > 0 ? (
            <div
              style={{
                height: "40vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Bar data={barData} options={barOptions} />
            </div>
          ) : (
            <div
              style={{
                height: "40vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có dữ liệu thống kê"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Thống kê theo loại",
      children: (
        <div>
          <ExpenseFilter onFilter={handleFilter} year={year} month={month} />
          {isLoading ? (
            <LoadingData />
          ) : typeStatistic.length > 0 ? (
            <div
              style={{
                height: "40vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Bar data={typeData} options={typeOptions} />
            </div>
          ) : (
            <div
              style={{
                height: "40vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có dữ liệu thống kê"
              />
            </div>
          )}
        </div>
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

export default UserExpenseChart;
