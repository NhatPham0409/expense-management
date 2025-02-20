"use client";

import { Card, Avatar, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import type { IHouse } from "@/types/house.type";
import { motion } from "framer-motion";
import { CrownOutlined } from "@ant-design/icons";

interface RoomCardProps {
  room: IHouse;
}

function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();

  const handleNavigate = (id: string) => {
    router.push(`/${id}`);
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card
        hoverable
        className="h-full shadow-md transition-all duration-300 hover:shadow-lg bg-white"
        onClick={() => handleNavigate(room._id)}
      >
        <Card.Meta
          title={
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-indigo-700">
                {room.name}
              </span>
              <Tooltip title={`Admin: ${room.admin.name}`}>
                <CrownOutlined style={{ color: "#F59E0B" }} />
              </Tooltip>
            </div>
          }
          description={
            <div>
              <p className="text-gray-600 mt-2 line-clamp-2">
                {room.des || "Không có mô tả"}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                  {room.member.slice(0, 3).map((member, index) => (
                    <Tooltip key={member._id} title={member.name}>
                      <Avatar
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                        style={{
                          backgroundColor: `hsl(${
                            (index * 100) % 360
                          }, 70%, 50%)`,
                        }}
                      >
                        {member.name[0]}
                      </Avatar>
                    </Tooltip>
                  ))}
                  {room.member.length > 3 && (
                    <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-300 text-gray-600">
                      +{room.member.length - 3}
                    </Avatar>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {room.member.length} member{room.member.length !== 1 && "s"}
                </span>
              </div>
            </div>
          }
        />
      </Card>
    </motion.div>
  );
}

export default RoomCard;
