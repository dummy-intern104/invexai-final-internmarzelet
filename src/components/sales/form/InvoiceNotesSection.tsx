import React from "react";
import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceForm } from "../types/invoiceTypes";

interface InvoiceNotesSectionProps {
  control: Control<InvoiceForm>;
}

export function InvoiceNotesSection({ control }: InvoiceNotesSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Additional notes for the client"
                className="resize-none h-20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="terms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Terms & Conditions</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Terms and conditions"
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
