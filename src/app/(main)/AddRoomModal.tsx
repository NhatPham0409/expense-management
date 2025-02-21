"use client";

import { useCallback, useEffect, useState } from "react";
import { Modal, Form, Input, Select, Spin } from "antd";
import { HouseService, UserService } from "@/service";
import { IUser } from "@/types/user.type";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import { useUserContext } from "@/app/app-provider";

interface AddRoomModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  onSuccessfullyCreated: () => void;
}

function AddRoomModal({
  isModalVisible,
  setIsModalVisible,
  onSuccessfullyCreated,
}: AddRoomModalProps) {
  const { userInfor } = useUserContext();

  const [form] = Form.useForm();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listUsers, setListUsers] = useState<IUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const fetchListUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await UserService.getListUsers();

      if (response.data) {
        const filteredUsers = response.data.users.filter(
          (user: IUser) => userInfor && user._id !== userInfor._id
        );
        setListUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching house list:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userInfor]);

  useEffect(() => {
    fetchListUsers();
  }, [fetchListUsers]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      setIsConfirming(true);
      try {
        const payload = {
          name: values.name,
          des: values.description,
          member: selectedUsers,
        };

        toast
          .promise(HouseService.createHouse(payload), {
            pending: "Đang xử lý dữ liệu",
          })
          .then((res) => {
            toast.success(res.data.message);
            handleCancel();
            onSuccessfullyCreated();
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

  const handleCancel = () => {
    form.resetFields();
    setSelectedUsers([]);
    setIsModalVisible(false);
  };

  const handleUserChange = (value: string[]) => {
    setSelectedUsers(value);
  };

  const formatUsers = listUsers.map((user) => ({
    value: user._id,
    label: user.name,
  }));

  return (
    <Modal
      title="Thêm phòng mới"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ disabled: isConfirming }}
      cancelText={
        <p>
          <span className="ml-1">Hủy</span>
        </p>
      }
      okText={
        isConfirming ? (
          <div>
            <Spin indicator={<LoadingOutlined />} size="small" />
            <span className="ml-2">Đang xử lý</span>
          </div>
        ) : (
          <p>
            <span className="ml-1">Thêm</span>
          </p>
        )
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên phòng"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="users" label="Thêm người dùng">
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Chọn người dùng"
            onChange={handleUserChange}
            optionFilterProp="label"
            options={formatUsers}
            loading={isLoading}
            disabled={isLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddRoomModal;
