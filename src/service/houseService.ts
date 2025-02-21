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

async function getHouseInfor(houseId: string) {
  const response = await axiosInstance.post(`/api/getHouseInfo`, {
    houseId,
  });

  return response;
}

async function createExpense(payload: any) {
  const response = await axiosInstance.post(`/api/createExpense`, payload);

  return response;
}

export const HouseService = {
  getListHouse,
  createHouse,
  getHouseInfor,
  createExpense,
};
