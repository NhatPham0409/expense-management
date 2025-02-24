"use client";

import { useCallback, useEffect, useState } from "react";
import { Modal, Form, Input, Select, Spin } from "antd";
import { HouseService, UserService } from "@/service";
import { IUser } from "@/types/user.type";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import { useUserContext } from "@/app/app-provider";
import { IHouse } from "@/types/house.type";

interface AddUserModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  onSuccessfullyCreated: () => void;
  houseInfor: IHouse | null;
}

function AddUserModal({
  isModalVisible,
  setIsModalVisible,
  onSuccessfullyCreated,
  houseInfor,
}: AddUserModalProps) {
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
        const memberIds = houseInfor?.member?.map((member) => member._id) || [];
        const filteredUsers = response.data.users.filter(
          (user: IUser) => !memberIds.includes(user._id)
        );
        setListUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching house list:", error);
    } finally {
      setIsLoading(false);
    }
  }, [houseInfor]);

  useEffect(() => {
    fetchListUsers();
  }, [fetchListUsers]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      setIsConfirming(true);
      try {
        const payload = {
          houseId: houseInfor?._id,
          listMember: selectedUsers,
        };

        toast
          .promise(HouseService.addMember(payload), {
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
      title="Thêm thành viên vào nhóm"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Thêm"
      cancelText="Hủy"
      confirmLoading={isConfirming}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="users" label="Thêm thành viên">
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Chọn thành viên"
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

export default AddUserModal;
