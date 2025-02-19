import "./globals.css";
import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import type React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AppHeader from "@/components/header";
import AppFooter from "@/components/footer";
import { Slide, ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Login Page",
  description: "Beautiful login page created with Next.js and Ant Design",
};

const contextClass: any = {
  success: "bg-[#44a047]",
  error: "bg-red-600",
  info: "bg-yellow-500 text-yellow-100",
  warning: "bg-orange-400",
  default: "bg-zinc-800 font-zinc-200",
  dark: "bg-white-600 font-gray-300",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#3B82F6",
            },
          }}
        >
          <AntdRegistry>
            {children}
            <ToastContainer
              className={`rounded-xl`}
              toastClassName={({ type }: any) =>
                contextClass[type || "default"] +
                " relative flex flex-row p-1 min-h-10  overflow-hidden cursor-pointer items-center shadow-sm mt-12 "
              }
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
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
