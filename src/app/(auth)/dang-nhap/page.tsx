import LoginForm from "@/app/(auth)/dang-nhap/LoginForm";
import Title from "antd/es/typography/Title";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <Title level={4} className="text-center mb-6 capitalize">
          Đăng nhập vào hệ thống
        </Title>
        <LoginForm />
      </div>
    </div>
  );
}
