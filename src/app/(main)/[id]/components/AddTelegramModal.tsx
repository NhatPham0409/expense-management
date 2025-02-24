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
          updateData: {
            name: values.name,
            des: values.des,
          },
        };

        toast
          .promise(HouseService.updateHouse(payload), {
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

  useEffect(() => {
    if (houseInfor) {
      form.setFieldsValue({
        name: houseInfor.name,
        des: houseInfor.des,
      });
    }
  }, [houseInfor, form]);

  return (
    <Modal
      title="Thay đổi thông tin phòng"
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
        <Form.Item name="des" label="Mô tả">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddTelegramModal;
