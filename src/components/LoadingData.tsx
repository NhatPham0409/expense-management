import React from "react";
import { motion } from "framer-motion";
import { Spin } from "antd";

function LoadingData() {
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

export default LoadingData;
