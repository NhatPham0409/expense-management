"use client";

import { UserService } from "@/service";
import type { IUserDetail } from "@/types/user.type";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography, Spin, Card, Avatar, Col, Row } from "antd";
import { useRouter } from "next/navigation";
import HouseCard from "@/app/(main)/trang-ca-nhan/components/HouseCard";
import UserExpenseChart from "@/app/(main)/trang-ca-nhan/components/UserExpenseChart";
import UserExpenseTable from "@/app/(main)/trang-ca-nhan/components/UserExpenseTable";

const { Title, Text } = Typography;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

function Profile() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<IUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await UserService.getUserInforDetail();
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleNavigate = (id: string) => {
    router.push(`/${id}`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
    >
      <AnimatePresence>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          userInfo && (
            <UserProfile
              userInfo={userInfo}
              formatCurrency={formatCurrency}
              handleNavigate={handleNavigate}
            />
          )
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full min-h-[400px]"
    >
      <Spin size="large" />
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-base font-medium text-indigo-600"
      >
        Đang tải dữ liệu...
      </motion.p>
    </motion.div>
  );
}

function UserProfile({
  userInfo,
  formatCurrency,
  handleNavigate,
}: {
  userInfo: IUserDetail;
  formatCurrency: (amount: number) => string;
  handleNavigate: (id: string) => void;
}) {
  return (
    <motion.div variants={itemVariants}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-4">
          <Avatar
            size={64}
            src={`https://ui-avatars.com/api/?name=${userInfo.name}&color=FFFFFF&background=09090b`}
            alt={userInfo.name}
          />
          <div>
            <Title level={2} className="text-indigo-700 m-0">
              {userInfo.name}
            </Title>
            <Text className="text-gray-600">{userInfo.email}</Text>
          </div>
        </div>

        <div>
          <Title level={4} className="text-indigo-600 m-0">
            Tổng dư nợ:{" "}
            <span
              className={`text-base md:text-lg font-bold ${
                userInfo.totalDebt > 0
                  ? "text-green-600"
                  : userInfo.totalDebt < 0
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {formatCurrency(userInfo.totalDebt)}
            </span>
          </Title>
        </div>

        <div>
          <Title level={3} className="text-indigo-700 mb-4">
            Danh sách nhà
          </Title>

          <Row gutter={[16, 16]}>
            {userInfo.houses.map((house: any) => (
              <HouseCard
                key={house._id}
                house={house}
                formatCurrency={formatCurrency}
                handleNavigate={handleNavigate}
              />
            ))}
          </Row>
        </div>

        <div>
          <UserExpenseChart listHouse={userInfo.houses} />
        </div>

        <UserExpenseTable />
      </div>
    </motion.div>
  );
}

export default Profile;
