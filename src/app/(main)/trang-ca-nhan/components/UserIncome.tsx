import { UserService } from "@/service";
import { IIncome } from "@/types/income.type";
import { Button, Card, Space, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  SettingOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import ConfirmPopup from "@/components/ConfirmPopup";
import { toast } from "react-toastify";
import CreateUpdateIncomeModal from "./CreateUpdateIncomeModal";

function UserIncome() {
  const [isIncomeLoading, setIsIncomeLoading] = useState<boolean>(false);
  const [listIncome, setListIncome] = useState<IIncome[]>([]);
  const [selectedIncome, setSelectedIncome] = useState<IIncome | null>(null);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalCreateUpdate, setIsModalCreateUpdate] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const columns = [
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
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
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (_: string, record: IIncome) => (
        <Space size="small">
          <Button
            icon={<SettingOutlined />}
            onClick={() => {
              setSelectedIncome(record);
              setIsModalCreateUpdate(true);
            }}
            type="link"
          />
          <Button
            icon={<UserDeleteOutlined />}
            onClick={() => {
              setSelectedIncome(record);
              setIsModalDelete(true);
            }}
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  const fetchListIncome = async () => {
    setIsIncomeLoading(true);
    try {
      const responseIncome = await UserService.getUserIncome();
      if (responseIncome.data) {
        const listExpense = responseIncome.data.incomes;
        setListIncome(listExpense);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phòng:", error);
    } finally {
      setIsIncomeLoading(false);
    }
  };

  useEffect(() => {
    fetchListIncome();
  }, []);

  const handleDeleteIncome = () => {
    if (selectedIncome) {
      setIsConfirmingDelete(true);
      toast
        .promise(UserService.deleteIncome(selectedIncome._id), {
          pending: `Thông tin thu nhập đang được xóa `,
          success: `Xóa thông tin thu nhập thành công`,
        })
        .then(() => {
          fetchListIncome();
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

  const handleAddOrUpdateSuccess = () => {
    fetchListIncome();
    setIsModalCreateUpdate(false);
    setSelectedIncome(null);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return listIncome.slice(startIndex, endIndex);
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: listIncome.length,
    onChange: (page: number, pageSize: number) => {
      setCurrentPage(page);
      setPageSize(pageSize);
    },
  };

  return (
    <Card
      title="Bảng thu nhập cá nhân"
      className="w-full md:w-1/2 flex-grow mb-4 md:mb-0"
      extra={
        <Tooltip placement="bottom" title="Thêm thu nhập mới">
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedIncome(null);
              setIsModalCreateUpdate(true);
            }}
            type="link"
          />
        </Tooltip>
      }
    >
      <Table
        loading={isIncomeLoading}
        columns={columns}
        dataSource={getPaginatedData()}
        scroll={{ x: "max-content" }}
        pagination={paginationConfig}
      />

      <ConfirmPopup
        isConfirming={isConfirmingDelete}
        isModalDelete={isModalDelete}
        handleDelete={handleDeleteIncome}
        setIsModalDelete={setIsModalDelete}
        message={<p>Bạn có chắc chắn muốn xóa thông tin thu nhập này không?</p>}
      />

      <CreateUpdateIncomeModal
        onCancel={() => {
          setSelectedIncome(null);
          setIsModalCreateUpdate(false);
        }}
        isModalVisible={isModalCreateUpdate}
        setIsModalVisible={setIsModalCreateUpdate}
        onSuccessfullyCreated={handleAddOrUpdateSuccess}
        incomeInfor={selectedIncome}
      />
    </Card>
  );
}

export default UserIncome;
