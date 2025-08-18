
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "../ProductForm";

interface LocationSelectionFieldProps {
  form: UseFormReturn<ProductFormValues>;
}

export const LocationSelectionField: React.FC<LocationSelectionFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Stock Location</FormLabel>
          <div className="flex gap-4">
            <Label className="flex items-center gap-2">
              <input
                type="radio"
                value="local"
                checked={field.value === "local"}
                onChange={() => field.onChange("local")}
                className="h-4 w-4"
              />
              <span>Local Shop</span>
            </Label>
            <Label className="flex items-center gap-2">
              <input
                type="radio"
                value="warehouse"
                checked={field.value === "warehouse"}
                onChange={() => field.onChange("warehouse")}
                className="h-4 w-4"
              />
              <span>Warehouse</span>
            </Label>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
