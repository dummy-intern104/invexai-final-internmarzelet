
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePurchaseReturns } from "./hooks/usePurchaseReturns";

interface PurchaseReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReturnCreated?: (returnData: any) => void;
  isFullScreen?: boolean;
}

interface ReturnForm {
  purchaseOrderNo: string;
  supplierName: string;
  productName: string;
  returnQuantity: number;
  returnReason: string;
  notes: string;
}

const returnReasons = [
  "Defective Product",
  "Wrong Item Received",
  "Damaged During Shipping",
  "Expired Product",
  "Quality Issues",
  "Overstock",
  "Other"
];

export function PurchaseReturnDialog({
  open,
  onOpenChange,
  onReturnCreated,
  isFullScreen = false
}: PurchaseReturnDialogProps) {
  const location = useLocation();
  const { addReturn } = usePurchaseReturns();
  const form = useForm<ReturnForm>({
    defaultValues: {
      purchaseOrderNo: "",
      supplierName: "",
      productName: "",
      returnQuantity: 1,
      returnReason: "",
      notes: "",
    },
  });

  // Pre-fill form data when coming from purchase order
  useEffect(() => {
    if (location.state?.returnData) {
      const { returnData } = location.state;
      form.reset({
        purchaseOrderNo: returnData.orderNo || "",
        supplierName: returnData.supplierName || "",
        productName: returnData.items?.map((item: any) => item.name).join(", ") || "",
        returnQuantity: 1,
        returnReason: "",
        notes: `Return for PO: ${returnData.orderNo}`,
      });
    }
  }, [location.state, form]);

  const onSubmit = async (data: ReturnForm) => {
    try {
      const returnData = {
        purchaseOrderNo: data.purchaseOrderNo,
        supplierName: data.supplierName,
        productName: data.productName,
        returnQuantity: data.returnQuantity,
        returnReason: data.returnReason,
        notes: data.notes,
        returnDate: new Date().toISOString(),
        status: "pending" as const,
        returnNo: `RET-${Date.now().toString().slice(-6)}`,
        totalAmount: location.state?.returnData?.totalAmount || 0,
      };

      await addReturn(returnData);
      
      console.log("Creating purchase return:", returnData);
      toast.success("Purchase return created successfully");
      
      if (onReturnCreated) {
        onReturnCreated(returnData);
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating purchase return:", error);
      toast.error("Failed to create purchase return");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isFullScreen ? "w-full h-full max-w-none max-h-none m-0 rounded-none" : "sm:max-w-[600px]"}>
        <DialogHeader>
          <DialogTitle>Create Purchase Return</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="purchaseOrderNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Order Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter PO number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplierName"
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
              name="productName"
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

            <FormField
              control={form.control}
              name="returnQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="returnReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return Reason</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select return reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {returnReasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about the return..."
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
                Create Return
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
