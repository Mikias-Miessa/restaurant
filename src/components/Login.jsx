import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

function Login() {
  const onFinish = async (values) => {
    try {
      console.log("Login attempt:", values);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          username: values.username,
          password: values.password,
        }
      );

      // Store the token in localStorage
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Show success message
      message.success("Login successful!");

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      // Show error message
      message.error(error.response?.data || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Login</h1>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
            >
              Log in
            </Button>
          </Form.Item>
          <div className="text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-800">
              Register here
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
