import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Divider,
  Avatar,
  Typography,
  message,
} from "antd";
import { UserOutlined, LockOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

function ProfileManagement() {
  const [usernameForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: { Authorization: token },
          }
        );
        setUserData(response.data);
      } catch (error) {
        message.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  const handleUsernameUpdate = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          username: values.newUsername,
        },
        {
          headers: { Authorization: token },
        }
      );

      message.success("Username updated successfully");
      setUserData((prev) => ({ ...prev, username: values.newUsername }));
      usernameForm.resetFields();
    } catch (error) {
      message.error(error.response?.data || "Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: { Authorization: token },
        }
      );

      message.success("Password updated successfully");
      passwordForm.resetFields();
    } catch (error) {
      message.error(error.response?.data || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="mb-8 shadow-sm" bordered={false}>
        <div className="flex items-center space-x-6">
          <Avatar size={84} icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <Title level={3} className="mb-1">
              {userData.username}
            </Title>
            <Text type="secondary">{userData.role}</Text>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8">
        <Card
          title={
            <div className="flex items-center space-x-2">
              <EditOutlined className="text-blue-500" />
              <span>Update Username</span>
            </div>
          }
          bordered={false}
          className="shadow-sm"
        >
          <Form
            form={usernameForm}
            layout="vertical"
            onFinish={handleUsernameUpdate}
          >
            <Form.Item
              name="currentUsername"
              label="Current Username"
              rules={[
                {
                  required: true,
                  message: "Please input your current username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Current Username"
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              name="newUsername"
              label="New Username"
              rules={[
                { required: true, message: "Please input your new username!" },
                { min: 4, message: "Username must be at least 4 characters!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="New Username"
                className="h-10"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="h-10"
              >
                Update Username
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title={
            <div className="flex items-center space-x-2">
              <LockOutlined className="text-blue-500" />
              <span>Update Password</span>
            </div>
          }
          bordered={false}
          className="shadow-sm"
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordUpdate}
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Current Password"
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please input your new password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="New Password"
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm New Password"
                className="h-10"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="h-10"
              >
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default ProfileManagement;
