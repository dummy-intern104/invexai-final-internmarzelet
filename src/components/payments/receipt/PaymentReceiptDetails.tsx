
import React from 'react';
import { Payment } from '@/types';

interface PaymentReceiptDetailsProps {
  payment: Payment;
}

export function PaymentReceiptDetails({ payment }: PaymentReceiptDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-8 mb-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Bill To</h3>
        <p className="font-semibold">{payment.clientName}</p>
      </div>
      
      <div className="text-right">
        <h3 className="font-bold text-lg mb-2">Receipt Details</h3>
        <div className="space-y-1">
          <p><span className="font-semibold">Receipt No.:</span> {payment.id}</p>
          <p><span className="font-semibold">Date:</span> {new Date(payment.date).toLocaleDateString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}
