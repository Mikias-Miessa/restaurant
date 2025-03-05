import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, Divider, Badge, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import MenuItem from "../MenuItem"; // Adjust the import path as necessary

const { Title, Text } = Typography;

function OrderManagement() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);

  // Fetch foods from backend
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/foods`,
          {
            headers: { Authorization: token },
          }
        );
        setFoods(response.data);
      } catch (error) {
        message.error("Failed to fetch menu items");
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const handleQuantityChange = (food, quantity) => {
    if (quantity === 0) {
      setSelectedItems(selectedItems.filter((item) => item._id !== food._id));
      return;
    }

    const existingItem = selectedItems.find((item) => item._id === food._id);
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((item) =>
          item._id === food._id ? { ...item, quantity } : item
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          ...food,
          quantity,
          prepNote: "",
          orderType: "dine-in", // Default order type
        },
      ]);
    }
  };

  const updatePrepNote = (foodId, note) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item._id === foodId ? { ...item, prepNote: note } : item
      )
    );
  };

  const updateOrderType = (foodId, type) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item._id === foodId ? { ...item, orderType: type } : item
      )
    );
  };

  const getItemQuantity = (foodId) => {
    const item = selectedItems.find((item) => item._id === foodId);
    return item ? item.quantity : 0;
  };

  const calculateTotal = () => {
    return selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const Receipt = () => {
    const currentDate = new Date().toLocaleString();
    const orderNumber = Math.floor(Math.random() * 1000000);

    return (
      <div className="bg-white p-4 md:p-6 font-mono">
        <div className="text-center mb-4 md:mb-6">
          <Title level={3} className="mb-1">
            KITCHEN ORDER
          </Title>
          <Text className="font-bold text-lg block">
            Order #: {orderNumber}
          </Text>
          <Text className="block">{currentDate}</Text>
        </div>

        <Divider className="my-2" />

        <div className="space-y-4">
          {selectedItems.map((item) => (
            <div key={`receipt-${item._id}`} className="border-b pb-2">
              <div className="flex justify-between items-start">
                <Text className="text-xl font-bold">{item.name}</Text>
                <Badge
                  count={item.quantity}
                  style={{
                    backgroundColor: "#1890ff",
                    fontSize: "14px",
                    padding: "0 8px",
                  }}
                />
              </div>
              <Badge
                status={item.orderType === "dine-in" ? "processing" : "warning"}
                text={
                  <Text className="font-bold">
                    {item.orderType.toUpperCase()}
                  </Text>
                }
                className="mb-1 block"
              />
              <Text className="text-gray-600 block">
                {item.prepNote ? item.prepNote : "Standard preparation"}
              </Text>
            </div>
          ))}
        </div>

        <Divider className="my-4" />

        <div className="text-center mt-4">
          <Text className="font-bold block">
            Total Items:{" "}
            {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
          </Text>
          <Text className="text-xs text-gray-500">
            Printed: {new Date().toLocaleTimeString()}
          </Text>
        </div>
      </div>
    );
  };

  const OrderSummary = () => (
    <div className="w-full lg:w-1/3 p-4 md:p-6 bg-gray-50 overflow-auto">
      <div className="sticky top-0">
        <Title level={2} className="mb-4 md:mb-6 text-xl md:text-2xl">
          Current Order
        </Title>

        {selectedItems.length === 0 ? (
          <div className="text-center py-6 md:py-8 bg-white rounded-lg">
            <ShoppingCartOutlined
              style={{ fontSize: "2rem" }}
              className="text-gray-300"
            />
            <Text className="block text-gray-400 mt-2">No items selected</Text>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {selectedItems.map((item) => (
                <div key={`summary-${item._id}`} className="mb-3 pb-3 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <Text strong>{item.name}</Text>
                      <Text className="block text-gray-500">
                        x{item.quantity}
                      </Text>
                      <Badge
                        status={
                          item.orderType === "dine-in"
                            ? "processing"
                            : "warning"
                        }
                        text={item.orderType.toUpperCase()}
                        className="block mt-1"
                      />
                      {item.prepNote && (
                        <Text className="block text-gray-400 text-sm mt-1">
                          Note: {item.prepNote}
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="primary"
              size="large"
              block
              icon={<ShoppingCartOutlined />}
              onClick={() => setIsReceiptModalVisible(true)}
              className="hidden lg:flex items-center justify-center"
            >
              Send to Kitchen
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      {/* Menu Items Section */}
      <div className="w-full lg:w-2/3 p-4 md:p-6 overflow-auto border-b lg:border-b-0 lg:border-r">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <Title level={2} className="mb-0 text-xl md:text-2xl">
            Menu Items
          </Title>
          {selectedItems.length > 0 && (
            <Badge
              count={selectedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
              )}
              className="lg:hidden"
            >
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => setIsReceiptModalVisible(true)}
              >
                ${calculateTotal().toFixed(2)}
              </Button>
            </Badge>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-4 text-center">Loading menu items...</div>
          ) : foods.length === 0 ? (
            <div className="p-4 text-center">No menu items available</div>
          ) : (
            foods.map((food) => (
              <MenuItem
                key={food._id}
                food={food}
                selectedItems={selectedItems}
                handleQuantityChange={handleQuantityChange}
                updatePrepNote={updatePrepNote}
                updateOrderType={updateOrderType}
                getItemQuantity={getItemQuantity}
              />
            ))
          )}
        </div>
      </div>

      {/* Order Summary Section */}
      <OrderSummary />

      <Modal
        title="Kitchen Order"
        open={isReceiptModalVisible}
        onOk={() => setIsReceiptModalVisible(false)}
        onCancel={() => setIsReceiptModalVisible(false)}
        width={window.innerWidth < 768 ? "90%" : 400}
        centered
      >
        <Receipt />
      </Modal>
    </div>
  );
}

export default OrderManagement;
