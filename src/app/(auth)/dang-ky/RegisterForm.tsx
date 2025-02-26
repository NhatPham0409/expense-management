"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { AuthService } from "@/service";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (message && !isError && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      router.push("/dang-nhap");
    }
    return () => clearTimeout(timer);
  }, [message, isError, countdown, router]);

  const onFinish = async (values: any) => {
    setLoading(true);
    setMessage("");
    setIsError(false);
    try {
      const { email, name } = values;
      const response = await AuthService.register({ email, name });
      setMessage(response.data.message);
      setCountdown(10);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setMessage(errorMessage);
      setIsError(true);
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

      {loading && (
        <div className="text-center mt-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {message && (
        <div
          className={`mt-6 p-4 ${
            isError
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          } border rounded-lg shadow-md`}
        >
          <div className="flex items-center justify-center">
            <p
              className={`text-base font-semibold ${
                isError ? "text-red-700" : "text-green-700"
              }`}
            >
              {message}
            </p>
          </div>
          {!isError && (
            <>
              <div className="text-center">
                <p className="text-sm text-green-600">
                  Chuyển hướng đến trang đăng nhập sau
                </p>
                <span className="text-2xl font-bold text-green-700">
                  {countdown}
                </span>
                <span className="text-sm text-green-600"> giây</span>
              </div>
              <div className="mt-3 bg-green-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-green-500 transition-all duration-1000 ease-out"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="text-center mt-4">
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="text-blue-500 hover:text-blue-600">
          Đăng nhập
        </Link>
      </div>
    </Form>
  );
}
