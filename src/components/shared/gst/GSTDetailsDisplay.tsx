
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GSTDetailsDisplayProps {
  companyName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const GSTDetailsDisplay: React.FC<GSTDetailsDisplayProps> = ({
  companyName,
  address,
  city,
  state,
  pincode,
  onChange,
  disabled = false
}) => {
  const hasAnyDetails = companyName || address || city || state || pincode;

  if (!hasAnyDetails) return null;

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
      <Label className="text-sm font-medium text-gray-700">Auto-populated Details</Label>
      
      {companyName && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Company Name</Label>
          <Input
            name="companyName"
            value={companyName}
            onChange={onChange}
            disabled={disabled}
            className="bg-white border-gray-200"
          />
        </div>
      )}
      
      {address && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Address</Label>
          <Input
            name="address"
            value={address}
            onChange={onChange}
            disabled={disabled}
            className="bg-white border-gray-200"
          />
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        {city && (
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">City</Label>
            <Input
              name="city"
              value={city}
              onChange={onChange}
              disabled={disabled}
              className="bg-white border-gray-200"
            />
          </div>
        )}
        
        {pincode && (
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Pincode</Label>
            <Input
              name="pincode"
              value={pincode}
              onChange={onChange}
              disabled={disabled}
              className="bg-white border-gray-200"
            />
          </div>
        )}
      </div>
      
      {state && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">State</Label>
          <Input
            name="state"
            value={state}
            onChange={onChange}
            disabled={disabled}
            className="bg-white border-gray-200"
          />
        </div>
      )}
    </div>
  );
};
