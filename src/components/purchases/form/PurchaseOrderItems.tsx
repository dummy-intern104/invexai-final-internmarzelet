
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";

interface PurchaseOrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
  total: number;
}

interface PurchaseOrderItemsProps {
  items: PurchaseOrderItem[];
  setItems: (items: PurchaseOrderItem[]) => void;
}

export function PurchaseOrderItems({ items, setItems }: PurchaseOrderItemsProps) {
  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1;
    setItems([...items, { id: newId, name: "", quantity: 1, price: 0, gstRate: 18, total: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: keyof PurchaseOrderItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.total = updatedItem.quantity * updatedItem.price;
        return updatedItem;
      }
      return item;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Purchase Order Items</h3>
        <Button onClick={addItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price (₹)</TableHead>
              <TableHead>GST Rate (%)</TableHead>
              <TableHead>Total (₹)</TableHead>
              <TableHead className="w-[50px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    placeholder="Enter item name"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={item.gstRate}
                    onChange={(e) => updateItem(item.id, "gstRate", parseFloat(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell>
                  ₹{item.total.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
