
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { toast } from "sonner";
import useAppStore from "@/store/appStore";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { ProductFormFields } from "./forms/ProductFormFields";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'created_at' | 'user_id'>) => void;
}

export const AddProductDialog = ({
  open,
  onOpenChange,
  onAddProduct,
}: AddProductDialogProps) => {
  const { categories = [] } = useAppStore();
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date>();
  
  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    price: 0,
    units: "0",
    reorder_level: 5,
    // Supplier details
    supplier_company_name: "",
    supplier_gst_number: "",
    supplier_address: "",
    supplier_city: "",
    supplier_state: "",
    supplier_pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (name === 'reorder_level') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const resetForm = () => {
    setFormData({
      product_name: "",
      category: "",
      price: 0,
      units: "0",
      reorder_level: 5,
      supplier_company_name: "",
      supplier_gst_number: "",
      supplier_address: "",
      supplier_city: "",
      supplier_state: "",
      supplier_pincode: "",
    });
    setExpiryDate(undefined);
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.product_name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!formData.category) {
      toast.error("Category is required");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }

    if (parseInt(formData.units) < 0) {
      toast.error("Units cannot be negative");
      return;
    }

    // Submit product with expiry date and supplier details
    const productData = {
      ...formData,
      expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : undefined,
    };
    
    console.log("ADD PRODUCT DIALOG: Submitting product with supplier details:", productData);
    onAddProduct(productData);
    
    // Show success message
    if (expiryDate) {
      toast.success("Product added with supplier details and expiry record");
    } else {
      toast.success("Product added with supplier details successfully");
    }
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the product details and supplier information. Use GST lookup to auto-populate supplier details.
            </DialogDescription>
          </DialogHeader>
          
          <ProductFormFields
            formData={formData}
            categories={categories}
            expiryDate={expiryDate}
            onFormDataChange={handleChange}
            onCategoryChange={handleCategoryChange}
            onExpiryDateChange={setExpiryDate}
            onAddCategory={() => setShowAddCategoryDialog(true)}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddCategoryDialog 
        open={showAddCategoryDialog} 
        onOpenChange={setShowAddCategoryDialog} 
      />
    </>
  );
};
