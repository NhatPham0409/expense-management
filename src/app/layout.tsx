import "./globals.css";
import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import type React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AppHeader from "@/components/header";
import AppFooter from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Login Page",
  description: "Beautiful login page created with Next.js and Ant Design",
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
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
