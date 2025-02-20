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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const titleVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const buttonVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    fetchListHouse();
  }, [fetchListHouse]);

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
