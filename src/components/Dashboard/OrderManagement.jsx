import { useState } from "react";
import { Button, Card, Modal, Typography, Divider, Badge } from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function OrderManagement() {
  const [foods] = useState([
    { id: 1, name: "Pizza Margherita", price: 10.99 },
    { id: 2, name: "Cheeseburger", price: 8.99 },
    { id: 3, name: "Caesar Salad", price: 6.99 },
    { id: 4, name: "Pasta Carbonara", price: 12.99 },
    { id: 5, name: "Greek Salad", price: 7.99 },
    { id: 6, name: "Chicken Wings", price: 9.99 },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);

  const handleQuantityChange = (food, quantity) => {
    if (quantity === 0) {
      setSelectedItems(selectedItems.filter((item) => item.id !== food.id));
      return;
    }

    const existingItem = selectedItems.find((item) => item.id === food.id);
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.id === food.id ? { ...item, quantity } : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...food, quantity }]);
    }
  };

  const getItemQuantity = (foodId) => {
    const item = selectedItems.find((item) => item.id === foodId);
    return item ? item.quantity : 0;
  };

  const calculateTotal = () => {
    return selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const MenuItem = ({ food }) => {
    const quantity = getItemQuantity(food.id);

    return (
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-100 hover:bg-gray-50">
        <div>
          <Text strong className="text-base md:text-lg block">
            {food.name}
          </Text>
          <Text className="text-green-600">${food.price.toFixed(2)}</Text>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          <Button
            type={quantity > 0 ? "primary" : "default"}
            icon={<MinusOutlined />}
            onClick={() =>
              handleQuantityChange(food, Math.max(0, quantity - 1))
            }
            className="flex items-center justify-center"
            size="small"
          />
          <Text strong className="w-6 md:w-8 text-center text-base md:text-lg">
            {quantity}
          </Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(food, quantity + 1)}
            className="flex items-center justify-center"
            size="small"
          />
        </div>
      </div>
    );
  };

  const Receipt = () => {
    const currentDate = new Date().toLocaleString();
    const orderNumber = Math.floor(Math.random() * 1000000);

    return (
      <div className="bg-white p-4 md:p-6 font-mono">
        <div className="text-center mb-4 md:mb-6">
          <Title level={4}>RESTAURANT NAME</Title>
          <Text>123 Restaurant Street</Text>
          <br />
          <Text>Phone: (123) 456-7890</Text>
          <br />
          <Text className="font-bold">Order #: {orderNumber}</Text>
          <br />
          <Text>{currentDate}</Text>
        </div>

        <Divider />

        {selectedItems.map((item) => (
          <div key={item.id} className="flex justify-between mb-2 md:mb-3">
            <div>
              <Text strong>{item.name}</Text>
              <Text className="block text-gray-500">x{item.quantity}</Text>
            </div>
            <Text>${(item.price * item.quantity).toFixed(2)}</Text>
          </div>
        ))}

        <Divider />

        <div className="flex justify-between text-base md:text-lg font-bold">
          <Text>TOTAL</Text>
          <Text>${calculateTotal().toFixed(2)}</Text>
        </div>

        <Divider />

        <div className="text-center mt-4 md:mt-6">
          <Text className="block mb-2">Thank you for your order!</Text>
          <Text className="text-gray-500">Please come again</Text>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      {/* Menu Items Section */}
      <div className="w-full lg:w-2/3 p-4 md:p-6 overflow-auto border-b lg:border-b-0 lg:border-r">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <Title level={2} className="mb-0 text-xl md:text-2xl">
            Menu Items
          </Title>
          {/* Mobile Order Button */}
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
          {foods.map((food) => (
            <MenuItem key={food.id} food={food} />
          ))}
        </div>
      </div>

      {/* Order Summary Section */}
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
              <Text className="block text-gray-400 mt-2">
                No items selected
              </Text>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-3"
                  >
                    <div>
                      <Text strong>{item.name}</Text>
                      <Text className="block text-gray-500">
                        x{item.quantity}
                      </Text>
                    </div>
                    <Text strong>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </div>
                ))}

                <Divider />

                <div className="flex justify-between items-center">
                  <Text strong className="text-base md:text-lg">
                    Total
                  </Text>
                  <Text strong className="text-base md:text-lg text-green-600">
                    ${calculateTotal().toFixed(2)}
                  </Text>
                </div>
              </div>

              {/* Desktop Complete Order Button */}
              <Button
                type="primary"
                size="large"
                block
                icon={<ShoppingCartOutlined />}
                onClick={() => setIsReceiptModalVisible(true)}
                className="hidden lg:flex items-center justify-center"
              >
                Complete Order
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Order Receipt"
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
