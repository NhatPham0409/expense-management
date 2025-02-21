"use client";

import React, { useState } from "react";
import { Modal, Input, Form, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { AuthService } from "@/service";

interface ChangePasswordModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  onSuccessfullyCreated: () => void;
}

const ChangePasswordModal = ({
  isModalVisible,
  setIsModalVisible,
  onSuccessfullyCreated,
}: ChangePasswordModalProps) => {
  const [form] = Form.useForm();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleOk = async () => {
    form.validateFields().then((values) => {
      setIsConfirming(true);

      try {
        const { oldPassword, newPassword, confirmPassword } = values;

        if (newPassword !== confirmPassword) {
          toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
          return;
        }

        toast
          .promise(AuthService.changePassword({ oldPassword, newPassword }), {
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
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setIsConfirming(false);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Đổi mật khẩu"
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
            <span className="ml-1">Cập nhật</span>
          </p>
        )
      }
    >
      <Form form={form} layout="vertical" name="change-password-form">
        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu cũ" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
            // Thêm validator để kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp hay không
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu mới" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
