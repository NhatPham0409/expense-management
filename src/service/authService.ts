import axiosInstance from "@/utils/axiosInstance";
import { setLocalToken } from "@/utils/localToken";

async function login({ email, password }: { email: string; password: string }) {
  const response: any = await axiosInstance.post(`/api/auth/login`, {
    email,
    password,
  });

  const token = response.data.token;
  setLocalToken(token);

  return response;
}

async function changePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  const response = await axiosInstance.post(`/api/auth/change-password`, {
    oldPassword,
    newPassword,
  });

  return response;
}

export const AuthService = {
  login,
  changePassword,
};
