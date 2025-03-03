import { useState } from "react";
import { Card, Form, Input, Button, Divider, Avatar, Typography } from "antd";
import { UserOutlined, LockOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function ProfileManagement() {
  const [usernameForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock user data (in real app, this would come from your auth context/state)
  const [userData] = useState({
    username: "current_user",
    email: "user@example.com",
    role: "Administrator",
  });

  const handleUsernameUpdate = async (values) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      usernameForm.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (values) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      passwordForm.resetFields();
    } finally {
      setLoading(false);
    }
  };

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
            <div className="mt-2">
              <Text type="secondary">{userData.email}</Text>
            </div>
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
