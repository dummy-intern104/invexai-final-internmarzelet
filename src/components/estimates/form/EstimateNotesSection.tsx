
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

interface EstimateForm {
  clientName: string;
  date: Date;
  validUntil: Date;
  items: any[];
  notes: string;
  terms: string;
}

interface EstimateNotesSectionProps {
  control: Control<EstimateForm>;
}

export function EstimateNotesSection({ control }: EstimateNotesSectionProps) {
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
