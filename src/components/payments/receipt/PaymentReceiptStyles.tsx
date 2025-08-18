
import React from 'react';

export function PaymentReceiptStyles() {
  return (
    <style>{`
      @media print {
        @page {
          margin: 15mm;
          size: A4;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        body {
          font-family: Arial, sans-serif !important;
          line-height: 1.4 !important;
          color: black !important;
          background: white !important;
        }
        
        body * {
          visibility: hidden !important;
        }
        
        #payment-receipt-print,
        #payment-receipt-print * {
          visibility: visible !important;
        }
        
        #payment-receipt-print {
          position: static !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          background: white !important;
          color: black !important;
          font-size: 12px !important;
          padding: 0 !important;
          margin: 0 !important;
          transform: none !important;
        }
        
        #payment-receipt-print h1 {
          font-size: 24px !important;
          margin-bottom: 8px !important;
          color: black !important;
        }
        
        #payment-receipt-print h2 {
          font-size: 18px !important;
          color: black !important;
        }
        
        #payment-receipt-print h3 {
          font-size: 14px !important;
          margin-bottom: 12px !important;
        }
        
        #payment-receipt-print table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 11px !important;
        }
        
        #payment-receipt-print th,
        #payment-receipt-print td {
          border: 1px solid #666 !important;
          padding: 8px !important;
        }
        
        #payment-receipt-print th {
          background-color: #2563eb !important;
          color: white !important;
          font-weight: bold !important;
        }
        
        #payment-receipt-print .bg-blue-600 {
          background-color: #2563eb !important;
          color: white !important;
        }
        
        #payment-receipt-print .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        
        #payment-receipt-print .border-t-2 {
          border-top: 2px solid #374151 !important;
        }
      }
    `}</style>
  );
}
