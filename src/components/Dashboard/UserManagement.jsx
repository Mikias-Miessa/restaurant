import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setUsers(response.data);
    } catch (error) {
      message.error("Failed to fetch users");
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user creation/update
  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // Update existing user
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/${editingUser._id}`,
          values,
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        message.success("User updated successfully");
      } else {
        // Create new user
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/register`,
          values,
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        message.success("User created successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data || "Operation failed");
      console.error("Submit error:", error);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
      console.error("Delete error:", error);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      role: user.role,
      password: "", // Don't set password for security
    });
    setIsModalVisible(true);
  };

  // Add new user
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => role.charAt(0).toUpperCase() + role.slice(1),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete user"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ role: "waiter" }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please input username!" },
              { min: 3, message: "Username must be at least 3 characters!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: !editingUser,
                message: "Please input password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters!",
                ...(editingUser && { required: false }),
              },
            ]}
          >
            <Input.Password
              placeholder={
                editingUser ? "(Leave blank to keep current password)" : ""
              }
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role!" }]}
          >
            <Select>
              <Option value="waiter">Waiter</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;
