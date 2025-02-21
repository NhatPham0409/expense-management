"use client";

import { useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Button, Spin } from "antd";
import Image from "next/image";
import { LogoutOutlined, LockOutlined } from "@ant-design/icons";
import { UserService } from "@/service";
import { clearLocalToken } from "@/utils/localToken";
import ChangePasswordModal from "./ChangePasswordModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserContext } from "@/app/app-provider";

const { Header } = Layout;

export default function AppHeader() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userInfor, setUserInfor } = useUserContext();
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
    setUserInfor(null);
    router.push("/dang-nhap");
  };

  const dropdownItems = [
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
    <Header className="flex items-center justify-between bg-gray-800">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          <Image src="/logo.png" alt="logo" width={50} height={50} />
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
