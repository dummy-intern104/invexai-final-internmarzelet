
import React, { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "../ProductForm";

interface ExpiryDateFormFieldProps {
  form: UseFormReturn<ProductFormValues>;
  expiryDate: Date | undefined;
  setExpiryDate: (date: Date | undefined) => void;
}

export const ExpiryDateFormField: React.FC<ExpiryDateFormFieldProps> = ({
  form,
  expiryDate,
  setExpiryDate
}) => {
  return (
    <FormField
      control={form.control}
      name="expiry_date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Expiry Date (Optional)</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiryDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : <span>Pick expiry date</span>}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={expiryDate}
                onSelect={(date) => {
                  setExpiryDate(date);
                  field.onChange(date ? date.toISOString().split('T')[0] : "");
                }}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {expiryDate && (
            <p className="text-sm text-muted-foreground">
              This will automatically create an expiry record.
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
