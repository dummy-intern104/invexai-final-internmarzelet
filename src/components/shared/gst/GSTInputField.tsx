
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

interface GSTInputFieldProps {
  gstNumber: string;
  isLoading: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLookup: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  error?: boolean;
}

export const GSTInputField: React.FC<GSTInputFieldProps> = ({
  gstNumber,
  isLoading,
  disabled = false,
  onChange,
  onLookup,
  onKeyPress,
  error = false
}) => {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Label htmlFor="gst-number">GST Number</Label>
        <Input
          id="gst-number"
          name="gstNumber"
          value={gstNumber}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Enter 15-digit GST number (e.g., 27AABCU9603R1ZX)"
          maxLength={15}
          disabled={disabled || isLoading}
          className={`mt-1 ${error ? 'border-red-500' : ''}`}
        />
      </div>
      <div className="flex items-end">
        <Button
          onClick={onLookup}
          disabled={disabled || isLoading || !gstNumber.trim()}
          className="mb-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Looking up...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Lookup
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
