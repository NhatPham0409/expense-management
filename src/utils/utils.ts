import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export const getBalanceColor = (balance: number) => {
  if (balance > 0) return "text-green-600";
  if (balance < 0) return "text-red-600";
  return "text-gray-600";
};
