
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Payment } from '@/types';
import { PaymentReceiptHeader } from './receipt/PaymentReceiptHeader';
import { PaymentReceiptDetails } from './receipt/PaymentReceiptDetails';
import { PaymentReceiptTable } from './receipt/PaymentReceiptTable';
import { PaymentReceiptAmountSummary } from './receipt/PaymentReceiptAmountSummary';
import { PaymentReceiptFooter } from './receipt/PaymentReceiptFooter';
import { PaymentReceiptStyles } from './receipt/PaymentReceiptStyles';

interface PaymentReceiptPrintProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
}

export function PaymentReceiptPrint({ 
  open, 
  onOpenChange, 
  payment
}: PaymentReceiptPrintProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Print Payment Receipt</DialogTitle>
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogHeader>
        
        <div className="print-content bg-white" id="payment-receipt-print">
          <PaymentReceiptHeader payment={payment} />
          <PaymentReceiptDetails payment={payment} />
          <PaymentReceiptTable payment={payment} />
          <PaymentReceiptAmountSummary payment={payment} />
          <PaymentReceiptFooter />
        </div>
        
        <PaymentReceiptStyles />
      </DialogContent>
    </Dialog>
  );
}
