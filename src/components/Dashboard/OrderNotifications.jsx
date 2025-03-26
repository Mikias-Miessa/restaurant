import { useState } from "react";
import { Table, Button, message, Tag, Typography, Modal } from "antd";
import { PrinterOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useOrders } from "../../contexts/OrderContext";

const { Title, Text } = Typography;

function OrderNotifications() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [orderDestination, setOrderDestination] = useState("kitchen");
  const [printedOrders, setPrintedOrders] = useState(new Set());
  const { orders } = useOrders(); // Use the shared context

  const handlePrint = () => {
    const printContent = document.getElementById("receipt-content");
    const windowPrint = window.open("", "", "width=300,height=600");
    windowPrint.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            @page { size: 80mm 297mm; margin: 0; }
            body { 
              width: 80mm;
              font-family: monospace;
              margin: 0;
              padding: 8px;
            }
            .text-center { text-align: center; }
            .mb-1 { margin-bottom: 0.25rem; }
            .mb-4 { margin-bottom: 1rem; }
            .block { display: block; }
            .font-bold { font-weight: bold; }
            .text-lg { font-size: 1.125rem; }
            .text-xl { font-size: 1.25rem; }
            .text-gray-600 { color: #4B5563; }
            .text-gray-500 { color: #6B7280; }
            .text-xs { font-size: 0.75rem; }
            .border-b { border-bottom: 1px solid #E5E7EB; }
            .pb-2 { padding-bottom: 0.5rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .my-2 { margin: 0.5rem 0; }
            .my-4 { margin: 1rem 0; }
            .mt-4 { margin-top: 1rem; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-start { align-items: flex-start; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    windowPrint.document.close();
    windowPrint.focus();
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
      // Mark order as printed
      if (selectedOrder) {
        setPrintedOrders(
          (prev) => new Set([...prev, selectedOrder.orderNumber])
        );
        message.success(`Order #${selectedOrder.orderNumber} has been printed`);
      }
      setIsReceiptModalVisible(false);
    }, 250);
  };

  const Receipt = () => {
    if (!selectedOrder) return null;

    return (
      <div id="receipt-content" className="bg-white p-4 md:p-6 font-mono">
        <div className="text-center mb-4 md:mb-6">
          <Title level={3} className="mb-1">
            {orderDestination.toUpperCase()} ORDER
          </Title>
          <Text className="font-bold text-lg block">
            Order #: {selectedOrder.orderNumber}
          </Text>
          <Text className="block">
            {new Date(selectedOrder.timestamp).toLocaleString()}
          </Text>
          {selectedOrder.waiterName && (
            <Text className="block mt-2">
              Waiter: {selectedOrder.waiterName}
            </Text>
          )}
        </div>

        <div className="border-t border-b py-4 my-4">
          <div className="space-y-4">
            {selectedOrder.items.map((item) => (
              <div key={`receipt-${item._id}`} className="border-b pb-2">
                <div className="flex justify-between items-start">
                  <Text className="text-xl font-bold">{item.name}</Text>
                  <Text className="font-bold">x{item.quantity}</Text>
                </div>
                {item.orderType && (
                  <Text className="text-gray-600 block">
                    Type: {item.orderType.toUpperCase()}
                  </Text>
                )}
                <Text className="text-gray-600 block">
                  {item.prepNote ? item.prepNote : "Standard preparation"}
                </Text>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-4">
          <Text className="font-bold block">
            Total Items:{" "}
            {selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
          </Text>
          <Text className="text-xs text-gray-500">
            Printed: {new Date().toLocaleTimeString()}
          </Text>
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    {
      title: "Waiter",
      dataIndex: "waiterName",
      key: "waiterName",
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
      render: (destination) => (
        <Tag color={destination === "kitchen" ? "blue" : "orange"}>
          {destination.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {items.map((item, index) => (
            <li key={index}>
              {item.name} x{item.quantity}
              {item.prepNote && (
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Note: {item.prepNote}
                </div>
              )}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) =>
        printedOrders.has(record.orderNumber) ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Printed
          </Tag>
        ) : (
          <Tag color="warning">Pending</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<PrinterOutlined />}
          onClick={() => {
            setSelectedOrder(record);
            setOrderDestination(record.destination);
            setIsReceiptModalVisible(true);
          }}
          type={printedOrders.has(record.orderNumber) ? "default" : "primary"}
        >
          {printedOrders.has(record.orderNumber) ? "Print Again" : "Print"}
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderNumber"
        pagination={{
          pageSize: 10,
          position: ["bottomCenter"],
        }}
        scroll={{ x: true }}
        rowClassName={(record) =>
          printedOrders.has(record.orderNumber) ? "bg-gray-50" : ""
        }
      />

      <Modal
        title={`${
          orderDestination.charAt(0).toUpperCase() + orderDestination.slice(1)
        } Order`}
        open={isReceiptModalVisible}
        onCancel={() => setIsReceiptModalVisible(false)}
        width={window.innerWidth < 768 ? "90%" : 400}
        centered
        footer={[
          <div key="footer" className="flex flex-col gap-2">
            <div className="flex justify-center mb-2">
              <Button.Group>
                <Button
                  type={orderDestination === "kitchen" ? "primary" : "default"}
                  onClick={() => setOrderDestination("kitchen")}
                >
                  Kitchen
                </Button>
                <Button
                  type={orderDestination === "butcher" ? "primary" : "default"}
                  onClick={() => setOrderDestination("butcher")}
                >
                  Butcher
                </Button>
              </Button.Group>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsReceiptModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" onClick={handlePrint}>
                {printedOrders.has(selectedOrder?.orderNumber)
                  ? "Print Again"
                  : "Print"}
              </Button>
            </div>
          </div>,
        ]}
      >
        <Receipt />
      </Modal>
    </div>
  );
}

export default OrderNotifications;
