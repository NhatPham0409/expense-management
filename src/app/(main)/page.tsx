"use client";

import { useState } from "react";
import { Button, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import AddRoomModal from "@/app/(main)/AddRoomModal";
import RoomCard from "@/components/RoomCard";

const initialRooms = [
  {
    id: 1,
    name: "Phòng 101",
    description: "Phòng đơn tiêu chuẩn",
  },
  {
    id: 2,
    name: "Phòng 102",
    description: "Phòng đôi view thành phố",
  },
  {
    id: 3,
    name: "Phòng 103",
    description: "Phòng gia đình",
  },
  {
    id: 4,
    name: "Phòng 104",
    description: "Phòng Suite",
  },
  {
    id: 5,
    name: "Phòng 105",
    description: "Phòng Deluxe",
  },
];

export default function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Danh sách phòng</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm mới
        </Button>
      </div>

      <AddRoomModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />

      <Row gutter={[16, 16]}>
        {initialRooms.map((room) => (
          <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
            <RoomCard room={room} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
