
import React from 'react';

interface EstimateItemsTableProps {
  estimate: any;
}

export function EstimateItemsTable({ estimate }: EstimateItemsTableProps) {
  const calculateSubTotal = () => {
    return estimate.items?.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) || 0;
  };

  const subTotal = calculateSubTotal();
  const taxAmount = subTotal * 0.18; // 18% GST
  const grandTotal = subTotal + taxAmount;

  return (
    <div className="mb-6">
      <table className="w-full border-collapse border border-gray-400 text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border border-gray-400 p-2 text-center font-semibold w-12">#</th>
            <th className="border border-gray-400 p-2 text-left font-semibold">Description of Goods</th>
            <th className="border border-gray-400 p-2 text-center font-semibold w-16">Qty</th>
            <th className="border border-gray-400 p-2 text-center font-semibold w-16">Unit</th>
            <th className="border border-gray-400 p-2 text-center font-semibold w-24">Rate</th>
            <th className="border border-gray-400 p-2 text-center font-semibold w-24">Amount</th>
          </tr>
        </thead>
        <tbody>
          {estimate.items?.map((item: any, index: number) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
              <td className="border border-gray-400 p-2">{item.name}</td>
              <td className="border border-gray-400 p-2 text-center">{item.quantity}</td>
              <td className="border border-gray-400 p-2 text-center">Pcs</td>
              <td className="border border-gray-400 p-2 text-right">₹{item.price?.toFixed(2)}</td>
              <td className="border border-gray-400 p-2 text-right">₹{(item.quantity * item.price)?.toFixed(2)}</td>
            </tr>
          ))}
          
          {/* Add empty rows to maintain consistent height */}
          {Array.from({ length: Math.max(0, 5 - (estimate.items?.length || 0)) }).map((_, index) => (
            <tr key={`empty-${index}`}>
              <td className="border border-gray-400 p-2 text-center">&nbsp;</td>
              <td className="border border-gray-400 p-2">&nbsp;</td>
              <td className="border border-gray-400 p-2 text-center">&nbsp;</td>
              <td className="border border-gray-400 p-2 text-center">&nbsp;</td>
              <td className="border border-gray-400 p-2 text-right">&nbsp;</td>
              <td className="border border-gray-400 p-2 text-right">&nbsp;</td>
            </tr>
          ))}
          
          {/* Summary rows */}
          <tr>
            <td colSpan={5} className="border border-gray-400 p-2 text-right font-semibold">Sub Total:</td>
            <td className="border border-gray-400 p-2 text-right font-semibold">₹{subTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={5} className="border border-gray-400 p-2 text-right">CGST (9%):</td>
            <td className="border border-gray-400 p-2 text-right">₹{(taxAmount / 2).toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={5} className="border border-gray-400 p-2 text-right">SGST (9%):</td>
            <td className="border border-gray-400 p-2 text-right">₹{(taxAmount / 2).toFixed(2)}</td>
          </tr>
          <tr className="bg-blue-100">
            <td colSpan={5} className="border border-gray-400 p-2 text-right font-bold text-lg">Grand Total:</td>
            <td className="border border-gray-400 p-2 text-right font-bold text-lg">₹{grandTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
