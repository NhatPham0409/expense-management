import { Card, Col } from "antd";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

function HouseCard({
  house,
  formatCurrency,
  handleNavigate,
}: {
  house: any;
  formatCurrency: (amount: number) => string;
  handleNavigate: (id: string) => void;
}) {
  return (
    <Col xs={24} sm={12} md={8} lg={6}>
      <motion.div variants={itemVariants}>
        <Card
          hoverable
          className="h-full shadow-md transition-all duration-300 hover:shadow-lg bg-white"
          onClick={() => handleNavigate(house._id)}
        >
          <Card.Meta
            title={
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-indigo-700">
                  {house.name}
                </span>
                <span
                  className={`text-base md:text-lg font-semibold ${
                    house.userDebt > 0
                      ? "text-green-600"
                      : house.userDebt < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {formatCurrency(house.userDebt)}
                </span>
              </div>
            }
            description={
              <div>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {house.des || "Không có mô tả"}
                </p>
              </div>
            }
          />
        </Card>
      </motion.div>
    </Col>
  );
}

export default HouseCard;
