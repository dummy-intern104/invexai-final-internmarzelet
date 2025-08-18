
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import { toast } from "sonner";
import useAppStore from "@/store/appStore";
import { AddCategoryDialog } from "@/components/products/AddCategoryDialog";
import { ProductFormFields } from "@/components/products/forms/ProductFormFields";
import { ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const AddProduct = () => {
  const navigate = useNavigate();
  const { categories = [], addProduct } = useAppStore();
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
    
    console.log("ADD PRODUCT PAGE: Submitting product with supplier details:", productData);
    addProduct(productData);
    
    // Show success message
    if (expiryDate) {
      toast.success("Product added with supplier details and expiry record");
    } else {
      toast.success("Product added with supplier details successfully");
    }
    
    // Reset form and navigate back
    resetForm();
    navigate("/products");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/products")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Product</CardTitle>
            <CardDescription>
              Enter the product and supplier details below. Use GST lookup to auto-populate supplier information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProductFormFields
              formData={formData}
              categories={categories}
              expiryDate={expiryDate}
              onFormDataChange={handleChange}
              onCategoryChange={handleCategoryChange}
              onExpiryDateChange={setExpiryDate}
              onAddCategory={() => setShowAddCategoryDialog(true)}
            />
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/products")}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Add Product
              </Button>
            </div>
          </CardContent>
        </Card>

        <AddCategoryDialog 
          open={showAddCategoryDialog} 
          onOpenChange={setShowAddCategoryDialog} 
        />
      </div>
    </MainLayout>
  );
};

export default AddProduct;
