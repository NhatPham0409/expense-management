import axiosInstance from "@/utils/axiosInstance";

async function getListHouse() {
  const response = await axiosInstance.post(`/api/listHouse`, {});

  return response;
}

async function createHouse({
  name,
  des,
  member,
}: {
  name: string;
  des: string;
  member: string[];
}) {
  const response = await axiosInstance.post(`/api/createHouse`, {
    name,
    des,
    member,
  });

  return response;
}

async function updateHouse(payload: any) {
  const response = await axiosInstance.post(`/api/updateHouse`, payload);

  return response;
}

async function getHouseInfor(houseId: string) {
  const response = await axiosInstance.post(`/api/getHouseInfo`, {
    houseId,
  });

  return response;
}

async function getListExpenseOfHouse(
  houseId: string = "",
  page: number = 1,
  limit: number = 20,
  year?: number,
  month?: number
) {
  let payload: any = { houseId, page, limit };

  if (year !== undefined) {
    payload = { ...payload, year };
  }

  if (month !== undefined) {
    payload = { ...payload, month };
  }

  const response = await axiosInstance.post(`/api/listExpense`, payload);

  return response;
}

async function createExpense(payload: any) {
  const response = await axiosInstance.post(`/api/createExpense`, payload);

  return response;
}

async function deleteExpense(expenseId: string) {
  const response = await axiosInstance.post(`/api/deleteExpense`, {
    expenseId,
  });

  return response;
}

async function updateExpense(payload: any) {
  const response = await axiosInstance.post(`/api/updateExpense`, payload);

  return response;
}

async function calculateDebt(houseId: string) {
  const response = await axiosInstance.post(`/api/calculateDebt`, {
    houseId,
  });

  return response;
}

async function statistic(houseId: string) {
  const response = await axiosInstance.post(`/api/statistic`, {
    houseId,
  });

  return response;
}

async function addMember(payload: any) {
  const response = await axiosInstance.post(`/api/addMember`, payload);

  return response;
}

async function addTeleInfo(payload: any) {
  const response = await axiosInstance.post(`/api/addTeleInfo`, payload);

  return response;
}

async function deleteMember(payload: any) {
  const response = await axiosInstance.post(`/api/deleteMember`, payload);

  return response;
}

export const HouseService = {
  getListHouse,
  createHouse,
  getHouseInfor,
  createExpense,
  deleteExpense,
  calculateDebt,
  statistic,
  updateHouse,
  updateExpense,
  addMember,
  addTeleInfo,
  getListExpenseOfHouse,
  deleteMember,
};
