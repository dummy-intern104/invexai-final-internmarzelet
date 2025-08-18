
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSectionProps } from "./types";
import { addYears, subYears, format } from "date-fns";

export const PredictionForm = ({ predictionData, setPredictionData, products }: FormSectionProps) => {
  // Calculate date ranges for min/max values
  const oneYearAgo = format(subYears(new Date(), 1), 'yyyy-MM-dd');
  const oneYearFromNow = format(addYears(new Date(), 1), 'yyyy-MM-dd');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPredictionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (value: string) => {
    if (value === "custom") {
      setPredictionData(prev => ({
        ...prev,
        product_id: 0,
        is_custom_product: true
      }));
    } else {
      const selectedProduct = products.find(p => p.product_id === parseInt(value));
      if (selectedProduct) {
        setPredictionData(prev => ({
          ...prev,
          product_id: selectedProduct.product_id,
          is_custom_product: false,
          price: selectedProduct.price,
          current_stock: parseInt(selectedProduct.units as string) || 0
        }));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="productSelect">Select Product</Label>
        <Select 
          value={
            predictionData.is_custom_product 
            ? "custom" 
            : predictionData.product_id ? predictionData.product_id.toString() : ""
          }
          onValueChange={handleProductChange}
        >
          <SelectTrigger id="productSelect">
            <SelectValue placeholder="Choose a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.product_id} value={product.product_id.toString()}>
                {product.product_name}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom Product</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {predictionData.is_custom_product && (
        <div>
          <Label htmlFor="custom_product">Custom Product Name</Label>
          <Input
            id="custom_product"
            name="custom_product"
            value={predictionData.custom_product}
            onChange={handleInputChange}
            placeholder="Enter custom product name"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="current_stock">Current Stock</Label>
          <Input
            id="current_stock"
            name="current_stock"
            type="number"
            min="0"
            value={predictionData.current_stock}
            onChange={handleInputChange}
            placeholder="Current inventory"
          />
        </div>

        <div>
          <Label htmlFor="previous_sales">Previous Sales</Label>
          <Input
            id="previous_sales"
            name="previous_sales"
            type="number"
            min="0"
            value={predictionData.previous_sales}
            onChange={handleInputChange}
            placeholder="Previous 30-day sales"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            value={predictionData.price}
            onChange={handleInputChange}
            placeholder="Unit price"
          />
        </div>

        <div>
          <Label htmlFor="date">Data Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={predictionData.date}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Prediction Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            min={oneYearAgo}
            max={oneYearFromNow}
            value={predictionData.start_date}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="end_date">Prediction End Date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            min={oneYearAgo}
            max={oneYearFromNow}
            value={predictionData.end_date}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};
