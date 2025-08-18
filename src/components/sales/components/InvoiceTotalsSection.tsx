
import React from 'react';
import { InvoiceItem } from '../types/invoiceTypes';
import { useInvoiceCalculations } from '../hooks/useInvoiceCalculations';

interface InvoiceTotalsSectionProps {
  items: InvoiceItem[];
  discount: number;
  paymentMode: string;
}

export const InvoiceTotalsSection: React.FC<InvoiceTotalsSectionProps> = ({
  items,
  discount,
  paymentMode
}) => {
  const { subtotal, gstAmount, totalAmount } = useInvoiceCalculations(items, discount);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST:</span>
          <span>₹{gstAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span>₹{discount?.toFixed(2) || "0.00"}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Payment Mode:</span>
          <span>{paymentMode}</span>
        </div>
      </div>
    </div>
  );
};
