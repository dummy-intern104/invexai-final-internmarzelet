
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface PurchaseOrderFormData {
  orderNo: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierAddress: string;
  supplierGST: string;
  orderDate: string;
  expectedDelivery: string;
  paymentMode: string;
  notes: string;
}

interface PurchaseOrderNotesProps {
  form: UseFormReturn<PurchaseOrderFormData>;
}

export function PurchaseOrderNotes({ form }: PurchaseOrderNotesProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any additional notes for this purchase order..."
                className="resize-none h-20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
