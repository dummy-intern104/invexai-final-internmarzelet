
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SaleDetailsFormProps {
  quantity: number;
  price: number;
  maxQuantity?: number;
  onQuantityChange: (quantity: number) => void;
  onPriceChange: (price: number) => void;
  quantityError: boolean;
  priceError: boolean;
  disabled: boolean;
}

const SaleDetailsForm = ({
  quantity,
  price,
  maxQuantity,
  onQuantityChange,
  onPriceChange,
  quantityError,
  priceError,
  disabled
}: SaleDetailsFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={(e) => {
            const qty = parseInt(e.target.value) || 0;
            onQuantityChange(qty);
          }}
          className={quantityError ? "border-red-500" : ""}
          disabled={disabled}
        />
        {quantityError && (
          <p className="text-xs text-red-500">Quantity must be greater than 0</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
        <div className="relative">
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price || ""}
            onChange={(e) => {
              const priceValue = parseFloat(e.target.value) || 0;
              onPriceChange(priceValue);
            }}
            className={priceError ? "border-red-500" : ""}
            disabled={disabled}
          />
          <span className="absolute right-3 top-2.5 text-muted-foreground">
            INR
          </span>
        </div>
        {priceError && (
          <p className="text-xs text-red-500">Price must be greater than 0</p>
        )}
      </div>
    </>
  );
};

export default SaleDetailsForm;
