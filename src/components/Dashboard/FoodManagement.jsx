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
import { useState, useEffect } from "react";
import axios from "axios";

function FoodManagement() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFood, setEditingFood] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch foods from backend
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/foods`,
        {
          headers: { Authorization: token },
        }
      );
      setFoods(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to fetch foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

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
      title: "Delete Food Item",
      content: `Are you sure you want to delete "${food.name}"?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/foods/${food._id}`,
            {
              headers: { Authorization: `${token}` },
            }
          );
          message.success("Food deleted successfully");
          fetchFoods(); // Refresh the list
        } catch (error) {
          console.error("Delete error:", error);
          message.error(error.response?.data || "Failed to delete food");
        }
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem("token");
        if (editingFood) {
          // Update existing food
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/foods/${editingFood._id}`,
            values,
            {
              headers: { Authorization: token },
            }
          );
          message.success("Food updated successfully");
        } else {
          // Create new food
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/foods`,
            values,
            {
              headers: { Authorization: token },
            }
          );
          message.success("Food added successfully");
        }
        setIsModalVisible(false);
        fetchFoods(); // Refresh the list
      } catch (error) {
        message.error(error.response?.data || "Failed to save food");
      }
    });
  };

  return (
    <div>
      <div className="mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Food
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={foods}
        rowKey="_id"
        loading={loading}
      />

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
