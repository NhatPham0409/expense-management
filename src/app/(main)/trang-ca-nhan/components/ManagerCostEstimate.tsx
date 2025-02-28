"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { UserService } from "@/service";
import { expenseTypes } from "@/utils/constant";
import { removeVietnameseTones } from "@/utils/utils";
import {
  PlusOutlined,
  UserDeleteOutlined,
  SettingOutlined,
  LoadingOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import ConfirmPopup from "@/components/ConfirmPopup";

const { Option } = Select;

interface ManagerCostEstimateProps {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
}

interface FormValues {
  expenseType: string;
  costEstimate: number;
}

function ManagerCostEstimate({
  isModalVisible,
  setIsModalVisible,
}: ManagerCostEstimateProps) {
  const [form] = Form.useForm<FormValues>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listCostEstimate, setListCostEstimate] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [editedRecord, setEditedRecord] = useState<any | null>(null);
  const [selectedCostEstimate, setSelectedCostEstimate] = useState<any | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [isModalDelete, setIsModalDelete] = useState<boolean>(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const fetchListCostEstimate = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.getListCostEstimate();
      if (response.data) {
        setListCostEstimate(response.data.costEstimates);
        setOriginalData(response.data.costEstimates);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phòng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListCostEstimate();
  }, [isModalVisible]);

  const handleAddExpense = async (values: FormValues) => {
    setIsConfirming(true);
    try {
      toast
        .promise(UserService.createCostEstimate(values), {
          pending: "Đang xử lý dữ liệu",
        })
        .then((res) => {
          toast.success(res.data.message);
          fetchListCostEstimate();
          form.resetFields();
        })
        .catch((err) => {
          const errorMessage = err.response.data.message;
          toast.error(errorMessage);
        });
    } catch (error: any) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsConfirming(false);
    }
  };

  const startEditing = (record: any) => {
    setEditingKey(record.expenseType);
    setEditedRecord({ ...record }); // Lưu bản sao của record để chỉnh sửa
  };

  const handleSaveEdit = async () => {
    if (!editedRecord) return;
    try {
      const updatedRecord = {
        expenseType: editedRecord.expenseType,
        costEstimate: editedRecord.costEstimate,
      };
      toast
        .promise(UserService.createCostEstimate(updatedRecord), {
          pending: "Đang xử lý dữ liệu",
        })
        .then((res) => {
          toast.success(res.data.message);
          setEditingKey(null);
          setEditedRecord(null);
          fetchListCostEstimate();
        })
        .catch((err) => {
          const errorMessage = err.response.data.message;
          toast.error(errorMessage);
        });
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật.");
    }
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditedRecord(null);
  };

  const columns = [
    {
      title: "Loại chi tiêu",
      dataIndex: "expenseType",
      key: "expenseType",
      render: (expenseType: string, record: any) => {
        const expense = expenseTypes.find((item) => item.value === expenseType);
        return <Tag color={expense?.color}>{expense?.label}</Tag>;
      },
    },
    {
      title: "Tổng tiền ước tính",
      dataIndex: "costEstimate",
      key: "costEstimate",
      render: (cost: number, record: any) => {
        const isEditing = editingKey === record.expenseType;
        if (isEditing && editedRecord) {
          return (
            <InputNumber
              value={editedRecord.costEstimate}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              addonAfter="₫"
              onChange={(value) =>
                setEditedRecord((prev: any) => ({
                  ...prev,
                  costEstimate: value,
                }))
              }
            />
          );
        }
        return cost.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (_: string, record: any) => {
        const isEditing = editingKey === record.expenseType;
        return isEditing ? (
          <Space size="small">
            <Button
              icon={<SaveOutlined />}
              onClick={handleSaveEdit}
              type="link"
              style={{ color: "#52c41a" }}
            />
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancelEdit}
              type="link"
              danger
            />
          </Space>
        ) : (
          <Space size="small">
            <Button
              icon={<SettingOutlined />}
              onClick={() => startEditing(record)}
              type="link"
            />
            <Button
              icon={<UserDeleteOutlined />}
              onClick={() => {
                setSelectedCostEstimate(record);
                setIsModalDelete(true);
              }}
              type="link"
              danger
            />
          </Space>
        );
      },
    },
  ];

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return listCostEstimate.slice(startIndex, endIndex);
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: listCostEstimate.length,
    onChange: (page: number, pageSize: number) => {
      setCurrentPage(page);
      setPageSize(pageSize);
    },
  };

  const handleDelete = () => {
    setIsConfirmingDelete(true);
    toast
      .promise(
        UserService.deleteCostEstimate(selectedCostEstimate.expenseType),
        {
          pending: `Phòng đang được xóa`,
          success: `Xóa phòng thành công`,
        }
      )
      .then(() => {
        fetchListCostEstimate();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsConfirmingDelete(false);
        setIsModalDelete(false);
      });
  };

  return (
    <Modal
      title={"Quản lý chi tiêu ước tính"}
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      cancelText="Hủy"
      width={"50%"}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddExpense}
        initialValues={{ expenseType: expenseTypes[0].value }}
      >
        <Row gutter={[16, 16]} justify="space-between" align="bottom">
          <Col xs={24} sm={12} md={8} lg={8}>
            <Form.Item
              name="expenseType"
              label="Loại chi tiêu"
              rules={[
                { required: true, message: "Vui lòng chọn loại chi tiêu" },
              ]}
            >
              <Select
                showSearch
                style={{ width: "100%", minWidth: "200px" }}
                popupMatchSelectWidth={false}
                filterOption={(inputValue, option) => {
                  const searchText = removeVietnameseTones(inputValue);
                  const optionText = removeVietnameseTones(
                    option?.children?.toString() || ""
                  );
                  return optionText.includes(searchText);
                }}
                filterSort={(optionA, optionB) =>
                  removeVietnameseTones(
                    optionA?.children?.toString() || ""
                  ).localeCompare(
                    removeVietnameseTones(optionB?.children?.toString() || "")
                  )
                }
              >
                {expenseTypes.map((expense) => (
                  <Option key={expense.value} value={expense.value}>
                    {expense.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8}>
            <Form.Item
              name="costEstimate"
              label="Tổng tiền"
              rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
            >
              <InputNumber
                style={{ width: "100%", minWidth: "200px" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter="₫"
                placeholder="Nhập tổng tiền"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={isConfirming ? <LoadingOutlined /> : <PlusOutlined />}
                style={{ width: "100%", minWidth: "200px" }}
                disabled={isConfirming}
              >
                {isConfirming ? "Đang xử lý" : "Thêm"}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={getPaginatedData()}
        scroll={{ x: "max-content" }}
        pagination={paginationConfig}
        rowKey="expenseType"
      />

      <ConfirmPopup
        isConfirming={isConfirmingDelete}
        isModalDelete={isModalDelete}
        handleDelete={handleDelete}
        setIsModalDelete={setIsModalDelete}
        message={<p>Bạn có chắc chắn muốn xóa loại chi tiêu này không?</p>}
      />
    </Modal>
  );
}

export default ManagerCostEstimate;
