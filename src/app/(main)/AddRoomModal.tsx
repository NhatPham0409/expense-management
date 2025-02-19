"use client";

import { useState } from "react";
import { Modal, Form, Input, Select } from "antd";

interface AddRoomModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
}

const mockUsers = [
  { value: "1", label: "User 1" },
  { value: "2", label: "User 2" },
  { value: "3", label: "User 3" },
  { value: "4", label: "User 4" },
  { value: "5", label: "User 5" },
];

function AddRoomModal({
  isModalVisible,
  setIsModalVisible,
}: AddRoomModalProps) {
  const [form] = Form.useForm();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log({ ...values, users: selectedUsers });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedUsers([]);
    setIsModalVisible(false);
  };

  const handleUserChange = (value: string[]) => {
    setSelectedUsers(value);
  };

  return (
    <Modal
      title="Thêm phòng mới"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên phòng"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả phòng!" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="users"
          label="Thêm người dùng"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ít nhất một người dùng!",
            },
          ]}
        >
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Chọn người dùng"
            onChange={handleUserChange}
            optionFilterProp="label"
            options={mockUsers}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddRoomModal;
