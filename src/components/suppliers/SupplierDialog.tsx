
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSuppliers } from "./hooks/useSuppliers";

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: any;
  onSupplierCreated?: (supplierData: any) => void;
  isFullScreen?: boolean;
}

interface SupplierForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  gst: string;
}

export function SupplierDialog({
  open,
  onOpenChange,
  supplier,
  onSupplierCreated,
  isFullScreen = false
}: SupplierDialogProps) {
  const { addSupplier, updateSupplier } = useSuppliers();
  const form = useForm<SupplierForm>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      gst: "",
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (supplier) {
      form.reset({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        gst: supplier.gst || "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        address: "",
        gst: "",
      });
    }
  }, [supplier, form]);

  const onSubmit = async (data: SupplierForm) => {
    try {
      let savedSupplier;
      if (supplier) {
        await updateSupplier(supplier.id, data);
        toast.success("Supplier updated successfully");
        savedSupplier = { ...supplier, ...data };
      } else {
        savedSupplier = await addSupplier(data);
        toast.success("Supplier created successfully");
      }
      
      // Call the onSupplierCreated callback if provided
      if (onSupplierCreated && !supplier) {
        onSupplierCreated(savedSupplier);
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error saving supplier:", error);
      toast.error("Failed to save supplier");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isFullScreen ? "w-full h-full max-w-none max-h-none m-0 rounded-none" : "sm:max-w-[600px]"}>
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Edit Supplier" : "Add New Supplier"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter supplier name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="supplier@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gst"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter GST number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter complete address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {supplier ? "Update Supplier" : "Add Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
