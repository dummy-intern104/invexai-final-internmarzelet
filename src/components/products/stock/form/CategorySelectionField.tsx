
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "../ProductForm";

interface CategorySelectionFieldProps {
  form: UseFormReturn<ProductFormValues>;
  categories: string[];
  onOpenAddCategoryDialog: () => void;
}

export const CategorySelectionField: React.FC<CategorySelectionFieldProps> = ({
  form,
  categories,
  onOpenAddCategoryDialog
}) => {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <div className="flex gap-2">
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={onOpenAddCategoryDialog}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
