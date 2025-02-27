"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Input, Spin, InputNumber } from "antd";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import { UserService } from "@/service"; // Giả sử bạn đã có service để thêm/sửa
import { IIncome } from "@/types/income.type";

interface CreateUpdateIncomeModalProps {
  onCancel: () => void;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  onSuccessfullyCreated: () => void;
  incomeInfor?: IIncome | null;
}

function CreateUpdateIncomeModal({
  isModalVisible,
  setIsModalVisible,
  onSuccessfullyCreated,
  incomeInfor,
  onCancel,
}: CreateUpdateIncomeModalProps) {
  const [form] = Form.useForm();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsConfirming(true);

      let payload = values;

      if (incomeInfor) {
        payload = { ...payload, incomeId: incomeInfor._id };
        toast
          .promise(UserService.updateIncome(payload), {
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
      } else {
        toast
          .promise(UserService.createIncome(payload), {
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
      }

      onSuccessfullyCreated();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (incomeInfor) {
      form.setFieldsValue({
        note: incomeInfor.note,
        cost: incomeInfor.cost,
      });
    } else {
      form.resetFields();
    }
  }, [incomeInfor, form]);

  return (
    <Modal
      title={incomeInfor ? "Cập nhật thông tin thu nhập" : "Thêm thu nhập mới"}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="Hủy"
      okText={incomeInfor ? "Cập nhật" : "Thêm"}
      confirmLoading={isConfirming}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="note"
          label="Ghi chú"
          rules={[{ required: true, message: "Vui lòng nhập ghi chú!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="cost"
          label="Giá tiền"
          rules={[
            { required: true, message: "Vui lòng nhập giá tiền!" },
            {
              pattern: /^[0-9]+$/,
              message: "Giá tiền phải là số nguyên dương!",
            },
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
      </Form>
    </Modal>
  );
}

export default CreateUpdateIncomeModal;
