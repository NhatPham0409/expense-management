import { HouseService } from "@/service";
import { expenseTypes } from "@/utils/constant";
import { Card, Empty, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import LoadingData from "@/components/LoadingData";
import { Pie, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { generateColors } from "@/utils/utils";
import { formatCurrency } from "@/utils/formatCurrency";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels
);

interface ExpenseChartProps {
  houseId: string | undefined;
  lastUpdated: number;
  year?: number | null;
  month?: number | null;
}

interface UserData {
  type: string;
  value: number;
}

interface TypeData {
  type: string;
  value: number;
  color?: string;
}

function ExpenseChart({
  houseId,
  lastUpdated,
  year,
  month,
}: ExpenseChartProps) {
  const [houseStatistic, setHouseStatistic] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHouseStatistic = async () => {
    setIsLoading(true);
    try {
      if (houseId) {
        const response = await HouseService.statistic(
          houseId,
          year ?? undefined,
          month ?? undefined
        );
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
  }, [houseId, lastUpdated, year, month]);

  const userData: UserData[] =
    houseStatistic.totalByUser?.map((item: any) => ({
      type: item.name,
      value: item.totalSpent,
    })) || [];

  const maxValue = Math.max(...userData.map((user) => user.value));

  const paddedMaxValue = maxValue * 1.1;

  const typeData: TypeData[] = Object.keys(
    houseStatistic.totalByType || {}
  ).map((key) => {
    const expense = expenseTypes.find((item) => item.value === key);
    return {
      type: expense ? expense.label : key,
      value: houseStatistic.totalByType[key],
    };
  });

  const pieData = {
    labels: typeData.map((item) => item.type),
    datasets: [
      {
        label: "Chi phí theo loại",
        data: typeData.map((item) => item.value),
        backgroundColor: generateColors(typeData.length),
      },
    ],
  };

  const pieOptions = {
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

  const tabItems = [
    {
      key: "1",
      label: "Thống kê theo người",
      children: isLoading ? (
        <LoadingData />
      ) : houseStatistic.totalByUser?.length ? (
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
      ) : houseStatistic.totalByType &&
        Object.keys(houseStatistic.totalByType).length > 0 ? (
        <div
          style={{
            height: "40vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pie data={pieData} options={pieOptions} />
        </div>
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
