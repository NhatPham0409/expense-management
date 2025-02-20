import axiosInstance from "@/utils/axiosInstance";

async function userInfor() {
  const response: any = await axiosInstance.post(`/api/getUserInfo`, {});

  return response;
}

async function getListUsers() {
  const response: any = await axiosInstance.post(`/api/listUser`, {});

  return response;
}

export const UserService = {
  userInfor,
  getListUsers,
};
