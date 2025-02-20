"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Button, Spin } from "antd";
import { LogoutOutlined, LockOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { IUser } from "@/types/user.type";
import { UserService } from "@/service";
import { clearLocalToken } from "@/utils/localToken";
import ChangePasswordModal from "./ChangePasswordModal";

const { Header } = Layout;

export default function AppHeader() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfor, setUserInfor] = useState<IUser | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const router = useRouter();

  const fetchUserInfor = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.userInfor();
      if (response.data) {
        setUserInfor(response.data.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfor();
  }, []);

  const handleChangePassword = () => {
    setIsModalVisible(true);
  };

  const handleLogout = () => {
    clearLocalToken();
    router.push("/dang-nhap");
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
      {!isLoading ? (
        userInfor ? (
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <div className="flex items-center cursor-pointer">
              <Avatar
                src={`https://ui-avatars.com/api/?name=${userInfor?.name}&color=FFFFFF&background=09090b`}
                className="mr-2"
                alt="User avatar"
              />
              <span className="text-base font-medium text-white">
                {userInfor?.name}
              </span>
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
        )
      ) : (
        <Spin size="default" />
      )}

      <ChangePasswordModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onSuccessfullyCreated={() => handleLogout()}
      />
    </Header>
  );
}
