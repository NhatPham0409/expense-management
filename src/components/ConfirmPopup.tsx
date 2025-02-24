import { Modal, Spin } from "antd";
import React, { ReactElement } from "react";
import { LoadingOutlined } from "@ant-design/icons";

interface ConfirmPopupProp {
  isModalDelete: boolean;
  handleDelete: () => void;
  setIsModalDelete: React.Dispatch<React.SetStateAction<boolean>>;
  isConfirming: boolean;
  message: ReactElement;
}

const ConfirmPopup = ({
  isModalDelete,
  handleDelete,
  setIsModalDelete,
  isConfirming,
  message,
}: ConfirmPopupProp) => {
  return (
    <div>
      <Modal
        title="Xác Nhận"
        open={isModalDelete}
        onOk={handleDelete}
        onCancel={() => setIsModalDelete(false)}
        cancelText="Hủy"
        okText="Xử lý"
        confirmLoading={isConfirming}
      >
        {message}
      </Modal>
    </div>
  );
};

export default ConfirmPopup;
