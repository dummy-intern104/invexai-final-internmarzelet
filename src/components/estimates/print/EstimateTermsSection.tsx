
import React from 'react';
import useCompanyStore from '@/store/slices/companySlice';

interface EstimateTermsSectionProps {
  estimate: any;
}

export function EstimateTermsSection({ estimate }: EstimateTermsSectionProps) {
  const calculateSubTotal = () => {
    return estimate.items?.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) || 0;
  };

  const subTotal = calculateSubTotal();
  const grandTotal = subTotal;

  // Convert number to words (simplified for Indian numbering)
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    
    return 'Amount too large';
  };

  const amountInWords = numberToWords(Math.floor(grandTotal)) + ' Rupees only';

  return (
    <>
      {/* Two-column summary section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Amount in Words */}
        <div>
          <h3 className="font-bold text-sm mb-2 bg-blue-600 text-white p-2">Invoice Amount In Words</h3>
          <div className="border border-gray-300 p-3 bg-gray-50">
            <p className="text-sm font-semibold">{amountInWords}</p>
          </div>
        </div>
        
        {/* Amounts Summary */}
        <div>
          <h3 className="font-bold text-sm mb-2 bg-blue-600 text-white p-2">Amounts</h3>
          <div className="border border-gray-300 p-3 bg-gray-50 space-y-2">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>₹ {subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹ {grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Received</span>
              <span>₹ 0.00</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Balance</span>
              <span>₹ {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Two-column terms and signature section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Terms & Conditions */}
        <div>
          <h3 className="font-bold text-sm mb-2 bg-blue-600 text-white p-2">Terms and Conditions</h3>
          <div className="border border-gray-300 p-3 bg-gray-50">
            <div className="text-xs space-y-1">
              <p>Thanks for doing business with us!</p>
              {estimate.terms && <p>{estimate.terms}</p>}
            </div>
          </div>
        </div>
        
        {/* Company Signature */}
        <div className="text-center">
          <h3 className="font-bold text-sm mb-2">For: {useCompanyStore.getState().details.companyName || 'Your Company Name'}</h3>
          <div className="mt-16">
            <div className="border-t border-gray-600 pt-2 mx-4">
              <p className="text-sm font-semibold">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bank Details if available */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 bg-blue-600 text-white p-2">Bank Details</h3>
        <div className="border border-gray-300 p-3 bg-gray-50">
          <div className="text-xs space-y-1">
            <p>Name: Please contact for bank details</p>
            <p>Account No.: Available on request</p>
            <p>IFSC code: Available on request</p>
            <p>Account holder's name: {useCompanyStore.getState().details.companyName || 'Your Company Name'}</p>
          </div>
        </div>
      </div>
      
      {/* Notes section if exists */}
      {estimate.notes && (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-2 bg-blue-600 text-white p-2">Additional Notes</h3>
          <div className="border border-gray-300 p-3 bg-gray-50">
            <p className="text-sm">{estimate.notes}</p>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-300">
        <p>This is a computer generated estimate and does not require physical signature.</p>
      </div>
    </>
  );
}
