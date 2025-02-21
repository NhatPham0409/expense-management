"use client";

import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { toast } from "react-toastify";
import { AuthService } from "@/service";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { email, name } = values;

      toast
        .promise(AuthService.register({ email, name }), {
          pending: "Đang xử lý dữ liệu",
        })
        .then((res) => {
          toast.success(res.data.message);
          router.push("/dang-nhap");
        })
        .catch((err) => {
          const errorMessage = err.response.data.message;
          toast.error(errorMessage);
        });
    } catch (error) {
      console.error("Error:", error);
      message.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="register"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email" },
          { type: "email", message: "Email không hợp lệ" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
      </Form.Item>
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Họ tên" size="large" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full bg-green-500 hover:bg-green-600"
          size="large"
          loading={loading}
        >
          Đăng ký
        </Button>
      </Form.Item>
      <div className="text-center">
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="text-blue-500 hover:text-blue-600">
          Đăng nhập
        </Link>
      </div>
    </Form>
  );
}
