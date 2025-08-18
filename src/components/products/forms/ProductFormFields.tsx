
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryField } from "./CategoryField";
import { ExpiryDateField } from "./ExpiryDateField";
import { GSTLookupSection } from "./GSTLookupSection";
import { SupplierDetails } from "@/types";

interface FormData {
  product_name: string;
  category: string;
  price: number;
  units: string;
  reorder_level: number;
  // Supplier details
  supplier_company_name?: string;
  supplier_gst_number?: string;
  supplier_address?: string;
  supplier_city?: string;
  supplier_state?: string;
  supplier_pincode?: string;
}

interface ProductFormFieldsProps {
  formData: FormData;
  categories: string[];
  expiryDate: Date | undefined;
  onFormDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
  onExpiryDateChange: (date: Date | undefined) => void;
  onAddCategory: () => void;
}

export const ProductFormFields = ({
  formData,
  categories,
  expiryDate,
  onFormDataChange,
  onCategoryChange,
  onExpiryDateChange,
  onAddCategory,
}: ProductFormFieldsProps) => {
  const handleSupplierDataFound = (supplierData: SupplierDetails) => {
    // Create synthetic events to trigger the existing form data change handler
    const createSyntheticEvent = (name: string, value: string) => ({
      target: { name, value }
    } as React.ChangeEvent<HTMLInputElement>);

    onFormDataChange(createSyntheticEvent('supplier_company_name', supplierData.companyName));
    onFormDataChange(createSyntheticEvent('supplier_gst_number', supplierData.gstNumber));
    onFormDataChange(createSyntheticEvent('supplier_address', supplierData.address));
    onFormDataChange(createSyntheticEvent('supplier_city', supplierData.city));
    onFormDataChange(createSyntheticEvent('supplier_state', supplierData.state));
    onFormDataChange(createSyntheticEvent('supplier_pincode', supplierData.pincode));
  };

  return (
    <div className="space-y-6">
      {/* GST Lookup Section */}
      <GSTLookupSection onSupplierDataFound={handleSupplierDataFound} />

      {/* Supplier Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Supplier Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="supplier_company_name">Company Name</Label>
            <Input
              id="supplier_company_name"
              name="supplier_company_name"
              value={formData.supplier_company_name || ""}
              onChange={onFormDataChange}
              placeholder="Enter supplier company name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier_gst_number">GST Number</Label>
            <Input
              id="supplier_gst_number"
              name="supplier_gst_number"
              value={formData.supplier_gst_number || ""}
              onChange={onFormDataChange}
              placeholder="Enter GST number"
              maxLength={15}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="supplier_address">Address</Label>
            <Input
              id="supplier_address"
              name="supplier_address"
              value={formData.supplier_address || ""}
              onChange={onFormDataChange}
              placeholder="Enter supplier address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier_city">City</Label>
            <Input
              id="supplier_city"
              name="supplier_city"
              value={formData.supplier_city || ""}
              onChange={onFormDataChange}
              placeholder="Enter city"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier_state">State</Label>
            <Input
              id="supplier_state"
              name="supplier_state"
              value={formData.supplier_state || ""}
              onChange={onFormDataChange}
              placeholder="Enter state"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier_pincode">Pincode</Label>
            <Input
              id="supplier_pincode"
              name="supplier_pincode"
              value={formData.supplier_pincode || ""}
              onChange={onFormDataChange}
              placeholder="Enter pincode"
              maxLength={6}
            />
          </div>
        </div>
      </div>

      {/* Product Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product_name">Product Name</Label>
            <Input
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={onFormDataChange}
              placeholder="Enter product name"
            />
          </div>
          
          <CategoryField
            categories={categories}
            value={formData.category}
            onChange={onCategoryChange}
            onAddCategory={onAddCategory}
          />

          <ExpiryDateField
            expiryDate={expiryDate}
            onExpiryDateChange={onExpiryDateChange}
          />
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ""}
              onChange={onFormDataChange}
              placeholder="Enter price"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="units">Units in Stock</Label>
            <Input
              id="units"
              name="units"
              type="number"
              min="0"
              value={formData.units}
              onChange={onFormDataChange}
              placeholder="Enter stock quantity"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reorder_level">Reorder Level</Label>
            <Input
              id="reorder_level"
              name="reorder_level"
              type="number"
              min="1"
              value={formData.reorder_level}
              onChange={onFormDataChange}
              placeholder="Enter reorder level"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
