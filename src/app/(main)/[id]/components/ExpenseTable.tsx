import { Button, Card, Collapse, Pagination, Space, Table, Tag } from "antd";
import {
  DownOutlined,
  SettingOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import type { IExpense } from "@/types/expense.type";
import type { IHouse } from "@/types/house.type";
import { expenseTypes } from "@/utils/constant";
import { HouseService } from "@/service";
import EditExpenseModal from "@/app/(main)/[id]/components/EditExpenseModal";
import ConfirmPopup from "@/components/ConfirmPopup";
import { toast } from "react-toastify";
import { useIsMobile } from "@/hooks/use-mobile";
import LoadingData from "@/components/LoadingData";
import { useEffect, useState } from "react";

interface ExpenseTableProps {
  houseInfor: IHouse | null;
  roomMembers: IHouse["member"];
  onUpdated: () => void;
  year?: number | null;
  month?: number | null;
}

export default function ExpenseTable({
  houseInfor,
  roomMembers,
  onUpdated,
  year,
  month,
}: ExpenseTableProps) {
  const [isExpenseLoading, setIsExpenseLoading] = useState<boolean>(false);
  const [listExpense, setListExpense] = useState<IExpense[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalElement, setTotalElement] = useState(0);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  const isMobile = useIsMobile();

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
    ...(houseInfor?.member || []).map((member) => ({
      title: member.name,
      dataIndex: ["share", member._id],
      key: member._id,
      render: (share: number | undefined) => share || 0,
    })),
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
              setIsModalEdit(true);
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

  const fetchListExpense = async () => {
    setIsExpenseLoading(true);
    try {
      if (houseInfor) {
        const responseListExpense = await HouseService.getListExpenseOfHouse(
          houseInfor._id,
          currentPage,
          pageSize,
          year ?? undefined,
          month ?? undefined
        );

        if (responseListExpense.data) {
          const listExpense = responseListExpense.data.listExpense;
          const totalExpense = responseListExpense.data.totalExpense;
          setListExpense(listExpense);
          setTotalElement(totalExpense);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phòng:", error);
    } finally {
      setIsExpenseLoading(false);
    }
  };

  useEffect(() => {
    fetchListExpense();
  }, [currentPage, pageSize, houseInfor, year, month]);

  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize;
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleDeleteExpenses = () => {
    if (selectedExpense) {
      setIsConfirmingDelete(true);
      toast
        .promise(HouseService.deleteExpense(selectedExpense._id), {
          pending: `Chi tiêu đang được xóa `,
          success: `Xóa chi tiêu thành công`,
        })
        .then(() => {
          fetchListExpense();
          onUpdated();
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

  const renderMobileCard = (expense: IExpense) => {
    const shareDetails = (
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {Object.entries(expense.share || {}).map(([memberId, value], index) => {
          const member = roomMembers.find((m) => m._id === memberId);
          return (
            <div
              key={memberId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 8px",
                background: index % 2 === 0 ? "#fafafa" : "#ffffff",
                borderBottom:
                  index < Object.keys(expense.share || {}).length - 1
                    ? "1px solid #f0f0f0"
                    : "none",
              }}
            >
              <span style={{ fontSize: 14 }}>{member?.name || "Không rõ"}</span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {value || 0}
              </span>
            </div>
          );
        })}
      </div>
    );

    return (
      <Collapse
        size="small"
        expandIcon={({ isActive }) => (
          <DownOutlined rotate={isActive ? 180 : 0} />
        )}
        items={[
          {
            key: "1",
            label: (
              <Card
                key={expense._id}
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{`Người mua: ${expense.buyer.name}`}</span>
                  </div>
                }
                extra={
                  <Space size="small">
                    <Button
                      icon={<SettingOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExpense(expense);
                        setIsModalEdit(true);
                      }}
                      type="link"
                    />
                    <Button
                      icon={<UserDeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExpense(expense);
                        setIsModalDelete(true);
                      }}
                      type="link"
                      danger
                    />
                  </Space>
                }
              >
                <div className="flex flex-col gap-2">
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {expense.cost.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p>
                    <strong>Ngày tạo:</strong>{" "}
                    {new Date(expense.createAt).toLocaleDateString("vi-VN")}
                  </p>
                  <p>
                    <strong>Ghi chú:</strong>{" "}
                    <Tag
                      color={
                        expenseTypes.find(
                          (item) => item.value === expense.expenseType
                        )?.color
                      }
                    >
                      {
                        expenseTypes.find(
                          (item) => item.value === expense.expenseType
                        )?.label
                      }
                    </Tag>
                    {expense.note || "Không có ghi chú"}
                  </p>
                </div>
              </Card>
            ),
            children: shareDetails,
          },
        ]}
      />
    );
  };

  return (
    <>
      {isMobile ? (
        <div className="overflow-hidden">
          {isExpenseLoading ? (
            <LoadingData />
          ) : (
            <>
              {listExpense.length > 0 ? (
                <>
                  {listExpense.map((expense) => (
                    <div className="mb-4" key={expense._id}>
                      {renderMobileCard(expense)}
                    </div>
                  ))}
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalElement}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                    showSizeChanger
                    className="text-center mt-4 flex items-center justify-end"
                  />
                </>
              ) : (
                <p>Chưa có chi phí nào.</p>
              )}
            </>
          )}
        </div>
      ) : (
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
      )}
      <EditExpenseModal
        visible={isModalEdit}
        onCancel={() => {
          setIsModalEdit(false);
        }}
        onSuccessfullyCreated={() => {
          fetchListExpense();
          onUpdated();
        }}
        selectedExpense={selectedExpense}
        roomMembers={roomMembers}
      />
      <ConfirmPopup
        isConfirming={isConfirmingDelete}
        isModalDelete={isModalDelete}
        handleDelete={handleDeleteExpenses}
        setIsModalDelete={setIsModalDelete}
        message={<p>Bạn có chắc chắn muốn xóa chi phí này không?</p>}
      />
    </>
  );
}
