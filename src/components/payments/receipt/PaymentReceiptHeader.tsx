
import React from 'react';
import { Payment } from '@/types';
import useCompanyStore from '@/store/slices/companySlice';

interface PaymentReceiptHeaderProps {
  payment: Payment;
}

export function PaymentReceiptHeader({ payment }: PaymentReceiptHeaderProps) {
  const { details, address, logo } = useCompanyStore();

  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-shrink-0">
          {logo.logoUrl && (
            <img 
              src={logo.logoUrl} 
              alt="Company Logo" 
              className="h-16 w-16 object-contain"
            />
          )}
        </div>
        
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {details.companyName || 'Your Company Name'}
          </h1>
        </div>
        
        <div className="text-right text-xs text-gray-600 space-y-1 flex-shrink-0 min-w-[300px]">
          {address.street && <p>{address.street}</p>}
          {address.city && (
            <p>
              {address.city}
              {address.state && `, ${address.state}`}
            </p>
          )}
          {details.phone && <p>Phone no.: {details.phone}</p>}
          {details.email && <p>Email: {details.email}</p>}
          {details.taxId && <p>GSTIN: {details.taxId}</p>}
        </div>
      </div>
      
      <div className="border-t-2 border-gray-800 mb-4"></div>
      
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">Payment Receipt</h2>
      </div>
    </>
  );
}
