import RegisterForm from "@/app/(auth)/dang-ky/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-center mb-6 capitalize">Đăng ký tài khoản</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
