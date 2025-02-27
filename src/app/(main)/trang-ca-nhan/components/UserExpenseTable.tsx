import { UserService } from "@/service";
import { IExpense } from "@/types/expense.type";
import { expenseTypes } from "@/utils/constant";
import { Button, Card, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  DownOutlined,
  PlusOutlined,
  SettingOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";

function UserExpenseTable() {
  const [isExpenseLoading, setIsExpenseLoading] = useState<boolean>(false);
  const [listExpense, setListExpense] = useState<IExpense[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalElement, setTotalElement] = useState(0);
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [isAddUserExpenseModal, setIsAddUserExpenseModal] =
    useState<boolean>(false);

  const fetchListExpense = async () => {
    setIsExpenseLoading(true);
    try {
      const responseListExpense = await UserService.getUserDetailExpense(
        currentPage,
        pageSize,
        year ?? undefined,
        month ?? undefined
      );

      if (responseListExpense.data) {
        const listExpense = responseListExpense.data.data;
        const totalExpense = responseListExpense.data.pagination.totalRecords;
        setListExpense(listExpense);
        setTotalElement(totalExpense);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phòng:", error);
    } finally {
      setIsExpenseLoading(false);
    }
  };

  useEffect(() => {
    fetchListExpense();
  }, [currentPage, pageSize, year, month]);

  const columns = [
    {
      title: "Người mua",
      dataIndex: ["buyer", "name"],
      key: "buyer",
    },
    {
      title: "Tổng tiền",
      dataIndex: "cost",
      key: "cost",
      render: (cost: number) =>
        cost.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note: string, record: IExpense) => {
        const maxLength = 70;
        const truncatedNote =
          note.length > maxLength ? `${note.substring(0, maxLength)}...` : note;

        return (
          <div>
            <Tag
              color={
                expenseTypes.find((item) => item.value === record.expenseType)
                  ?.color
              }
            >
              {
                expenseTypes.find((item) => item.value === record.expenseType)
                  ?.label
              }
            </Tag>
            {truncatedNote}
          </div>
        );
      },
    },
  ];

  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize;
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  return (
    <Card
      title="Bảng thống kê chi phí cá nhân"
      className="w-full md:w-1/2 flex-grow mb-4 md:mb-0"
      extra={
        <Button
          icon={
            <Tooltip placement="bottom" title="Thêm chi tiêu mới">
              <Button
                icon={<PlusOutlined />}
                onClick={(e) => {
                  console.log("check");
                }}
                type="link"
              />
            </Tooltip>
          }
          type="link"
        />
      }
    >
      <Table
        loading={isExpenseLoading}
        columns={columns}
        dataSource={listExpense}
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: handlePageChange,
          onShowSizeChange: handlePageChange,
          total: totalElement,
        }}
      />
    </Card>
  );
}

export default UserExpenseTable;
