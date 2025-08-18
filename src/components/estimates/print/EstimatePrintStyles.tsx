
import React from 'react';

export function EstimatePrintStyles() {
  return (
    <style>{`
      @media print {
        @page {
          margin: 15mm !important;
          size: A4 !important;
        }
        
        html {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        body {
          font-family: Arial, sans-serif !important;
          line-height: 1.3 !important;
          color: black !important;
          background: white !important;
          margin: 0 !important;
          font-size: 11px !important;
        }
        
        /* Hide everything except the print content */
        body * {
          visibility: hidden !important;
        }
        
        #estimate-print,
        #estimate-print * {
          visibility: visible !important;
        }
        
        #estimate-print {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          background: white !important;
          color: black !important;
          padding: 0 !important;
          margin: 0 !important;
          transform: none !important;
        }
        
        /* Enhanced typography */
        #estimate-print h1 {
          font-size: 20px !important;
          margin-bottom: 4px !important;
          color: black !important;
          font-weight: bold !important;
        }
        
        #estimate-print h2 {
          font-size: 16px !important;
          color: #2563eb !important;
          font-weight: bold !important;
        }
        
        #estimate-print h3 {
          font-size: 11px !important;
          color: #2563eb !important;
          margin-bottom: 8px !important;
          font-weight: bold !important;
        }
        
        /* Table styling to match reference */
        #estimate-print table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 10px !important;
          margin-bottom: 16px !important;
        }
        
        #estimate-print th {
          background-color: #2563eb !important;
          color: white !important;
          font-weight: bold !important;
          padding: 6px !important;
          border: 1px solid #374151 !important;
          text-align: center !important;
        }
        
        #estimate-print td {
          border: 1px solid #374151 !important;
          padding: 4px 6px !important;
          text-align: left !important;
          vertical-align: top !important;
        }
        
        #estimate-print .text-center {
          text-align: center !important;
        }
        
        #estimate-print .text-right {
          text-align: right !important;
        }
        
        #estimate-print .text-left {
          text-align: left !important;
        }
        
        /* Row striping */
        #estimate-print tbody tr:hover {
          background-color: transparent !important;
        }
        
        #estimate-print .bg-blue-100 {
          background-color: #dbeafe !important;
        }
        
        #estimate-print .bg-blue-600 {
          background-color: #2563eb !important;
        }
        
        #estimate-print .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        
        /* Grid layouts */
        #estimate-print .grid {
          display: grid !important;
        }
        
        #estimate-print .grid-cols-2 {
          grid-template-columns: 1fr 1fr !important;
        }
        
        #estimate-print .grid-cols-3 {
          grid-template-columns: 1fr 1fr 1fr !important;
        }
        
        #estimate-print .gap-6 {
          gap: 16px !important;
        }
        
        #estimate-print .gap-8 {
          gap: 20px !important;
        }
        
        /* Spacing utilities */
        #estimate-print .mb-1 { margin-bottom: 2px !important; }
        #estimate-print .mb-2 { margin-bottom: 4px !important; }
        #estimate-print .mb-3 { margin-bottom: 6px !important; }
        #estimate-print .mb-4 { margin-bottom: 8px !important; }
        #estimate-print .mb-6 { margin-bottom: 12px !important; }
        #estimate-print .mb-8 { margin-bottom: 16px !important; }
        #estimate-print .mt-2 { margin-top: 4px !important; }
        #estimate-print .mt-8 { margin-top: 16px !important; }
        #estimate-print .pt-2 { padding-top: 4px !important; }
        #estimate-print .pt-4 { padding-top: 8px !important; }
        #estimate-print .pb-1 { padding-bottom: 2px !important; }
        #estimate-print .p-2 { padding: 4px !important; }
        #estimate-print .p-3 { padding: 6px !important; }
        
        /* Flexbox utilities */
        #estimate-print .flex {
          display: flex !important;
        }
        
        #estimate-print .flex-1 {
          flex: 1 !important;
        }
        
        #estimate-print .flex-shrink-0 {
          flex-shrink: 0 !important;
        }
        
        #estimate-print .items-start {
          align-items: flex-start !important;
        }
        
        #estimate-print .justify-between {
          justify-content: space-between !important;
        }
        
        #estimate-print .justify-end {
          justify-content: flex-end !important;
        }
        
        #estimate-print .flex-col {
          flex-direction: column !important;
        }
        
        /* Border utilities */
        #estimate-print .border {
          border: 1px solid #d1d5db !important;
        }
        
        #estimate-print .border-t {
          border-top: 1px solid #d1d5db !important;
        }
        
        #estimate-print .border-t-2 {
          border-top: 2px solid #374151 !important;
        }
        
        #estimate-print .border-b {
          border-bottom: 1px solid #d1d5db !important;
        }
        
        #estimate-print .border-gray-300 {
          border-color: #d1d5db !important;
        }
        
        #estimate-print .border-gray-400 {
          border-color: #9ca3af !important;
        }
        
        #estimate-print .border-gray-600 {
          border-color: #4b5563 !important;
        }
        
        /* Font utilities */
        #estimate-print .font-bold {
          font-weight: bold !important;
        }
        
        #estimate-print .font-semibold {
          font-weight: 600 !important;
        }
        
        /* Text size utilities */
        #estimate-print .text-xs {
          font-size: 9px !important;
        }
        
        #estimate-print .text-sm {
          font-size: 10px !important;
        }
        
        #estimate-print .text-lg {
          font-size: 13px !important;
        }
        
        #estimate-print .text-xl {
          font-size: 15px !important;
        }
        
        #estimate-print .text-2xl {
          font-size: 18px !important;
        }
        
        /* Color utilities */
        #estimate-print .text-blue-600 {
          color: #2563eb !important;
        }
        
        #estimate-print .text-gray-600 {
          color: #4b5563 !important;
        }
        
        #estimate-print .text-gray-500 {
          color: #6b7280 !important;
        }
        
        #estimate-print .text-gray-800 {
          color: #1f2937 !important;
        }
        
        #estimate-print .text-white {
          color: white !important;
        }
        
        /* Width utilities */
        #estimate-print .w-12 { width: 48px !important; }
        #estimate-print .w-16 { width: 64px !important; }
        #estimate-print .w-24 { width: 96px !important; }
        #estimate-print .min-w-[200px] { min-width: 200px !important; }
        
        /* Height utilities */
        #estimate-print .h-16 { height: 64px !important; }
        #estimate-print .min-h-[80px] { min-height: 80px !important; }
        
        /* Object utilities */
        #estimate-print .object-contain {
          object-fit: contain !important;
        }
        
        /* Spacing utilities */
        #estimate-print .space-y-1 > * + * {
          margin-top: 2px !important;
        }
        
        #estimate-print .mx-4 {
          margin-left: 8px !important;
          margin-right: 8px !important;
        }
        
        /* Capitalize */
        #estimate-print .capitalize {
          text-transform: capitalize !important;
        }
      }
    `}</style>
  );
}
