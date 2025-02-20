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
} from "antd";
import {
  PlusOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  DollarOutlined,
  SettingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Pie } from "@ant-design/charts";
import { formatCurrency, getBalanceColor } from "@/utils/utils";
import ExpenseChart from "@/app/(main)/[id]/components/ExpenseChart";

const { Title } = Typography;
const { Option } = Select;

const initialRoomMembers = ["Alice", "Bob", "Charlie", "David"];

type Expense = {
  buyer: string;
  amount: number;
  note: string;
  shares: { [key: string]: number };
};

export default function RoomExpenses() {
  const [form] = Form.useForm();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [roomMembers, setRoomMembers] = useState(initialRoomMembers);
  const [shares, setShares] = useState<{ [key: string]: number }>(
    Object.fromEntries(roomMembers.map((member) => [member, 1]))
  );
  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [isRemoveMemberModalVisible, setIsRemoveMemberModalVisible] =
    useState(false);
  const [memberToRemove, setMemberToRemove] = useState("");

  const handleAddExpense = (values: any) => {
    const newExpense: Expense = {
      ...values,
      shares: { ...shares },
    };
    setExpenses([...expenses, newExpense]);
    form.resetFields();
  };

  const handleShareChange = (member: string, value: number) => {
    setShares({ ...shares, [member]: value });
  };

  const handleAddMember = () => {
    if (newMemberName && !roomMembers.includes(newMemberName)) {
      setRoomMembers([...roomMembers, newMemberName]);
      setShares({ ...shares, [newMemberName]: 1 });
      setNewMemberName("");
      setIsAddMemberModalVisible(false);
    }
  };

  const handleRemoveMember = (memberToRemove: string) => {
    if (memberToRemove) {
      const updatedMembers = roomMembers.filter(
        (member) => member !== memberToRemove
      );
      setRoomMembers(updatedMembers);
      const { [memberToRemove]: _, ...updatedShares } = shares;
      setShares(updatedShares);
      setMemberToRemove("");
    }
  };

  const handleSettleDebts = () => {
    console.log("Settling debts...");
  };

  const columns = [
    {
      title: "Người mua",
      dataIndex: "buyer",
      key: "buyer",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) =>
        amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    ...roomMembers.map((member) => ({
      title: member,
      dataIndex: member,
      key: member,
      render: (value: number, record: Expense) => {
        const share = record.shares[member];
        return share;
      },
    })),
  ];

  const dropdownItems: MenuProps["items"] = [
    {
      key: "home",
      label: "Quản lý thông tin phòng",
      icon: <HomeOutlined />,
      onClick: () => setIsAddMemberModalVisible(true),
    },
    {
      key: "add",
      label: " Thêm thành viên",
      icon: <UserAddOutlined />,
      onClick: () => setIsAddMemberModalVisible(true),
    },
    {
      key: "remove",
      label: "Xóa thành viên",
      icon: <UserDeleteOutlined />,
      onClick: () => setIsRemoveMemberModalVisible(true),
    },
    {
      key: "settle",
      label: "Thanh toán dư nợ",
      icon: <DollarOutlined />,
      onClick: handleSettleDebts,
    },
  ];

  const shareContent = (
    <Form.Item name="shares" initialValue={shares}>
      <Space direction="vertical" style={{ width: 250 }}>
        {roomMembers.map((member) => (
          <Space
            key={member}
            className="flex items-center justify-between w-full"
          >
            <span>{member}</span>
            <Select
              defaultValue={shares[member]}
              onChange={(value) => handleShareChange(member, value)}
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

  return (
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
              rules={[{ required: true, message: "Vui lòng chọn người mua" }]}
            >
              <Select placeholder="Chọn người mua">
                {roomMembers.map((member) => (
                  <Option key={member} value={member}>
                    {member}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={5}>
            <Form.Item
              name="amount"
              label="Tổng tiền"
              rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
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

          <Col xs={24} sm={12} md={6} lg={5}>
            <Form.Item name="note" label="Ghi chú">
              <Input placeholder="Nhập ghi chú" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={5}>
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
                icon={<PlusOutlined />}
                style={{ width: "100%" }}
              >
                Thêm mới
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 mb-4">
        <Card
          title="Biểu đồ chi phí"
          className="w-full md:w-1/2 flex-grow mb-4 md:mb-0"
        >
          <ExpenseChart />
        </Card>
        <Card title="Thông tin dư nợ" className="w-full md:w-1/2 flex-grow">
          <div className="flex flex-col h-full justify-between">
            <ul className="list-none p-0 mb-4">
              {roomMembers.map((member) => {
                return (
                  <li
                    key={member}
                    className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-base md:text-lg font-medium">
                      {member}
                    </span>
                    <div className="flex items-center">
                      <span
                        className={`text-base md:text-lg font-semibold ${getBalanceColor(
                          1000000
                        )}`}
                      >
                        {formatCurrency(1000000)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={expenses}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title="Thêm thành viên mới"
        open={isAddMemberModalVisible}
        onOk={handleAddMember}
        onCancel={() => setIsAddMemberModalVisible(false)}
      >
        <Input
          placeholder="Nhập tên thành viên mới"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
        />
      </Modal>

      <Modal
        title="Xóa thành viên"
        open={isRemoveMemberModalVisible}
        onOk={() => {
          handleRemoveMember(memberToRemove);
          setIsRemoveMemberModalVisible(false);
        }}
        onCancel={() => setIsRemoveMemberModalVisible(false)}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn thành viên cần xóa"
          onChange={(value) => setMemberToRemove(value)}
        >
          {roomMembers.map((member) => (
            <Option key={member} value={member}>
              {member}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}
