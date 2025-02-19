"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Button } from "antd";
import { LogoutOutlined, LockOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header } = Layout;

export default function AppHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(true);
  }, []);

  const router = useRouter();

  const handleChangePassword = () => {
    console.log("Change Password");
  };

  const handleLogout = () => {
    console.log("Logout");
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Đổi mật khẩu",
      icon: <LockOutlined />,
      onClick: handleChangePassword,
    },
    {
      key: "2",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="flex items-center justify-between px-4 bg-gray-800">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Logo
        </Link>
      </div>
      {isLoggedIn ? (
        <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
          <div className="flex items-center cursor-pointer">
            <Avatar
              src="https://ui-avatars.com/api/?name=Trong&color=FFFFFF&background=09090b"
              className="mr-2"
              alt="User avatar"
            />
            <span className="text-base font-medium text-white">Trọng</span>
          </div>
        </Dropdown>
      ) : (
        <Button
          type="primary"
          onClick={() => router.push("/dang-nhap")}
          className="bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Đăng nhập
        </Button>
      )}
    </Header>
  );
}
