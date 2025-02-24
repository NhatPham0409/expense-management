"use client";

import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastNotifications() {
  const contextClass: any = {
    success: "bg-[#44a047]",
    error: "bg-red-600",
    info: "bg-yellow-500 text-yellow-100",
    warning: "bg-orange-400",
    default: "bg-zinc-800 font-zinc-200",
    dark: "bg-white-600 font-gray-300",
  };

  return (
    <ToastContainer
      className={`rounded-xl`}
      closeButton={false}
      position="top-right"
      autoClose={2000}
      // hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      limit={3}
      theme="colored"
      transition={Slide}
    />
  );
}
