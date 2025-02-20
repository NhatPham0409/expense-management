import axios from "axios";

import { clearLocalToken, getLocalToken, hasLocalToken } from "./localToken";

const baseURL = process.env.NEXT_PUBLIC_API_HOST_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (hasLocalToken()) {
      const token = getLocalToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK" && error.response === undefined) {
      console.error(`Network error: ${error}`);
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      console.warn(`401 Unauthorized. Redirecting to sign-in page.`);

      clearLocalToken();
      if (!window.location.toString().includes(`/dang-nhap`)) {
        window.location.href = "/dang-nhap";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
