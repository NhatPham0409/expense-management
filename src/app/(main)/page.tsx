"use client";

import { useEffect, useState, useCallback } from "react";
import { Button, Row, Col, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Title from "antd/es/typography/Title";
import AddRoomModal from "@/app/(main)/AddRoomModal";
import RoomCard from "@/components/RoomCard";
import type { IHouse } from "@/types/house.type";
import { HouseService } from "@/service";
import Image from "next/image";

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

const titleVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

const emptyStateVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const emptyStateChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listHouse, setListHouse] = useState<IHouse[]>([]);

  const fetchListHouse = useCallback(async () => {
    try {
      const response = await HouseService.getListHouse();

      if (response.data) {
        setListHouse(response.data.houses);
      }
    } catch (error) {
      console.error("Error fetching house list:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListHouse();
  }, [fetchListHouse]);

  const showModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.div variants={titleVariants}>
          <Title level={3} className="text-indigo-700">
            Danh sách phòng
          </Title>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-md hover:shadow-lg transition-all duration-300"
          >
            Thêm mới
          </Button>
        </motion.div>
      </div>

      <AddRoomModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onSuccessfullyCreated={fetchListHouse}
      />

      <AnimatePresence>
        {isLoading ? (
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
        ) : listHouse.length === 0 ? (
          <motion.div
            key="empty"
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col items-center justify-center w-full min-h-[400px]"
          >
            <motion.div
              variants={emptyStateChildVariants}
              className="relative w-64 h-64"
            >
              <Image
                src="/not_found_2.webp"
                alt="Empty house illustration"
                layout="fill"
                className="object-contain"
              />
            </motion.div>
            <motion.h2
              variants={emptyStateChildVariants}
              className="text-2xl font-bold text-indigo-700 mb-4"
            >
              Chưa có phòng nào
            </motion.h2>
            <motion.p
              variants={emptyStateChildVariants}
              className="text-indigo-600 text-center mb-6 max-w-md"
            >
              Hãy bắt đầu bằng cách thêm phòng đầu tiên của bạn. Nó sẽ xuất hiện
              ở đây sau khi bạn tạo.
            </motion.p>
            <motion.div variants={emptyStateChildVariants}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-md hover:shadow-lg transition-all duration-300 text-lg h-12 px-6"
              >
                Thêm phòng đầu tiên
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Row gutter={[16, 16]}>
              {listHouse.map((room) => (
                <Col xs={24} sm={12} md={8} lg={6} key={room._id}>
                  <motion.div variants={itemVariants}>
                    <RoomCard room={room} />
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
