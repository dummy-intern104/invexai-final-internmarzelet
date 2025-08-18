
import React from "react";
import { Plus, X } from "lucide-react";
import useAppStore from "@/store/appStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EstimateItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  product_id?: number; // Add product_id to track which product this is
}

interface EstimateItemsSectionProps {
  items: EstimateItem[];
  setItems: React.Dispatch<React.SetStateAction<EstimateItem[]>>;
}

export function EstimateItemsSection({ items, setItems }: EstimateItemsSectionProps) {
  const products = useAppStore((state) => state.products);

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: newId, name: "", quantity: 1, price: 0, total: 0 }]);
  };
  
  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const updateItem = (id: number, field: keyof EstimateItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-fill price and product_id when product is selected
        if (field === 'name' && value !== 'custom') {
          const selectedProduct = products.find(p => p.product_name === value);
          if (selectedProduct) {
            updatedItem.price = selectedProduct.price;
            updatedItem.product_id = selectedProduct.product_id;
            console.log("ESTIMATE ITEM: Selected product", {
              name: selectedProduct.product_name,
              id: selectedProduct.product_id,
              price: selectedProduct.price
            });
          }
        }
        
        // Clear product_id for custom items
        if (field === 'name' && value === 'custom') {
          updatedItem.product_id = undefined;
        }
        
        // Recalculate total if quantity or price changed
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    }));
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  return (
    <div>
      <h3 className="font-medium mb-2">Items</h3>
      <div className="border rounded-md p-2">
        <div className="grid grid-cols-12 gap-2 font-medium text-sm py-2 px-2">
          <div className="col-span-5">Item</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-1"></div>
        </div>
        
        <Separator />
        
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center py-2 px-2">
            <div className="col-span-5">
              <Select
                value={item.name}
                onValueChange={(value) => updateItem(item.id, 'name', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem 
                      key={product.product_id} 
                      value={product.product_name}
                    >
                      {product.product_name} - ₹{product.price}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Item</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => 
                  updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={item.price}
                onChange={(e) => 
                  updateItem(item.id, 'price', parseFloat(e.target.value) || 0)
                }
                disabled={item.name !== 'custom' && item.name !== ''}
                className={item.name !== 'custom' && item.name !== '' ? 'bg-gray-100' : ''}
              />
            </div>
            <div className="col-span-2 text-right pt-2">
              ₹{(item.quantity * item.price).toLocaleString()}
            </div>
            <div className="col-span-1 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="py-2 px-2">
          <Button 
            type="button"
            variant="outline" 
            className="w-full"
            onClick={addItem}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex justify-end py-2 px-2">
          <div className="w-1/3 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total:</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
