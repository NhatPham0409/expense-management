import { DatePicker, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons"; // Thêm ReloadOutlined cho nút Reset
import React, { useState } from "react";
import dayjs from "dayjs";

interface ExpenseFilterProps {
  onFilter: (year: number | null, month: number | null) => void;
}

const ExpenseFilter: React.FC<ExpenseFilterProps> = ({ onFilter }) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const handleYearChange = (date: any) => {
    const year = date ? dayjs(date).year() : null;
    setSelectedYear(year);
    if (!year) {
      setSelectedMonth(null);
    }
  };

  const handleMonthChange = (date: any) => {
    setSelectedMonth(date ? dayjs(date).month() + 1 : null);
  };

  const handleFilter = () => {
    if (!selectedYear && selectedMonth) {
      alert("Vui lòng chọn năm trước khi lọc theo tháng!");
      return;
    }
    onFilter(selectedYear, selectedMonth);
  };

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
    onFilter(null, null);
  };

  return (
    <Space
      direction={window.innerWidth <= 768 ? "vertical" : "horizontal"} // Chuyển sang dọc trên mobile
      size="middle"
      className="mb-4 flex flex-col md:flex-row gap-4 w-full items-stretch md:items-center"
    >
      <div className="flex items-center justify-center gap-2">
        <DatePicker
          picker="year"
          value={selectedYear ? dayjs(selectedYear.toString()) : null}
          onChange={handleYearChange}
          placeholder="Chọn năm"
          className="w-[20vh]"
        />

        <DatePicker
          picker="month"
          value={
            selectedMonth && selectedYear
              ? dayjs()
                  .month(selectedMonth - 1)
                  .year(selectedYear)
              : null
          }
          onChange={handleMonthChange}
          placeholder="Chọn tháng"
          format="MM"
          className="w-[20vh]"
          disabled={!selectedYear}
        />
      </div>

      <div className="flex items-center justify-start gap-2">
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleFilter}
          disabled={!selectedYear && !selectedMonth}
        >
          Lọc
        </Button>

        <Button
          icon={<ReloadOutlined />}
          onClick={handleReset}
          disabled={!selectedYear && !selectedMonth}
        >
          Reset
        </Button>
      </div>
    </Space>
  );
};

export default ExpenseFilter;
