import { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Modal,
  Typography,
  Divider,
  Badge,
  Input,
  Radio,
} from "antd";
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
        item.id === foodId ? { ...item, prepNote: note } : item
      )
    );
  };

  const updateOrderType = (foodId, type) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === foodId ? { ...item, orderType: type } : item
      )
    );
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
    const item = selectedItems.find((item) => item.id === food.id);
    const [localPrepNote, setLocalPrepNote] = useState("");
    const inputRef = useRef(null); // Add a ref for the Input.TextArea

    useEffect(() => {
      if (item) {
        setLocalPrepNote(item.prepNote || "");
      }
    }, [item]);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // Set focus back to the input field after each render
      }
    }, [localPrepNote]); // Re-run this effect whenever localPrepNote changes

    const handlePrepNoteChange = (e) => {
      const newValue = e.target.value;
      setLocalPrepNote(newValue);
      updatePrepNote(food.id, newValue);
    };

    return (
      <div className="flex flex-col p-3 md:p-4 border-b border-gray-100 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <Text strong className="text-base md:text-lg block">
              {food.name}
            </Text>
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
            <Text
              strong
              className="w-6 md:w-8 text-center text-base md:text-lg"
            >
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
        {quantity > 0 && (
          <div className="mt-2 space-y-2">
            <Input.TextArea
              ref={inputRef} // Attach the ref to the Input.TextArea
              placeholder="Special preparation instructions"
              value={localPrepNote}
              onChange={handlePrepNoteChange}
              autoSize={{ minRows: 1, maxRows: 3 }}
            />
            <Radio.Group
              value={item?.orderType || "dine-in"}
              onChange={(e) => updateOrderType(food.id, e.target.value)}
              className="w-full"
            >
              <Radio.Button value="dine-in" className="w-1/2 text-center">
                Dine In
              </Radio.Button>
              <Radio.Button value="takeaway" className="w-1/2 text-center">
                Takeaway
              </Radio.Button>
            </Radio.Group>
          </div>
        )}
      </div>
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
            <div key={item.id} className="border-b pb-2">
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
                <div key={item.id} className="mb-3 pb-3 border-b">
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
          {foods.map((food) => (
            <MenuItem key={food.id} food={food} />
          ))}
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
