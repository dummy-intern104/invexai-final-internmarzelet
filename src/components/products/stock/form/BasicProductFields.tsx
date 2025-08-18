
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "../ProductForm";

interface BasicProductFieldsProps {
  form: UseFormReturn<ProductFormValues>;
}

export const BasicProductFields: React.FC<BasicProductFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="product_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter product name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (₹)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="units"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Units</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="reorder_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reorder Level</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="5" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
