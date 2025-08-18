
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
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvoiceFormHeader } from "./form/InvoiceFormHeader";
import { EstimateItemsSection } from "@/components/estimates/form/EstimateItemsSection";
import { InvoiceNotesSection } from "./form/InvoiceNotesSection";
import { InvoicePaymentSection } from "./components/InvoicePaymentSection";
import { InvoiceTotalsSection } from "./components/InvoiceTotalsSection";
import { InvoiceForm, InvoiceItem } from "./types/invoiceTypes";
import { useInvoiceCalculations } from "./hooks/useInvoiceCalculations";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreated?: (invoiceData: any) => void;
  prefilledClientName?: string;
  editingInvoice?: any;
}

export function InvoiceDialog({
  open,
  onOpenChange,
  onInvoiceCreated,
  prefilledClientName,
  editingInvoice
}: InvoiceDialogProps) {
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, name: "", quantity: 1, price: 0, gstRate: 18, total: 0 },
  ]);
  
  const form = useForm<InvoiceForm>({
    defaultValues: {
      clientName: prefilledClientName || "",
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      items: [],
      notes: "",
      terms: "Payment due within 30 days of issue.",
      discount: 0,
      gstRate: 18,
      paymentMode: "Cash",
    },
  });

  const { subtotal, gstAmount, totalAmount } = useInvoiceCalculations(
    items, 
    form.watch("discount") || 0
  );

  const onSubmit = (data: InvoiceForm) => {
    if (items.some(item => !item.name || item.quantity <= 0)) {
      toast.error("Please fill in all item details with valid quantities");
      return;
    }
    
    const invoiceData = {
      ...data,
      items: items,
      subtotal,
      gstAmount,
      totalAmount,
      invoiceNo: editingInvoice?.invoiceNo || `INV-${Date.now().toString().slice(-6)}`,
      status: editingInvoice?.status || "pending",
      createdAt: editingInvoice?.createdAt || new Date().toISOString(),
    };
    
    console.log(editingInvoice ? "Updating invoice:" : "Creating invoice:", invoiceData);
    toast.success(editingInvoice ? "Invoice updated successfully" : "Invoice created successfully");
    
    if (onInvoiceCreated) {
      onInvoiceCreated(invoiceData);
    }
    
    onOpenChange(false);
    form.reset();
    setItems([{ id: 1, name: "", quantity: 1, price: 0, gstRate: 18, total: 0 }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <InvoiceFormHeader control={form.control} />
              
              <InvoicePaymentSection control={form.control} />
              
              <EstimateItemsSection 
                items={items}
                setItems={setItems}
              />

              <InvoiceTotalsSection
                items={items}
                discount={form.watch("discount") || 0}
                paymentMode={form.watch("paymentMode")}
              />
              
              <InvoiceNotesSection control={form.control} />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingInvoice ? "Update Invoice" : "Create Invoice"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
