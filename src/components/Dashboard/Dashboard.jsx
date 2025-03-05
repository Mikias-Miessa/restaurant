import { useState } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  ShopOutlined,
  OrderedListOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import FoodManagement from "./FoodManagement";
import OrderManagement from "./OrderManagement";
import ProfileManagement from "./ProfileManagement";

const { Header, Content, Sider } = Layout;

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  const menuItems = [
    {
      key: "food",
      icon: <ShopOutlined />,
      label: "Food Management",
    },
    {
      key: "orders",
      icon: <OrderedListOutlined />,
      label: "Orders",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile Management",
    },
  ];

  const getCurrentMenuKey = () => {
    const path = location.pathname.split("/")[2] || "food";
    return path;
  };

  const handleMenuClick = (item) => {
    navigate(`/dashboard/${item.key}`);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    window.location.href = "/login";
  };

  // Responsive sidebar toggle
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const SideMenu = () => (
    <div className="h-full flex flex-col">
      <Menu
        mode="inline"
        selectedKeys={[getCurrentMenuKey()]}
        style={{ height: "100%", borderRight: 0 }}
        items={menuItems}
        onClick={handleMenuClick}
      />
      {/* Logout Button */}
      <Button
        type="text"
        danger
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        className="mt-auto mb-4 mx-4"
      >
        Logout
      </Button>
    </div>
  );

  return (
    <Layout className="min-h-screen">
      {/* Header */}
      <Header className="bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            className="mr-3 md:hidden"
          />
          <h1 className="text-lg md:text-xl font-bold">
            Abdi Logaw Restaurant
          </h1>
        </div>
      </Header>

      <Layout className="bg-white">
        {/* Desktop Sidebar */}
        <Sider
          width={200}
          className="bg-white hidden md:block"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
        >
          <SideMenu />
        </Sider>

        {/* Mobile Drawer */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          className="md:hidden"
          bodyStyle={{ padding: 0 }}
        >
          <SideMenu />
        </Drawer>

        {/* Main Content */}
        <Layout className="bg-gray-50 min-h-[calc(100vh-64px)]">
          <Content className="p-4 md:p-6">
            <Routes>
              <Route path="/" element={<FoodManagement />} />
              <Route path="/food" element={<FoodManagement />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/profile" element={<ProfileManagement />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
