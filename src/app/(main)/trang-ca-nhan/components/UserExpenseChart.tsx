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
import LoadingData from "@/components/LoadingData";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHouseId, setSelectedHouseId] = useState<string | undefined>(
    undefined
  );

  const fetchHouseStatistic = async (houseId?: string) => {
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

  // Gọi API khi component mount
  useEffect(() => {
    fetchHouseStatistic();
  }, []);

  // Xử lý khi thay đổi lựa chọn nhà
  const handleHouseChange = (value: string | undefined) => {
    setSelectedHouseId(value);
    fetchHouseStatistic(value);
  };

  const userData: UserData[] = Object.entries(houseStatistic).map(
    ([month, amount]) => ({
      type: month,
      value: Number(amount),
    })
  );

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
        callbacks: {
          label: (context: any) => {
            const label = context.chart.data.labels[context.dataIndex];
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true },
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
      children: isLoading ? (
        <LoadingData />
      ) : houseStatistic && Object.keys(houseStatistic).length > 0 ? (
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
        </div>
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
      children: <h1>Hello world</h1>,
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
