import { UserService } from "@/service";
import { IExpense } from "@/types/expense.type";
import { expenseTypes } from "@/utils/constant";
import { Button, Card, Space, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  DownOutlined,
  PlusOutlined,
  SettingOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import ConfirmPopup from "@/components/ConfirmPopup";
import { toast } from "react-toastify";
import CreateUpdateExpenseModal from "@/app/(main)/trang-ca-nhan/components/CreateUpdateExpenseModal";

function UserExpenseTable() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listPersonalExpense, setListPersonalExpense] = useState<IExpense[]>(
    []
  );
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  const [isAddUserExpenseModal, setIsAddUserExpenseModal] =
    useState<boolean>(false);

  const fetchListExpense = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.getListPersonalExpense();

      if (response.data) {
        const listExpense = response.data.expenses;
        setListPersonalExpense(listExpense);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phòng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListExpense();
  }, []);

  const columns = [
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
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (_: string, record: IExpense) => (
        <Space size="small">
          <Button
            icon={<SettingOutlined />}
            onClick={() => {
              setSelectedExpense(record);
              setIsAddUserExpenseModal(true);
            }}
            type="link"
          />
          <Button
            icon={<UserDeleteOutlined />}
            onClick={() => {
              setSelectedExpense(record);
              setIsModalDelete(true);
            }}
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  const handleDeleteExpenses = () => {
    if (selectedExpense) {
      setIsConfirmingDelete(true);
      toast
        .promise(UserService.deletePersonalExpense(selectedExpense._id), {
          pending: `Chi tiêu đang được xóa `,
          success: `Xóa chi tiêu thành công`,
        })
        .then(() => {
          fetchListExpense();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setIsConfirmingDelete(false);
          setIsModalDelete(false);
        });
    }
  };

  return (
    <Card
      title="Bảng thống kê chi phí cá nhân"
      className="w-full md:w-1/2 flex-grow mb-4 md:mb-0"
      extra={
        <Tooltip placement="bottom" title="Thêm chi tiêu mới">
          <Button
            icon={<PlusOutlined />}
            onClick={(e) => {
              setIsAddUserExpenseModal(true);
            }}
            type="link"
          />
        </Tooltip>
      }
    >
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={listPersonalExpense}
        scroll={{ x: "max-content" }}
      />

      <CreateUpdateExpenseModal
        visible={isAddUserExpenseModal}
        onCancel={() => {
          setSelectedExpense(null);
          setIsAddUserExpenseModal(false);
        }}
        onSuccessfullyCreated={fetchListExpense}
        selectedExpense={selectedExpense}
      />

      <ConfirmPopup
        isConfirming={isConfirmingDelete}
        isModalDelete={isModalDelete}
        handleDelete={handleDeleteExpenses}
        setIsModalDelete={setIsModalDelete}
        message={<p>Bạn có chắc chắn muốn xóa chi phí này không?</p>}
      />
    </Card>
  );
}

export default UserExpenseTable;
