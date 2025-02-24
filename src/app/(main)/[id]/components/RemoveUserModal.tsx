"use client";

import { useState } from "react";
import { Modal, List, Radio, Typography, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { IHouse } from "@/types/house.type";
import { toast } from "react-toastify";
import { HouseService } from "@/service";

const { Text } = Typography;

interface RemoveUserModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  onSuccessfullyRemoved: () => void;
  houseInfor: IHouse | null;
}

function RemoveUserModal({
  isModalVisible,
  setIsModalVisible,
  onSuccessfullyRemoved,
  houseInfor,
}: RemoveUserModalProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleOk = () => {
    setIsConfirming(true);
    try {
      const payload = {
        houseId: houseInfor?._id,
        member: selectedUser,
      };

      toast
        .promise(HouseService.deleteMember(payload), {
          pending: "Đang xử lý dữ liệu",
        })
        .then((res) => {
          toast.success(res.data.message);
          handleCancel();
          onSuccessfullyRemoved();
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

  const handleCancel = () => {
    setSelectedUser(null);
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Xóa thành viên khỏi nhóm"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Xóa thành viên"
      cancelText="Hủy"
      confirmLoading={isConfirming}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Text>Chọn thành viên bạn muốn xóa khỏi nhóm:</Text>
        <List
          dataSource={houseInfor?.member || []}
          renderItem={(user) => (
            <List.Item key={user._id}>
              <Radio
                value={user._id}
                checked={selectedUser === user._id}
                onChange={() => setSelectedUser(user._id)}
              >
                <Space>
                  <Text>{user.name}</Text>
                </Space>
              </Radio>
            </List.Item>
          )}
        />
        {selectedUser && (
          <Text type="warning">
            <ExclamationCircleOutlined className="mr-2" />
            Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?
          </Text>
        )}
      </Space>
    </Modal>
  );
}

export default RemoveUserModal;
