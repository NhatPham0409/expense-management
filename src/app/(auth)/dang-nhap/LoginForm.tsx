"use client";

import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/service/authenticationService";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { email, password } = values;

      const response = await login(email, password);
      console.log("Login response:", response);

      message.success("Đăng nhập thành công!");

      // router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      message.error("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Vui lòng nhập email" }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mật khẩu"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Link
          href="/forgot-password"
          className="float-right text-blue-500 hover:text-blue-600"
        >
          Quên mật khẩu
        </Link>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full bg-blue-500 hover:bg-blue-600"
          size="large"
          loading={loading}
        >
          Đăng nhập
        </Button>
      </Form.Item>
      <div className="text-center">
        Bạn vẫn chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="text-blue-500 hover:text-blue-600">
          Đăng ký ngay
        </Link>
      </div>
    </Form>
  );
}
