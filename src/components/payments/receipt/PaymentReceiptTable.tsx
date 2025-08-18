
import React from 'react';
import { Payment } from '@/types';

interface PaymentReceiptTableProps {
  payment: Payment;
}

export function PaymentReceiptTable({ payment }: PaymentReceiptTableProps) {
  return (
    <table className="w-full border-collapse border-2 border-gray-400 mb-6">
      <thead>
        <tr className="bg-blue-600 text-white">
          <th className="border border-gray-400 p-3 text-left font-semibold">#</th>
          <th className="border border-gray-400 p-3 text-left font-semibold">Description</th>
          <th className="border border-gray-400 p-3 text-center font-semibold">Method</th>
          <th className="border border-gray-400 p-3 text-center font-semibold">Status</th>
          <th className="border border-gray-400 p-3 text-right font-semibold">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-400 p-3 text-center">1</td>
          <td className="border border-gray-400 p-3">{payment.description || 'Payment received'}</td>
          <td className="border border-gray-400 p-3 text-center">{payment.method}</td>
          <td className="border border-gray-400 p-3 text-center capitalize">{payment.status}</td>
          <td className="border border-gray-400 p-3 text-right">₹ {payment.amount.toFixed(2)}</td>
        </tr>
        <tr>
          <td colSpan={4} className="border border-gray-400 p-3 text-right font-semibold">Total</td>
          <td className="border border-gray-400 p-3 text-right font-semibold">₹ {payment.amount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );
}
