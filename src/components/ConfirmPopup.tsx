import { Modal } from "antd";
import React, { ReactElement } from "react";

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
        okButtonProps={{ disabled: isConfirming }}
        cancelText={
          <p>
            <i className="fa-solid fa-ban"></i>
            <span className="ml-1">Hủy</span>
          </p>
        }
        okText={
          isConfirming ? (
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Đang xử lý</span>
            </div>
          ) : (
            <p>
              <i className="fa-solid fa-check"></i>
              <span className="ml-1">Xác nhận</span>
            </p>
          )
        }
      >
        {message}
      </Modal>
    </div>
  );
};

export default ConfirmPopup;
