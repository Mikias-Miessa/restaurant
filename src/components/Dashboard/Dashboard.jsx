import { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  ShopOutlined,
  OrderedListOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SettingOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import FoodManagement from "./FoodManagement";
import OrderManagement from "./OrderManagement";
import ProfileManagement from "./ProfileManagement";
import OrderNotifications from "./OrderNotifications";
import { useOrders } from "../../contexts/OrderContext";
import { notification } from "antd";
import UserManagement from "./UserManagement";

const { Header, Content, Sider } = Layout;

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const { orders } = useOrders();
  const [lastOrderId, setLastOrderId] = useState(null);
  const userRole = localStorage.getItem("role");

  // Base menu items for waiters
  const waiterMenuItems = [
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Order Management",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile Management",
    },
  ];

  // Additional menu items for admin
  const adminOnlyMenuItems = [
    {
      key: "food",
      icon: <ShopOutlined />,
      label: "Food Management",
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: "User Management",
    },
    {
      key: "waiter-orders",
      icon: <NotificationOutlined />,
      label: "Waiter Orders",
    },
  ];

  // Combine menu items based on role
  const finalMenuItems =
    userRole === "admin"
      ? [...waiterMenuItems, ...adminOnlyMenuItems]
      : waiterMenuItems;

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

  // Show notification for new orders
  useEffect(() => {
    if (userRole === "admin" && orders.length > 0) {
      const latestOrder = orders[0];
      if (latestOrder.orderNumber !== lastOrderId) {
        setLastOrderId(latestOrder.orderNumber);
        // Only show notification if it's not the first load
        if (lastOrderId !== null) {
          notification.info({
            message: "New Order Received",
            description: (
              <div>
                <p>Order #{latestOrder.orderNumber}</p>
                <p>From: {latestOrder.waiterName}</p>
                <a onClick={() => navigate("/dashboard/waiter-orders")}>
                  View in Orders List
                </a>
              </div>
            ),
            icon: <ShoppingCartOutlined style={{ color: "#1890ff" }} />,
            placement: "topRight",
            duration: 4.5,
          });
        }
      }
    }
  }, [orders, lastOrderId, userRole, navigate]);

  const SideMenu = () => (
    <div className="h-full flex flex-col">
      <Menu
        mode="inline"
        selectedKeys={[getCurrentMenuKey()]}
        style={{ height: "100%", borderRight: 0 }}
        items={finalMenuItems}
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
      <div id="alert-container" />
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
              {/* Default route for admin */}
              {userRole === "admin" && (
                <>
                  <Route path="/" element={<FoodManagement />} />
                  <Route path="/food" element={<FoodManagement />} />
                </>
              )}
              {/* Default route for waiter */}
              {userRole === "waiter" && (
                <Route path="/" element={<OrderManagement />} />
              )}
              {/* Common routes */}
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/profile" element={<ProfileManagement />} />
              {/* Admin-only routes */}
              {userRole === "admin" && (
                <>
                  <Route path="users" element={<UserManagement />} />

                  <Route
                    path="waiter-orders"
                    element={<OrderNotifications />}
                  />
                </>
              )}
            </Routes>
            {/* {userRole === "admin" && <OrderNotifications />} */}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
