
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import useCompanyStore from '@/store/slices/companySlice';

interface DeliveryChallanPrintProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challan: any;
}

export function DeliveryChallanPrint({ 
  open, 
  onOpenChange, 
  challan
}: DeliveryChallanPrintProps) {
  
  const { details, address, logo } = useCompanyStore();
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Print Delivery Challan</DialogTitle>
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogHeader>
        
        <div className="print-content bg-white" id="challan-print">
          {/* Header with Company Logo and Name */}
          <div className="mb-6">
            {/* Top section with logo, company name, and contact details */}
            <div className="flex items-start justify-between mb-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                {logo.logoUrl && (
                  <img 
                    src={logo.logoUrl} 
                    alt="Company Logo" 
                    className="h-16 w-16 object-contain"
                  />
                )}
              </div>
              
              {/* Company Name - Centered */}
              <div className="flex-1 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  {details.companyName || 'Your Company Name'}
                </h1>
              </div>
              
              {/* Contact Details - Right aligned */}
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
            
            {/* Horizontal line */}
            <div className="border-t-2 border-gray-800 mb-4"></div>
            
            {/* DELIVERY CHALLAN title - centered */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">Delivery Challan</h2>
            </div>
          </div>
          
          {/* Challan Information Section */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Bill To</h3>
              <div className="space-y-2">
                <p className="font-semibold">{challan.clientName}</p>
                {challan.deliveryAddress && (
                  <p className="text-gray-700">{challan.deliveryAddress}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-lg mb-4">Challan Details</h3>
              <div className="space-y-1">
                <p><span className="font-semibold">Challan No.:</span> {challan.challanNo}</p>
                <p><span className="font-semibold">Date:</span> {new Date(challan.date).toLocaleDateString('en-IN')}</p>
                <p><span className="font-semibold">Vehicle No:</span> {challan.vehicleNo || 'N/A'}</p>
                <p><span className="font-semibold">Status:</span> {challan.status}</p>
              </div>
            </div>
          </div>
          
          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border-2 border-gray-400">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-400 p-3 text-left font-semibold">#</th>
                  <th className="border border-gray-400 p-3 text-left font-semibold">Item name</th>
                  <th className="border border-gray-400 p-3 text-center font-semibold">Quantity</th>
                  <th className="border border-gray-400 p-3 text-center font-semibold">Unit</th>
                  <th className="border border-gray-400 p-3 text-center font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {challan.items?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-gray-400 p-3 text-center">{index + 1}</td>
                    <td className="border border-gray-400 p-3">{item.name}</td>
                    <td className="border border-gray-400 p-3 text-center">{item.quantity}</td>
                    <td className="border border-gray-400 p-3 text-center">Pcs</td>
                    <td className="border border-gray-400 p-3 text-center">-</td>
                  </tr>
                ))}
                
                {/* Add empty rows for consistent height */}
                {Array.from({ length: Math.max(0, 4 - (challan.items?.length || 0)) }).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td className="border border-gray-400 p-3 text-center">&nbsp;</td>
                    <td className="border border-gray-400 p-3">&nbsp;</td>
                    <td className="border border-gray-400 p-3 text-center">&nbsp;</td>
                    <td className="border border-gray-400 p-3 text-center">&nbsp;</td>
                    <td className="border border-gray-400 p-3 text-center">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Two-column bottom section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Notes/Instructions */}
            <div>
              <h3 className="font-bold text-sm mb-2 bg-blue-600 text-white p-2">Terms and Conditions</h3>
              <div className="border border-gray-300 p-3 bg-gray-50">
                <div className="text-xs space-y-1">
                  <p>Goods once delivered will not be taken back.</p>
                  {challan.notes && <p>{challan.notes}</p>}
                </div>
              </div>
            </div>
            
            {/* Company Signature */}
            <div className="text-center">
              <h3 className="font-bold text-sm mb-2">For: {details.companyName || 'Your Company Name'}</h3>
              <div className="mt-16">
                <div className="border-t border-gray-600 pt-2 mx-4">
                  <p className="text-sm font-semibold">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Signature Section */}
          <div className="mt-16 pt-8">
            <div className="grid grid-cols-2 gap-16">
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-2">
                  <p className="font-semibold">Delivered By</p>
                  <p className="text-sm text-gray-600 mt-1">Name & Signature</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-2">
                  <p className="font-semibold">Received By</p>
                  <p className="text-sm text-gray-600 mt-1">Name & Signature</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-300">
            <p>This is a computer generated delivery challan and does not require physical signature.</p>
          </div>
        </div>
        
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
            
            #challan-print,
            #challan-print * {
              visibility: visible !important;
            }
            
            #challan-print {
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
            
            #challan-print h1 {
              font-size: 24px !important;
              margin-bottom: 8px !important;
              color: black !important;
            }
            
            #challan-print h2 {
              font-size: 18px !important;
              color: black !important;
            }
            
            #challan-print h3 {
              font-size: 14px !important;
              margin-bottom: 12px !important;
            }
            
            #challan-print table {
              width: 100% !important;
              border-collapse: collapse !important;
              font-size: 11px !important;
            }
            
            #challan-print th,
            #challan-print td {
              border: 1px solid #666 !important;
              padding: 8px !important;
            }
            
            #challan-print th {
              background-color: #2563eb !important;
              color: white !important;
              font-weight: bold !important;
            }
            
            #challan-print .bg-blue-600 {
              background-color: #2563eb !important;
              color: white !important;
            }
            
            #challan-print .bg-gray-50 {
              background-color: #f9fafb !important;
            }
            
            #challan-print .border-t-2 {
              border-top: 2px solid #374151 !important;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
