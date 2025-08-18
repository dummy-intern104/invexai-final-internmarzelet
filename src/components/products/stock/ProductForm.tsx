
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { BasicProductFields } from "./form/BasicProductFields";
import { CategorySelectionField } from "./form/CategorySelectionField";
import { ExpiryDateFormField } from "./form/ExpiryDateFormField";
import { LocationSelectionField } from "./form/LocationSelectionField";

const formSchema = z.object({
  product_name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  expiry_date: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  units: z.string().min(1, "Units is required"),
  reorder_level: z.string().optional(),
  location: z.enum(["local", "warehouse"]),
});

export type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  categories: string[];
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  onOpenAddCategoryDialog: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  onSubmit,
  onCancel,
  onOpenAddCategoryDialog
}) => {
  const [expiryDate, setExpiryDate] = useState<Date>();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      category: "",
      expiry_date: "",
      price: "",
      units: "",
      reorder_level: "5",
      location: "local",
    },
  });

  const handleSubmit = (values: ProductFormValues) => {
    const formData = {
      ...values,
      expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : "",
    };
    console.log("PRODUCT FORM: Submitting with expiry:", formData);
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicProductFields form={form} />
        
        <CategorySelectionField
          form={form}
          categories={categories}
          onOpenAddCategoryDialog={onOpenAddCategoryDialog}
        />

        <ExpiryDateFormField
          form={form}
          expiryDate={expiryDate}
          setExpiryDate={setExpiryDate}
        />
        
        <LocationSelectionField form={form} />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Product</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
