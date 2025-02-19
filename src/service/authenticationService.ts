import { callAPI, APIMethod, APIStatus } from "@/utils/callAPI"; // import callAPI và các enum

interface LoginResponse {
  message: string;
  token: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await callAPI<LoginResponse>("/api/auth/login", {
      method: APIMethod.POST,
      body: JSON.stringify({ email, password }),
    });

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};
