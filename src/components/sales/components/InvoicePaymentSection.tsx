
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoiceForm } from '../types/invoiceTypes';

interface InvoicePaymentSectionProps {
  control: Control<InvoiceForm>;
}

const paymentModes = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Net Banking",
  "Digital Wallet"
];

export const InvoicePaymentSection: React.FC<InvoicePaymentSectionProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="paymentMode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Payment Mode</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {paymentModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
