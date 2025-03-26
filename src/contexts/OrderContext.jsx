import { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";
import { socket } from "../socket";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (userRole === "admin") {
      // Join admin room
      socket.emit("join", "admin");

      // Listen for new orders
      socket.on("order-received", (orderData) => {
        setOrders((prevOrders) => [orderData, ...prevOrders]);
        message.info("New order received!");
      });
    }

    return () => {
      socket.off("order-received");
    };
  }, [userRole]);

  return (
    <OrderContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
