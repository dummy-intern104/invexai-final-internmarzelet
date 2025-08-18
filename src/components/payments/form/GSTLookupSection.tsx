
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useGSTLookup } from '@/components/shared/hooks/useGSTLookup';
import { GSTInputField } from '@/components/shared/gst/GSTInputField';
import { GSTStatusMessage } from '@/components/shared/gst/GSTStatusMessage';
import { GSTDetailsDisplay } from '@/components/shared/gst/GSTDetailsDisplay';

interface GSTLookupSectionProps {
  gstNumber: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGSTDetailsUpdate: (details: {
    companyName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) => void;
  error: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  disabled?: boolean;
}

const GSTLookupSection = ({ 
  gstNumber,
  companyName,
  address,
  city,
  state,
  pincode,
  onChange, 
  onGSTDetailsUpdate,
  error, 
  disabled = false
}: GSTLookupSectionProps) => {
  const { message, lastLookedUpGST, handleGSTLookup } = useGSTLookup(onGSTDetailsUpdate);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGSTLookup(gstNumber);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="w-5 h-5" />
          GST Lookup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <GSTInputField
          gstNumber={gstNumber}
          isLoading={false}
          disabled={disabled}
          onChange={onChange}
          onLookup={() => handleGSTLookup(gstNumber)}
          onKeyPress={handleKeyPress}
          error={error}
        />

        <GSTStatusMessage
          message={message}
          lastLookedUpGST={lastLookedUpGST}
        />

        <GSTDetailsDisplay
          companyName={companyName}
          address={address}
          city={city}
          state={state}
          pincode={pincode}
          onChange={onChange}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};

export default GSTLookupSection;
