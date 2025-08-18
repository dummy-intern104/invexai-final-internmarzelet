
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

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

interface PurchaseOrderHeaderProps {
  form: UseFormReturn<PurchaseOrderFormData>;
}

const paymentModes = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "pending", label: "Pending" }
];

export function PurchaseOrderHeader({ form }: PurchaseOrderHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="orderNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Purchase Order Number</FormLabel>
            <FormControl>
              <Input placeholder="PO001" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="orderDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
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
        name="supplierEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supplier Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="supplier@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="supplierPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supplier Phone</FormLabel>
            <FormControl>
              <Input placeholder="Enter phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="supplierGST"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supplier GST</FormLabel>
            <FormControl>
              <Input placeholder="Enter GST number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expectedDelivery"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expected Delivery</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
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
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
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
        name="supplierAddress"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Supplier Address</FormLabel>
            <FormControl>
              <Input placeholder="Enter complete address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
