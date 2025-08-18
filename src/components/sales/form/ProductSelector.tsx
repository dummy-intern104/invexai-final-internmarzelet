
import { Label } from "@/components/ui/label";
import { Product } from "@/types";

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: number;
  onProductChange: (productId: number, price: number) => void;
  error: boolean;
  disabled: boolean;
}

const ProductSelector = ({ 
  products, 
  selectedProductId, 
  onProductChange, 
  error, 
  disabled 
}: ProductSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="product">Product <span className="text-red-500">*</span></Label>
      <select
        id="product"
        className={`flex h-10 w-full rounded-md border ${error ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
        onChange={(e) => {
          const productId = parseInt(e.target.value);
          const selectedProduct = products.find(
            (p) => p.product_id === productId
          );
          onProductChange(productId, selectedProduct?.price || 0);
        }}
        value={selectedProductId || ""}
        disabled={disabled}
      >
        <option value="">Select a product</option>
        {products.map((product) => {
          const productId = product.product_id;
          if (!productId) return null;
          
          return (
            <option 
              key={productId} 
              value={productId}
              disabled={parseInt(product.units as string) <= 0}
            >
              {product.product_name} - ₹{product.price.toFixed(2)}
              {parseInt(product.units as string) <= 0 ? " (Out of Stock)" : ""}
            </option>
          );
        })}
      </select>
      {error && (
        <p className="text-xs text-red-500">Product selection is required</p>
      )}
    </div>
  );
};

export default ProductSelector;
