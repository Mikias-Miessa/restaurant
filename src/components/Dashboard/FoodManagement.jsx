import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";

function FoodManagement() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFood, setEditingFood] = useState(null);
  const [foods, setFoods] = useState([
    { id: 1, name: "Pizza", price: 10.99, description: "Delicious pizza" },
    { id: 2, name: "Burger", price: 8.99, description: "Juicy burger" },
  ]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingFood(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    form.setFieldsValue(food);
    setIsModalVisible(true);
  };

  const handleDelete = (food) => {
    Modal.confirm({
      title: "Are you sure you want to delete this food item?",
      onOk: () => {
        setFoods(foods.filter((f) => f.id !== food.id));
        message.success("Food deleted successfully");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingFood) {
        setFoods(
          foods.map((f) =>
            f.id === editingFood.id ? { ...values, id: editingFood.id } : f
          )
        );
        message.success("Food updated successfully");
      } else {
        setFoods([...foods, { ...values, id: foods.length + 1 }]);
        message.success("Food added successfully");
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <div className="mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Food
        </Button>
      </div>

      <Table columns={columns} dataSource={foods} rowKey="id" />

      <Modal
        title={editingFood ? "Edit Food" : "Add Food"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input food name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input food price!" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              prefix="$"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input food description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default FoodManagement;
