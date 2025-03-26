import { useEffect } from "react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";

function OrderAlert({ order }) {
  const navigate = useNavigate();

  useEffect(() => {
    notification.info({
      message: "New Order Received",
      description: (
        <div>
          <p>Order #{order.orderNumber}</p>
          <p>From: {order.waiterName}</p>
          <a onClick={() => navigate("/dashboard/waiter-orders")}>
            View in Orders List
          </a>
        </div>
      ),
      icon: <ShoppingCartOutlined style={{ color: "#1890ff" }} />,
      placement: "topRight",
      duration: 4.5,
    });
  }, [order, navigate]);

  return null;
}

export default OrderAlert;
