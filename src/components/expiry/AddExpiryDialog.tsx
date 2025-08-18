
import { useState } from "react";
import { Calendar } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/types";
import { toast } from "sonner";

interface AddExpiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpiry: (expiry: any) => void;
  products: Product[];
  isFullPage?: boolean;
}

export const AddExpiryDialog = ({
  open,
  onOpenChange,
  onAddExpiry,
  products,
  isFullPage = false
}: AddExpiryDialogProps) => {
  const [formData, setFormData] = useState({
    product_id: "",
    expiry_date: "",
    batch_number: "",
    quantity: 1,
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      setFormData({ ...formData, [name]: parseInt(value) || 1 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleProductChange = (value: string) => {
    setFormData({ ...formData, product_id: value });
  };

  const resetForm = () => {
    setFormData({
      product_id: "",
      expiry_date: "",
      batch_number: "",
      quantity: 1,
      notes: "",
    });
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.product_id) {
      toast.error("Please select a product");
      return;
    }

    if (!formData.expiry_date) {
      toast.error("Please select an expiry date");
      return;
    }

    const expiryDate = new Date(formData.expiry_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expiryDate < today) {
      toast.error("Expiry date cannot be in the past");
      return;
    }

    if (formData.quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }

    // Submit expiry - use product_id for compatibility
    onAddExpiry({
      product_id: parseInt(formData.product_id),
      expiry_date: formData.expiry_date,
      batch_number: formData.batch_number || null,
      quantity: formData.quantity,
      notes: formData.notes || null,
      status: 'active',
    });

    toast.success("Product expiry added successfully");
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  const FormContent = () => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="product_id">Product</Label>
        <Select value={formData.product_id} onValueChange={handleProductChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={(product.product_id || 0).toString()}>
                {product.product_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiry_date">Expiry Date</Label>
        <Input
          id="expiry_date"
          name="expiry_date"
          type="date"
          value={formData.expiry_date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="batch_number">Batch Number (Optional)</Label>
        <Input
          id="batch_number"
          name="batch_number"
          value={formData.batch_number}
          onChange={handleChange}
          placeholder="Enter batch number"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this batch"
          rows={3}
        />
      </div>
    </div>
  );

  const FormActions = () => (
    <DialogFooter>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>
        Add Expiry
      </Button>
    </DialogFooter>
  );

  if (isFullPage) {
    return (
      <div className="space-y-6">
        <FormContent />
        <FormActions />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Add Product Expiry
          </DialogTitle>
          <DialogDescription>
            Track the expiration date of your products to maintain quality and reduce waste.
          </DialogDescription>
        </DialogHeader>
        <FormContent />
        <FormActions />
      </DialogContent>
    </Dialog>
  );
};
