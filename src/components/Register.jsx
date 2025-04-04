import { Form, Input, Button, Card, message, Select } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

function Register() {
  const onFinish = async (values) => {
    try {
      console.log("Starting registration with values:", {
        username: values.username,
        role: values.role,
        passwordLength: values.password?.length,
      });

      // Check if passwords match
      if (values.password !== values.confirmPassword) {
        console.log("Password mismatch detected");
        message.error("Passwords do not match!");
        return;
      }

      console.log(
        "Sending registration request to:",
        `${import.meta.env.VITE_API_URL}/api/users/register`
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        {
          username: values.username,
          password: values.password,
          role: values.role,
        }
      );

      console.log("Registration response:", response.data);
      message.success("Registration successful! Please login.");

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      message.error(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Register</h1>
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              { min: 3, message: "Username must be at least 3 characters!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select size="large" placeholder="Select a role">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="waiter">Waiter</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
            >
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-800">
              Login here
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Register;
