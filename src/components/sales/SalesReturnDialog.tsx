
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sale, Product, Client } from "@/types";

interface SalesReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sales: Sale[];
  products: Product[];
  clients: Client[];
  onReturnCreated?: (returnData: any) => void;
}

interface ReturnForm {
  saleId: number;
  returnQuantity: number;
  returnReason: string;
  refundType: string;
  notes: string;
}

const returnReasons = [
  "Defective Product",
  "Wrong Item Shipped",
  "Customer Changed Mind",
  "Damaged During Shipping",
  "Expired Product",
  "Quality Issues",
  "Other"
];

export function SalesReturnDialog({
  open,
  onOpenChange,
  sales,
  products,
  clients,
  onReturnCreated
}: SalesReturnDialogProps) {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  
  const form = useForm<ReturnForm>({
    defaultValues: {
      saleId: 0,
      returnQuantity: 1,
      returnReason: "",
      refundType: "refund",
      notes: "",
    },
  });

  const handleSaleSelection = (saleId: string) => {
    const sale = sales.find(s => s.sale_id === parseInt(saleId));
    setSelectedSale(sale || null);
    form.setValue('saleId', parseInt(saleId));
  };

  const onSubmit = (data: ReturnForm) => {
    if (!selectedSale) {
      toast.error("Please select a sale for return");
      return;
    }

    if (data.returnQuantity > selectedSale.quantity_sold) {
      toast.error(`Return quantity cannot exceed sold quantity (${selectedSale.quantity_sold})`);
      return;
    }

    const returnAmount = (selectedSale.selling_price * data.returnQuantity);
    
    const returnData = {
      id: Date.now().toString(),
      originalSaleId: selectedSale.sale_id,
      productId: selectedSale.product_id,
      productName: selectedSale.product?.product_name || "Unknown Product",
      clientName: selectedSale.clientName || "Unknown Client",
      returnQuantity: data.returnQuantity,
      returnAmount,
      returnReason: data.returnReason,
      refundType: data.refundType,
      notes: data.notes,
      returnDate: new Date().toISOString(),
      status: "pending" as const,
    };

    console.log("Creating sales return:", returnData);
    toast.success("Sales return created successfully");
    
    if (onReturnCreated) {
      onReturnCreated(returnData);
    }
    
    onOpenChange(false);
    form.reset();
    setSelectedSale(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Sales Return</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="saleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Sale</FormLabel>
                  <Select onValueChange={handleSaleSelection}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sale to return" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sales.map((sale) => (
                        <SelectItem key={sale.sale_id} value={sale.sale_id.toString()}>
                          {sale.product?.product_name} - {sale.clientName || "No Client"} - ₹{sale.selling_price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedSale && (
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Selected Sale Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Product:</span>
                      <p>{selectedSale.product?.product_name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Client:</span>
                      <p>{selectedSale.clientName || "No client"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Quantity Sold:</span>
                      <p>{selectedSale.quantity_sold}</p>
                    </div>
                    <div>
                      <span className="font-medium">Unit Price:</span>
                      <p>₹{selectedSale.selling_price.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
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
                      max={selectedSale?.quantity_sold || 1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum returnable quantity: {selectedSale?.quantity_sold || 0}
                  </FormDescription>
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
              name="refundType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refund Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="refund">Cash Refund</SelectItem>
                      <SelectItem value="credit">Store Credit</SelectItem>
                      <SelectItem value="exchange">Exchange</SelectItem>
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

            {selectedSale && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Return Amount:</span>
                  <span className="text-lg font-bold">
                    ₹{(selectedSale.selling_price * form.watch("returnQuantity")).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedSale}>
                Process Return
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
