"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Select,
  Input,
  InputNumber,
  Button,
  Space,
  Popover,
  Row,
  Col,
  Form,
  Dropdown,
  type MenuProps,
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
import ExpenseChart from "@/app/(main)/[id]/components/ExpenseChart";
import type { IHouse } from "@/types/house.type";
import { HouseService } from "@/service";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { expenseTypes } from "@/utils/constant";
import RoomManagerModal from "@/app/(main)/[id]/components/RoomManagerModal";
import AddUserModal from "@/app/(main)/[id]/components/AddUserModal";
import AddTelegramModal from "@/app/(main)/[id]/components/AddTelegramModal";
import ExpenseTable from "@/app/(main)/[id]/components/ExpenseTable";
import ExpenseDebt from "@/app/(main)/[id]/components/ExpenseDebt";
import RemoveUserModal from "@/app/(main)/[id]/components/RemoveUserModal";
import { useUserContext } from "@/app/app-provider";
import ConfirmPopup from "@/components/ConfirmPopup";
import ExpenseFilter from "@/app/(main)/[id]/components/ExpenseFilter";
import { removeVietnameseTones } from "@/utils/utils";

export interface DebtType {
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

export default function RoomExpenses() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [houseInfor, setHouseInfor] = useState<IHouse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams();
  const houseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [roomMembers, setRoomMembers] = useState<IHouse["member"]>([]);
  const [shares, setShares] = useState<{ [key: string]: number }>({});
  const [expenseType, setExpenseType] = useState<string>(expenseTypes[0].value);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isModalRoomManager, setIsModalRoomManager] = useState<boolean>(false);
  const [isModalAddUser, setIsModalAddUser] = useState<boolean>(false);
  const [isModalRemoveUser, setIsModalRemoveUser] = useState<boolean>(false);
  const [isModalAddTele, setIsModalAddTele] = useState<boolean>(false);
  const [isModalDeleteRoom, setIsModalDeleteRoom] = useState<boolean>(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  const handleFilter = (
    selectedYear: number | null,
    selectedMonth: number | null
  ) => {
    setYear(selectedYear);
    setMonth(selectedMonth);
    setLastUpdated(Date.now());
  };

  const { userInfor } = useUserContext();

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
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phòng:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
              value={shares[member._id] ?? 1}
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

  const handleAddExpense = () => {
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

  const checkIfUserIsAdmin = (): boolean => {
    if (!userInfor || !houseInfor) {
      return false;
    }

    return userInfor._id === houseInfor.admin._id;
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "home",
      label: "Quản lý thông tin phòng",
      icon: <HomeOutlined />,
      onClick: () => setIsModalRoomManager(true),
    },
    {
      key: "add",
      label: "Thêm thành viên",
      icon: <UserAddOutlined />,
      onClick: () => setIsModalAddUser(true),
    },
    ...(checkIfUserIsAdmin()
      ? [
          {
            key: "remove",
            label: "Xóa thành viên",
            icon: <UserDeleteOutlined />,
            onClick: () => setIsModalRemoveUser(true),
          },
          {
            key: "removeRoom",
            label: "Xóa phòng",
            icon: <UserDeleteOutlined />,
            onClick: () => setIsModalDeleteRoom(true),
          },
        ]
      : []),
    {
      key: "addTele",
      label: "Liên kết telegram",
      icon: <UserDeleteOutlined />,
      onClick: () => setIsModalAddTele(true),
    },
  ];

  const handleDeleteRoom = () => {
    if (houseInfor) {
      setIsConfirmingDelete(true);
      toast
        .promise(HouseService.deleteHouse(houseInfor._id), {
          pending: `Phòng đang được xóa`,
          success: `Xóa phòng thành công`,
        })
        .then(() => {
          router.push(`/`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setIsConfirmingDelete(false);
          setIsModalDeleteRoom(false);
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
                Quản lý chi phí phòng: {houseInfor?.name}
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
                        showSearch
                        defaultValue={expenseType}
                        style={{ width: 140 }}
                        popupMatchSelectWidth={false}
                        onChange={(value) => setExpenseType(value)}
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
                            removeVietnameseTones(
                              optionB?.children?.toString() || ""
                            )
                          )
                        }
                      >
                        {expenseTypes.map((expense) => (
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

            <ExpenseFilter onFilter={handleFilter} />

            <div className="flex flex-col-reverse md:flex-row items-stretch justify-between gap-4 mb-4">
              <ExpenseChart
                houseId={houseId}
                lastUpdated={lastUpdated}
                year={year}
                month={month}
              />
              <ExpenseDebt houseId={houseId} lastUpdated={lastUpdated} />
            </div>

            <div className="overflow-x-auto">
              <ExpenseTable
                houseInfor={houseInfor}
                roomMembers={roomMembers}
                onUpdated={() => setLastUpdated(Date.now())}
                year={year}
                month={month}
              />
            </div>

            <RoomManagerModal
              isModalVisible={isModalRoomManager}
              setIsModalVisible={setIsModalRoomManager}
              onSuccessfullyCreated={fetchHouseInfor}
              houseInfor={houseInfor}
            />

            <AddTelegramModal
              isModalVisible={isModalAddTele}
              setIsModalVisible={setIsModalAddTele}
              onSuccessfullyCreated={fetchHouseInfor}
              houseInfor={houseInfor}
            />

            <AddUserModal
              isModalVisible={isModalAddUser}
              setIsModalVisible={setIsModalAddUser}
              onSuccessfullyCreated={fetchHouseInfor}
              houseInfor={houseInfor}
            />

            <RemoveUserModal
              isModalVisible={isModalRemoveUser}
              setIsModalVisible={setIsModalRemoveUser}
              onSuccessfullyRemoved={fetchHouseInfor}
              houseInfor={houseInfor}
            />

            <ConfirmPopup
              isConfirming={isConfirmingDelete}
              isModalDelete={isModalDeleteRoom}
              handleDelete={handleDeleteRoom}
              setIsModalDelete={setIsModalDeleteRoom}
              message={<p>Bạn có chắc chắn muốn xóa phòng này không?</p>}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
