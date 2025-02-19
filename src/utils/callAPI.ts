import { getAccessToken } from "@/utils/cookies";

export enum APIStatus {
  OK = "OK",
  INVALID = "INVALID",
  SERVER_ERROR = "SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  BAD_REQUEST = "BAD_REQUEST",
  CONFLICT = "CONFLICT",
}
export enum APIMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface APIResponse<T> {
  message: string;
  data: T | null;
  status: APIStatus;
}

export const callAPI = async <T>(
  url: string,
  options?: RequestInit & {
    baseURL?: string;
    query?: Record<string, any>;
    headers?: Record<string, string>;
  }
): Promise<APIResponse<T>> => {
  try {
    const { baseURL, query, ...rest } = options ?? {};
    const URL: string = `${
      options?.baseURL ? options.baseURL : process.env.NEXT_PUBLIC_API_HOST_URL
    }${url}${
      options?.query ? "?" + new URLSearchParams(options.query).toString() : ""
    }`;
    const token = await getAccessToken();
    const res = await fetch(URL, {
      method: options?.method || APIMethod.GET,
      headers: {
        "Content-Type": "application/json",
        Authorization: token?.value ? `Bearer ${token.value}` : "",
      },
      next: {
        revalidate: 0,
      },
      ...rest,
    });
    const data: APIResponse<T> = await res.json();
    return data;
  } catch (e: any) {
    return {
      message: e?.message,
      data: null,
      status: APIStatus.SERVER_ERROR,
    };
  }
};
