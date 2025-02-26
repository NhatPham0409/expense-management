import { HouseService } from "@/service";
import { IExpense } from "@/types/expense.type";
import { expenseTypes } from "@/utils/constant";
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

interface EditExpenseModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccessfullyCreated: () => void;
  selectedExpense: IExpense | null;
  roomMembers: any[];
}

const EditExpenseModal = ({
  visible,
  onCancel,
  onSuccessfullyCreated,
  selectedExpense,
  roomMembers,
}: EditExpenseModalProps) => {
  const [form] = Form.useForm();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [shares, setShares] = useState<{ [key: string]: number }>({});
  const [expenseType, setExpenseType] = useState<string>(expenseTypes[0].value);

  useEffect(() => {
    if (selectedExpense) {
      const shareData = selectedExpense.share || {};
      setShares(Object.fromEntries(Object.entries(shareData)));
      setExpenseType(selectedExpense.expenseType);
      form.setFieldsValue({
        buyer: selectedExpense.buyer._id,
        amount: selectedExpense.cost,
        note: selectedExpense.note,
      });
    }
  }, [selectedExpense, form]);

  const handleShareChange = (memberId: string, value: number) => {
    setShares((prevShares) => ({
      ...prevShares,
      [memberId]: value,
    }));
  };

  const handleUpdateExpense = () => {
    form.validateFields().then((values) => {
      setIsConfirming(true);
      try {
        const newExpense = {
          idExpense: selectedExpense?._id,
          updateData: {
            idHouse: selectedExpense?.idHouse,
            buyer: values.buyer,
            cost: values.amount,
            note: values.note || "",
            expenseType: expenseType,
            share: shares,
          },
        };

        toast
          .promise(HouseService.updateExpense(newExpense), {
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
      } catch (error: any) {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      } finally {
        setIsConfirming(false);
      }
    });
  };

  const shareContent = (
    <Form.Item name="shares" initialValue={shares}>
      <Space direction="vertical" style={{ width: 250 }}>
        {roomMembers.map((member) => (
          <Space
            key={member._id}
            className="flex items-center justify-between w-full"
          >
            <span>{member.name}</span>
            <Select
              value={shares[member._id] ?? 1}
              onChange={(value) => handleShareChange(member._id, value)}
              style={{ width: 100, textAlign: "center" }}
            >
              {[...Array(21)].map((_, index) => (
                <Option key={index} value={index}>
                  {index}
                </Option>
              ))}
            </Select>
          </Space>
        ))}
      </Space>
    </Form.Item>
  );

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
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="buyer"
              label="Người mua"
              rules={[{ required: true, message: "Vui lòng chọn người mua" }]}
            >
              <Select placeholder="Chọn người mua">
                {roomMembers.map((member) => (
                  <Option key={member._id} value={member._id}>
                    {member.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="amount"
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
            <Form.Item name="note" label="Ghi chú">
              <Space.Compact style={{ width: "100%" }}>
                <Select
                  value={expenseType}
                  style={{ width: 140 }}
                  popupMatchSelectWidth={false}
                  onChange={(value) => setExpenseType(value)}
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

          <Col xs={24}>
            <Form.Item label="Chia tỉ lệ">
              <Popover
                content={shareContent}
                title="Chia tỉ lệ"
                trigger="click"
                placement="bottomRight"
              >
                <Button style={{ width: "100%" }}>Chia tỉ lệ</Button>
              </Popover>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditExpenseModal;
