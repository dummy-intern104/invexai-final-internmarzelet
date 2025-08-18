
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Product } from "@/types";
import useAppStore from "@/store/appStore";

interface RestockProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export const RestockProductDialog = ({ open, onOpenChange, product }: RestockProductDialogProps) => {
  const { restockProduct } = useAppStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      quantity: "10"
    }
  });

  React.useEffect(() => {
    if (open) {
      reset({ quantity: "10" });
    }
  }, [open, reset]);

  const onSubmit = (data: { quantity: string }) => {
    try {
      if (!product) {
        toast.error("No product selected");
        return;
      }

      const quantity = parseInt(data.quantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        toast.error("Please enter a valid quantity");
        return;
      }

      restockProduct(product.product_id, quantity);
      onOpenChange(false);
    } catch (error) {
      console.error("Error restocking product:", error);
      toast.error("Failed to restock product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Restock Product</DialogTitle>
          <DialogDescription>
            Add more units to your inventory for {product?.product_name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product</Label>
              <Input
                id="product-name"
                value={product?.product_name || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-stock">Current Stock</Label>
              <Input
                id="current-stock"
                value={product?.units || "0"}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity to Add</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="10"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 1, message: "Quantity must be at least 1" },
                  pattern: { value: /^[0-9]+$/, message: "Quantity must be a number" }
                })}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Restock</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
