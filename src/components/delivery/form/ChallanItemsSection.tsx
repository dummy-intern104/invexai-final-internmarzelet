
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

interface ChallanItem {
  id: number;
  productId: number;
  name: string;
  quantity: number;
}

interface ChallanItemsSectionProps {
  items: ChallanItem[];
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  onUpdateItem: (id: number, field: keyof ChallanItem, value: any) => void;
}

export function ChallanItemsSection({ 
  items, 
  onAddItem, 
  onRemoveItem, 
  onUpdateItem 
}: ChallanItemsSectionProps) {
  const products = useAppStore((state) => state.products);

  return (
    <div>
      <h3 className="font-medium mb-2">Items</h3>
      <div className="border rounded-md p-2">
        <div className="grid grid-cols-12 gap-2 font-medium text-sm py-2 px-2">
          <div className="col-span-8">Item</div>
          <div className="col-span-3">Quantity</div>
          <div className="col-span-1"></div>
        </div>
        
        <Separator />
        
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center py-2 px-2">
            <div className="col-span-8">
              <Select
                value={item.name}
                onValueChange={(value) => {
                  const selectedProduct = products.find(p => p.product_name === value);
                  if (selectedProduct) {
                    onUpdateItem(item.id, 'productId', selectedProduct.product_id);
                    onUpdateItem(item.id, 'name', value);
                  }
                }}
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
                      {product.product_name} (Available: {product.units})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => 
                  onUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div className="col-span-1 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(item.id)}
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
            onClick={onAddItem}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}
