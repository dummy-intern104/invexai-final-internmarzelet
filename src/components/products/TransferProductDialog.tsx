
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAppStore from "@/store/appStore";
import { MoveHorizontal } from "lucide-react";

interface TransferProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceType: 'local' | 'warehouse';
}

export const TransferProductDialog = ({
  open,
  onOpenChange,
  sourceType,
}: TransferProductDialogProps) => {
  const { products, transferProduct } = useAppStore();
  
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Filter products based on source location
  const availableProducts = products.filter(product => {
    const isWarehouse = product.product_name.includes("(Warehouse)");
    return (sourceType === 'warehouse' && isWarehouse) || 
           (sourceType === 'local' && !isWarehouse);
  });

  // Get the selected product
  const selectedProduct = products.find(p => p.product_id === selectedProductId);
  
  // Calculate max available quantity
  const maxQuantity = selectedProduct ? parseInt(selectedProduct.units as string, 10) : 0;
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value, 10) || 0);
  };

  const handleSubmit = () => {
    if (!selectedProductId) {
      toast.error("Please select a product to transfer");
      return;
    }
    
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }
    
    if (quantity > maxQuantity) {
      toast.error(`Only ${maxQuantity} units available to transfer`);
      return;
    }
    
    // Perform the transfer
    transferProduct(
      selectedProductId, 
      quantity, 
      sourceType === 'local' ? 'warehouse' : 'local'
    );
    
    // Reset form
    setSelectedProductId(0);
    setQuantity(1);
    
    // Close dialog
    onOpenChange(false);
  };

  const destinationType = sourceType === 'local' ? 'Warehouse' : 'Local Shop';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Products</DialogTitle>
          <DialogDescription>
            Move products from {sourceType === 'local' ? 'Local Shop' : 'Warehouse'} to {destinationType}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product">Select Product</Label>
            <Select 
              value={selectedProductId ? selectedProductId.toString() : ""} 
              onValueChange={(value) => setSelectedProductId(parseInt(value, 10))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select product to transfer" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product) => (
                  <SelectItem key={product.product_id} value={product.product_id.toString()}>
                    {product.product_name} ({product.units} units available)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Transfer</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="Enter quantity"
            />
            {selectedProduct && (
              <p className="text-xs text-muted-foreground">
                Available: {maxQuantity} units
              </p>
            )}
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="px-4 py-2 rounded-md bg-muted/50 flex items-center gap-3">
              <div className="text-center">
                <p className="font-medium">{sourceType === 'local' ? 'Local Shop' : 'Warehouse'}</p>
              </div>
              <MoveHorizontal className="h-5 w-5" />
              <div className="text-center">
                <p className="font-medium">{destinationType}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedProductId || quantity <= 0 || quantity > maxQuantity}>
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
