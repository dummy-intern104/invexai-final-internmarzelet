
import React from 'react';
import { Payment } from '@/types';
import { numberToWords } from '../utils/numberUtils';

interface PaymentReceiptAmountSummaryProps {
  payment: Payment;
}

export function PaymentReceiptAmountSummary({ payment }: PaymentReceiptAmountSummaryProps) {
  const amountInWords = numberToWords(Math.floor(payment.amount)) + ' Rupees only';

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div>
        <h3 className="font-bold text-sm mb-2 bg-blue-600 text-white p-2">Payment Amount In Words</h3>
        <div className="border border-gray-300 p-3 bg-gray-50">
          <p className="font-semibold">{amountInWords}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold text-sm mb-2 bg-blue-600 text-white p-2">Amounts</h3>
        <div className="border border-gray-300 p-3 bg-gray-50 space-y-2">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>₹ {payment.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹ {payment.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Received</span>
            <span>₹ {payment.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Balance</span>
            <span>₹ 0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
