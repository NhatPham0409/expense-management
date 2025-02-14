"use server";
import { cookies } from "next/headers";

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken");
}

export async function setAccessToken(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken);
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken");
}

export async function removeAccessToken() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
}
