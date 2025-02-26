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
      title="Đăng ký bot chat Telegram"
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
      <div className="max-w-2xl mx-auto bg-white rounded-lg ">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Hướng dẫn đăng ký bot chat Telegram
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>
            Đăng nhập <strong>Telegram</strong>, tìm{" "}
            <span className="font-semibold text-blue-600">@expManage_bot</span>{" "}
            để thêm vào nhóm.
          </li>
          <li>
            Nhắn vào nhóm{" "}
            <code className="bg-gray-100 px-2 py-1 rounded-md">/getId</code> để
            lấy Id của chat.
          </li>
          <li>
            Sao chép <strong>Id</strong> (kể cả dấu{" "}
            <code className="bg-gray-100 px-2 py-1 rounded-md">-</code>) và dán
            vào ô nhập bên trên.
          </li>
        </ol>
        <p className="mt-4 text-gray-700">
          <span className="font-semibold">Bot chat Telegram</span> sẽ thông báo
          cho bạn khi có phát sinh thêm, xoá hoặc sửa chi tiêu trong nhà và
          nhiều tính năng khác.
        </p>
      </div>
    </Modal>
  );
}

export default AddTelegramModal;
