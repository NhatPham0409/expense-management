import { Pie } from "@ant-design/charts";
import React, { useEffect, useState } from "react";

function ExpenseChart() {
  const [data, setData] = useState<{ type: string; value: number }[]>([]);
  useEffect(() => {
    setTimeout(() => {
      setData([
        { type: "Alice", value: 27 },
        { type: "Bob", value: 25 },
        { type: "Charlie", value: 18 },
        { type: "David", value: 15 },
      ]);
    }, 1000);
  }, []);

  const config = {
    data,
    angleField: "value",
    colorField: "type",
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "bottom",
        rowPadding: 5,
      },
    },
  };

  return <Pie {...config} />;
}

export default ExpenseChart;
