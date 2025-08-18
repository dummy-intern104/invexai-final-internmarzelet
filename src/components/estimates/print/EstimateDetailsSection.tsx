
import React from 'react';

interface EstimateDetailsSectionProps {
  estimate: any;
}

export function EstimateDetailsSection({ estimate }: EstimateDetailsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-8 mb-6">
      {/* Bill To Section */}
      <div>
        <h3 className="font-bold text-sm mb-3 text-blue-600 border-b border-gray-300 pb-1">Bill To:</h3>
        <div className="space-y-1 text-sm">
          <p className="font-semibold">{estimate.clientName}</p>
          <p className="text-gray-600">Client Address Line 1</p>
          <p className="text-gray-600">City, State - Pincode</p>
          <p className="text-gray-600">Mobile: +91 XXXXXXXXXX</p>
        </div>
      </div>
      
      {/* Estimate Details Section */}
      <div>
        <h3 className="font-bold text-sm mb-3 text-blue-600 border-b border-gray-300 pb-1">Estimate Details:</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Estimate No:</span>
            <span className="font-semibold">{estimate.referenceNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estimate Date:</span>
            <span>{new Date(estimate.date).toLocaleDateString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Valid Until:</span>
            <span>{new Date(estimate.validUntil).toLocaleDateString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="capitalize font-semibold">{estimate.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
