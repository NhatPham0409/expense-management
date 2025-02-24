"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Input, Spin } from "antd";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import { IHouse } from "@/types/house.type";
import { HouseService } from "@/service";

interface AddTelegramModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  onSuccessfullyCreated: () => void;
  houseInfor: IHouse | null;
}

function AddTelegramModal({
  isModalVisible,
  setIsModalVisible,
  onSuccessfullyCreated,
  houseInfor,
}: AddTelegramModalProps) {
  const [form] = Form.useForm();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleOk = () => {
    form.validateFields().then((values) => {
      setIsConfirming(true);
      try {
        const payload = {
          houseId: houseInfor?._id,
          teleId: values.teleId,
        };

        toast
          .promise(HouseService.addTeleInfo(payload), {
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

    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Liên kết telegram"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Liên kết"
      cancelText="Hủy"
      confirmLoading={isConfirming}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="teleId"
          label="Telegram ID"
          rules={[{ required: true, message: "Vui lòng nhập thông tin!" }]}
        >
          <Input placeholder="Nhập thông tin" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddTelegramModal;
