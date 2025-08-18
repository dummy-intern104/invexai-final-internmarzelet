
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

interface ChallanForm {
  clientName: string;
  date: Date;
  deliveryAddress: string;
  items: any[];
  notes: string;
  vehicleNo: string;
}

interface ChallanAdditionalDetailsProps {
  form: UseFormReturn<ChallanForm>;
}

export function ChallanAdditionalDetails({ form }: ChallanAdditionalDetailsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="deliveryAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Delivery Address</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Delivery address"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Additional notes for delivery"
                className="resize-none"
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
