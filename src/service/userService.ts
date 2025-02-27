import axiosInstance from "@/utils/axiosInstance";

async function userInfor() {
  const response: any = await axiosInstance.post(`/api/getUserInfo`, {});

  return response;
}

async function getListUsers() {
  const response: any = await axiosInstance.post(`/api/listUser`, {});

  return response;
}

async function getUserInforDetail() {
  const response: any = await axiosInstance.post(`/api/userDetailInfo`, {});

  return response;
}

async function getUserDetailColumnStatistic(houseId: string = "") {
  const response: any = await axiosInstance.post(
    `/api/userDetailColumnStatistic`,
    { houseId }
  );

  return response;
}

async function getUserDetailExpense(
  page: number = 1,
  limit: number = 20,
  year?: number,
  month?: number
) {
  let payload: any = { page, limit };

  if (year !== undefined) {
    payload = { ...payload, year };
  }

  if (month !== undefined) {
    payload = { ...payload, month };
  }

  const response = await axiosInstance.post(`/api/userDetailExpense`, payload);

  return response;
}

async function getUserIncome() {
  const response: any = await axiosInstance.post(`/api/income`, {});

  return response;
}

async function deleteIncome(incomeId: string) {
  const response: any = await axiosInstance.post(`/api/deleteIncome`, {
    incomeId,
  });

  return response;
}

async function createIncome(payload: any) {
  const response: any = await axiosInstance.post(`/api/createIncome`, payload);

  return response;
}

async function updateIncome(payload: any) {
  const response: any = await axiosInstance.post(`/api/updateIncome`, payload);

  return response;
}

export const UserService = {
  userInfor,
  getListUsers,
  getUserInforDetail,
  getUserDetailColumnStatistic,
  getUserDetailExpense,
  getUserIncome,
  deleteIncome,
  createIncome,
  updateIncome,
};
