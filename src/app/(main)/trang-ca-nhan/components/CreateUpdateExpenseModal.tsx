import { HouseService, UserService } from "@/service";
import { IExpense } from "@/types/expense.type";
import { expenseTypes } from "@/utils/constant";
import { removeVietnameseTones } from "@/utils/utils";
import {
  Select,
  Input,
  InputNumber,
  Button,
  Space,
  Popover,
  Row,
  Col,
  Form,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const { Option } = Select;

interface CreateUpdateExpenseModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccessfullyCreated: () => void;
  selectedExpense?: IExpense | null;
}

const CreateUpdateExpenseModal = ({
  visible,
  onCancel,
  onSuccessfullyCreated,
  selectedExpense,
}: CreateUpdateExpenseModalProps) => {
  const [form] = Form.useForm();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [expenseType, setExpenseType] = useState<string>(expenseTypes[0].value);

  console.log({ selectedExpense });

  useEffect(() => {
    if (selectedExpense) {
      setExpenseType(selectedExpense.expenseType);
      form.setFieldsValue({
        cost: selectedExpense.cost,
        note: selectedExpense.note,
      });
    } else {
      form.resetFields();
    }
  }, [selectedExpense, form]);

  const handleUpdateExpense = async () => {
    try {
      const values = await form.validateFields();
      setIsConfirming(true);

      let payload = { ...values, expenseType };

      if (selectedExpense) {
        payload = { ...payload, expenseId: selectedExpense._id };
        toast
          .promise(UserService.updatePersonalExpense(payload), {
            pending: "Đang xử lý dữ liệu",
          })
          .then((res) => {
            toast.success(res.data.message);
            onCancel();
            onSuccessfullyCreated();
          })
          .catch((err) => {
            const errorMessage = err.response.data.message;
            toast.error(errorMessage);
          });
      } else {
        toast
          .promise(UserService.createPersonalExpense(payload), {
            pending: "Đang xử lý dữ liệu",
          })
          .then((res) => {
            toast.success(res.data.message);
            onCancel();
            onSuccessfullyCreated();
          })
          .catch((err) => {
            const errorMessage = err.response.data.message;
            toast.error(errorMessage);
          });
      }

      onSuccessfullyCreated();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa chi tiêu"
      open={visible}
      onOk={handleUpdateExpense}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isConfirming}
    >
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]} justify="space-between" align="bottom">
          <Col xs={24}>
            <Form.Item
              name="cost"
              label="Tổng tiền"
              rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter="₫"
                placeholder="Nhập tổng tiền"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Ghi chú">
              <Space.Compact style={{ width: "100%" }}>
                <Select
                  showSearch
                  value={expenseType}
                  style={{ width: 140 }}
                  popupMatchSelectWidth={false}
                  onChange={(value) => setExpenseType(value)}
                  filterOption={(inputValue, option) => {
                    const searchText = removeVietnameseTones(inputValue);
                    const optionText = removeVietnameseTones(
                      option?.children?.toString() || ""
                    );
                    return optionText.includes(searchText);
                  }}
                  filterSort={(optionA, optionB) =>
                    removeVietnameseTones(
                      optionA?.children?.toString() || ""
                    ).localeCompare(
                      removeVietnameseTones(optionB?.children?.toString() || "")
                    )
                  }
                >
                  {expenseTypes.map((expense) => (
                    <Option key={expense.value} value={expense.value}>
                      {expense.label}
                    </Option>
                  ))}
                </Select>
                <Form.Item name="note" noStyle>
                  <Input style={{ flex: 1 }} placeholder="Nhập ghi chú" />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateUpdateExpenseModal;
