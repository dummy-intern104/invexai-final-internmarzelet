
import { useState, useEffect } from "react";
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
import { ProductExpiry } from "@/types";
import { toast } from "sonner";

interface EditExpiryDialogProps {
  expiry: ProductExpiry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateExpiry: (id: string, updates: Partial<ProductExpiry>) => void;
}

export const EditExpiryDialog = ({
  expiry,
  open,
  onOpenChange,
  onUpdateExpiry,
}: EditExpiryDialogProps) => {
  const [formData, setFormData] = useState({
    expiry_date: "",
    batch_number: "",
    quantity: 1,
    status: "active" as "active" | "expired" | "disposed",
    notes: "",
  });

  useEffect(() => {
    if (expiry) {
      setFormData({
        expiry_date: expiry.expiry_date.split('T')[0], // Format for date input
        batch_number: expiry.batch_number || "",
        quantity: expiry.quantity,
        status: expiry.status,
        notes: expiry.notes || "",
      });
    }
  }, [expiry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      setFormData({ ...formData, [name]: parseInt(value) || 1 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value as "active" | "expired" | "disposed" });
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.expiry_date) {
      toast.error("Please select an expiry date");
      return;
    }

    if (formData.quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }

    // Submit updates
    onUpdateExpiry(expiry.id, {
      expiry_date: formData.expiry_date,
      batch_number: formData.batch_number || null,
      quantity: formData.quantity,
      status: formData.status,
      notes: formData.notes || null,
    });

    toast.success("Product expiry updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Edit Product Expiry
          </DialogTitle>
          <DialogDescription>
            Update the expiration details for {expiry?.product_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product_name">Product Name</Label>
            <Input
              value={expiry?.product_name || ""}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input
              id="expiry_date"
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="batch_number">Batch Number</Label>
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="disposed">Disposed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Update Expiry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
