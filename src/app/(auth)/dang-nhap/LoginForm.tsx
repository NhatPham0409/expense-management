"use client";

import { useState } from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AuthService } from "@/service";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { email, password } = values;

      toast
        .promise(AuthService.login({ email, password }), {
          pending: "Đang xử lý dữ liệu",
        })
        .then((res) => {
          toast.success(res.data.message);
          router.push("/");
        })
        .catch((err) => {
          const errorMessage = err.response.data.message;
          toast.error(errorMessage);
        });
    } catch (error: any) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
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
