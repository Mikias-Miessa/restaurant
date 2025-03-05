import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, Input, Radio, Typography } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const MenuItem = React.memo(
  ({
    food,
    selectedItems,
    handleQuantityChange,
    updatePrepNote,
    updateOrderType,
    getItemQuantity,
  }) => {
    const quantity = getItemQuantity(food._id);
    const item = selectedItems.find((item) => item._id === food._id);
    const [localPrepNote, setLocalPrepNote] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
      if (item) {
        setLocalPrepNote(item.prepNote || "");
      } else {
        setLocalPrepNote("");
      }
    }, [item]);

    const handlePrepNoteChange = (e) => {
      const newValue = e.target.value;
      setLocalPrepNote(newValue);
      updatePrepNote(food._id, newValue);
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
              ref={inputRef}
              placeholder="Special preparation instructions"
              value={localPrepNote}
              onChange={handlePrepNoteChange}
              autoSize={{ minRows: 1, maxRows: 3 }}
            />
            <Radio.Group
              value={item?.orderType || "dine-in"}
              onChange={(e) => updateOrderType(food._id, e.target.value)}
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
  }
);

export default MenuItem;
