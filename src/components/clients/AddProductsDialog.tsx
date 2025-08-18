
import React, { useState } from "react";
import { toast } from "sonner";
import { Package, Plus, Minus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import useAppStore from "@/store/appStore";

interface AddProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: number;
  clientName: string;
}

interface SelectedProduct {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  category: string;
}

export function AddProductsDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
}: AddProductsDialogProps) {
  const { products, recordSale } = useAppStore();
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  const addProduct = (product: any) => {
    const existing = selectedProducts.find(p => p.product_id === product.product_id);
    if (existing) {
      setSelectedProducts(selectedProducts.map(p => 
        p.product_id === product.product_id 
          ? { ...p, quantity: p.quantity + 1 }
          : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, {
        product_id: product.product_id,
        product_name: product.product_name,
        price: product.price,
        quantity: 1,
        category: product.category,
      }]);
    }
  };

  const updateQuantity = (productId: number, change: number) => {
    setSelectedProducts(selectedProducts.map(p => {
      if (p.product_id === productId) {
        const newQuantity = Math.max(0, p.quantity + change);
        return newQuantity === 0 ? null : { ...p, quantity: newQuantity };
      }
      return p;
    }).filter(Boolean) as SelectedProduct[]);
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.product_id !== productId));
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const handleAddProducts = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    // Record sales for each selected product
    selectedProducts.forEach(product => {
      recordSale({
        product_id: product.product_id,
        quantity_sold: product.quantity,
        selling_price: product.price * product.quantity,
        clientId: clientId,
        clientName: clientName,
      });
    });

    toast.success(`Added ${selectedProducts.length} product(s) for ${clientName}`);
    setSelectedProducts([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Products for {clientName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh]">
          {/* Available Products */}
          <div>
            <h3 className="font-semibold mb-2">Available Products</h3>
            <ScrollArea className="h-full border rounded-md">
              <div className="p-2 space-y-2">
                {products.map((product) => (
                  <Card key={product.product_id} className="cursor-pointer hover:bg-accent" onClick={() => addProduct(product)}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{product.product_name}</h4>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                          <p className="text-sm font-semibold text-green-600">₹{product.price}</p>
                        </div>
                        <div className="text-xs">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {product.units} in stock
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Products */}
          <div>
            <h3 className="font-semibold mb-2">Selected Products</h3>
            <ScrollArea className="h-full border rounded-md">
              <div className="p-2 space-y-2">
                {selectedProducts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No products selected</p>
                  </div>
                ) : (
                  selectedProducts.map((product) => (
                    <Card key={product.product_id}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-sm">{product.product_name}</h4>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeProduct(product.product_id)}
                            className="h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateQuantity(product.product_id, -1)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">{product.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateQuantity(product.product_id, 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm font-semibold">₹{(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-lg font-bold text-green-600">₹{getTotalAmount().toFixed(2)}</span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddProducts} disabled={selectedProducts.length === 0}>
            <Package className="w-4 h-4 mr-2" />
            Add Products
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
