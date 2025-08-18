
import React from 'react';
import useCompanyStore from '@/store/slices/companySlice';

export function PaymentReceiptFooter() {
  const { details } = useCompanyStore();

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div>
        <h3 className="font-bold text-sm mb-2 bg-blue-600 text-white p-2">Terms and Conditions</h3>
        <div className="border border-gray-300 p-3 bg-gray-50">
          <p className="text-sm">Thanks for doing business with us!</p>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="font-bold text-sm mb-2">For: {details.companyName || 'Your Company Name'}</h3>
        <div className="mt-16">
          <div className="border-t border-gray-600 pt-2 mx-4">
            <p className="text-sm font-semibold">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
