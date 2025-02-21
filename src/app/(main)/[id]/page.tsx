"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Select,
  Input,
  InputNumber,
  Button,
  Space,
  Table,
  Popover,
  Row,
  Col,
  Form,
  Modal,
  Dropdown,
  type MenuProps,
  Card,
  Spin,
} from "antd";
import {
  PlusOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  DollarOutlined,
  SettingOutlined,
  HomeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "@/utils/utils";
import ExpenseChart from "@/app/(main)/[id]/components/ExpenseChart";
import type { IHouse } from "@/types/house.type";
import { HouseService } from "@/service";
import { useParams } from "next/navigation";
import { EXPENSE_TYPE } from "@/utils/constant";
import { IExpense } from "@/types/expense.type";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ConfirmPopup from "@/components/ConfirmPopup";

interface DebtType {
  userId: string;
  name: string;
  balance: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const { Title } = Typography;
const { Option } = Select;

type Expense = {
  buyer: string;
  amount: number;
  note: string;
  shares: { [key: string]: number };
};

export default function RoomExpenses() {
  const [form] = Form.useForm();
  const [houseInfor, setHouseInfor] = useState<IHouse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams();
  const houseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [roomMembers, setRoomMembers] = useState<IHouse["member"]>([]);
  const [shares, setShares] = useState<{ [key: string]: number }>({});
  const [expenseType, setExpenseType] = useState<string>(EXPENSE_TYPE[0].value);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);
  const [calculateDebt, setCalculateDebt] = useState<DebtType[]>([]);

  const fetchHouseInfor = async () => {
    setIsLoading(true);
    try {
      if (houseId) {
        const responseHouseInfor = await HouseService.getHouseInfor(houseId);

        if (responseHouseInfor.data) {
          const houseInfo = responseHouseInfor.data.houseInfo;
          setHouseInfor(houseInfo);

          const initialShares = Object.fromEntries(
            houseInfo.member.map((member: any) => [member._id, 1])
          );
          setShares(initialShares);
          setRoomMembers(houseInfo.member);
        }

        try {
          const responseCalculate = await HouseService.calculateDebt(houseId);
          if (responseCalculate.data) {
            setCalculateDebt(responseCalculate.data.debt);
          }
        } catch (error) {
          console.error("Lỗi khi tính toán dư nợ:", error);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phòng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log({ houseInfor });
  useEffect(() => {
    fetchHouseInfor();
  }, [houseId]);

  const handleShareChange = (memberId: string, value: number) => {
    setShares((prevShares) => ({
      ...prevShares,
      [memberId]: value,
    }));
  };

  const shareContent = (
    <Form.Item name="shares" initialValue={shares}>
      <Space direction="vertical" style={{ width: 250 }}>
        {roomMembers.map((member) => (
          <Space
            key={member._id}
            className="flex items-center justify-between w-full"
          >
            <span>{member.name}</span>
            <Select
              value={shares[member._id] || 1}
              onChange={(value) => handleShareChange(member._id, value)}
              style={{ width: 100, textAlign: "center" }}
            >
              {[...Array(21)].map((_, index) => (
                <Option key={index} value={index}>
                  {index}
                </Option>
              ))}
            </Select>
          </Space>
        ))}
      </Space>
    </Form.Item>
  );

  const handleAddExpense = (values: any) => {
    form.validateFields().then((values) => {
      setIsConfirming(true);
      try {
        const newExpense = {
          idHouse: houseId,
          buyer: values.buyer,
          cost: values.amount,
          note: values.note || "",
          expenseType: expenseType,
          share: shares,
        };

        toast
          .promise(HouseService.createExpense(newExpense), {
            pending: "Đang xử lý dữ liệu",
          })
          .then((res) => {
            toast.success(res.data.message);
            fetchHouseInfor();
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
    });
  };

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
      render: (note: string, record: IExpense) =>
        `${record.expenseType}: ${note}`,
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
      render: (text: string, record: IExpense) => (
        <Space size="small">
          <Button
            icon={<SettingOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
          ></Button>
          <Button
            icon={<UserDeleteOutlined />}
            onClick={() => {
              setSelectedExpense(record);
              setIsModalDelete(true);
            }}
            type="link"
            danger
          ></Button>
        </Space>
      ),
    },
  ];

  const dropdownItems: MenuProps["items"] = [
    {
      key: "home",
      label: "Quản lý thông tin phòng",
      icon: <HomeOutlined />,
      onClick: () => console.log("Manage room info"),
    },
    {
      key: "add",
      label: "Thêm thành viên",
      icon: <UserAddOutlined />,
      onClick: () => console.log("Add member"),
    },
    {
      key: "remove",
      label: "Xóa thành viên",
      icon: <UserDeleteOutlined />,
      onClick: () => console.log("Remove member"),
    },
    {
      key: "settle",
      label: "Thanh toán dư nợ",
      icon: <DollarOutlined />,
      onClick: () => console.log("Settle debt"),
    },
  ];

  const handleEdit = (record: IExpense) => {
    console.log("Chỉnh sửa:", record);
  };

  const handleDeleteExpenses = () => {
    if (selectedExpense) {
      setIsConfirmingDelete(true);
      toast
        .promise(HouseService.deleteExpense(selectedExpense._id), {
          pending: `Từ khoá đang được xóa `,
          success: `Xóa từ khoá thành công`,
        })
        .then(() => {
          fetchHouseInfor();
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
    >
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full min-h-[400px]"
          >
            <Spin size="large" />
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-base font-medium text-indigo-600"
            >
              Đang tải dữ liệu...
            </motion.p>
          </motion.div>
        ) : (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            <div className="flex items-start gap-2 justify-start mb-4">
              <Title level={3} className="text-xl md:text-2xl">
                Quản lý chi phí phòng: A0701
              </Title>

              <Dropdown menu={{ items: dropdownItems }} placement="bottomLeft">
                <Button icon={<SettingOutlined />} shape="circle"></Button>
              </Dropdown>
            </div>

            <Form form={form} layout="vertical" onFinish={handleAddExpense}>
              <Row gutter={[16, 16]} justify="space-between" align={"bottom"}>
                <Col xs={24} sm={12} md={6} lg={5}>
                  <Form.Item
                    name="buyer"
                    label="Người mua"
                    rules={[
                      { required: true, message: "Vui lòng chọn người mua" },
                    ]}
                  >
                    <Select placeholder="Chọn người mua">
                      {houseInfor?.member.map((member) => (
                        <Option key={member._id} value={member._id}>
                          {member.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6} lg={5}>
                  <Form.Item
                    name="amount"
                    label="Tổng tiền"
                    rules={[
                      { required: true, message: "Vui lòng nhập tổng tiền" },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      addonAfter="₫"
                      placeholder="Nhập tổng tiền"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6} lg={6}>
                  <Form.Item name="note" label="Ghi chú">
                    <Space.Compact style={{ width: "100%" }}>
                      <Select
                        defaultValue={expenseType}
                        style={{ width: 140 }}
                        popupMatchSelectWidth={false}
                        onChange={(value) => setExpenseType(value)}
                      >
                        {EXPENSE_TYPE.map((expense) => (
                          <Option key={expense.value} value={expense.value}>
                            {expense.label}
                          </Option>
                        ))}
                      </Select>
                      <Input style={{ flex: 1 }} placeholder="Nhập ghi chú" />
                    </Space.Compact>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6} lg={4}>
                  <Form.Item label="Chia tỉ lệ">
                    <Popover
                      content={shareContent}
                      title="Chia tỉ lệ"
                      trigger="click"
                      placement="bottomRight"
                    >
                      <Button style={{ width: "100%" }}>Chia tỉ lệ</Button>
                    </Popover>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24} lg={4}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={
                        isConfirming ? <LoadingOutlined /> : <PlusOutlined />
                      }
                      style={{ width: "100%" }}
                      disabled={isConfirming}
                    >
                      {isConfirming ? (
                        <span className="ml-2">Đang xử lý</span>
                      ) : (
                        <p>
                          <span className="ml-1">Thêm</span>
                        </p>
                      )}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <div className="flex flex-col-reverse md:flex-row items-stretch justify-between gap-4 mb-4">
              <Card
                title="Biểu đồ chi phí"
                className="w-full md:w-1/2 flex-grow mb-4 md:mb-0"
              >
                <ExpenseChart houseId={houseId} />
              </Card>
              <Card
                title="Thông tin dư nợ"
                className="w-full md:w-1/2 flex-grow"
              >
                <div className="flex flex-col h-full justify-between">
                  <ul className="list-none p-0 mb-4">
                    {calculateDebt.map((member, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 last:border-b-0"
                      >
                        <span className="text-base md:text-lg font-medium">
                          {member.name}
                        </span>
                        <div className="flex items-center">
                          <span
                            className={`text-base md:text-lg font-semibold ${
                              member.balance > 0
                                ? "text-green-600"
                                : member.balance < 0
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {formatCurrency(member.balance)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>

            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={houseInfor?.expenses || []}
                scroll={{ x: "max-content" }}
              />
            </div>

            <ConfirmPopup
              isConfirming={isConfirmingDelete}
              isModalDelete={isModalDelete}
              handleDelete={handleDeleteExpenses}
              setIsModalDelete={setIsModalDelete}
              message={<p>Bạn có chắc chắn muốn xóa chi phí này không?</p>}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
