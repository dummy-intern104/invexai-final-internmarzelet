
import { useState } from 'react';
import { lookupGSTDetails } from '@/services/gstService';
import { GSTDetails, GSTLookupState } from '../types/gstTypes';

export const useGSTLookup = (onGSTDetailsUpdate: (details: GSTDetails) => void) => {
  const [state, setState] = useState<GSTLookupState>({
    isLoading: false,
    message: null,
    lastLookedUpGST: ''
  });

  const handleGSTLookup = async (gstNumber: string) => {
    if (!gstNumber.trim()) {
      setState(prev => ({
        ...prev,
        message: { type: 'error', text: 'Please enter a GST number' }
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, message: null }));

    try {
      const result = await lookupGSTDetails(gstNumber);
      
      if (result.success && result.data) {
        onGSTDetailsUpdate({
          companyName: result.data.companyName,
          address: result.data.address,
          city: result.data.city,
          state: result.data.state,
          pincode: result.data.pincode
        });
        
        setState(prev => ({
          ...prev,
          lastLookedUpGST: gstNumber,
          message: { 
            type: 'success', 
            text: `Successfully retrieved details for ${result.data.companyName}` 
          }
        }));
      } else {
        setState(prev => ({
          ...prev,
          message: { 
            type: 'error', 
            text: result.error || 'Failed to fetch GST details' 
          }
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        message: { 
          type: 'error', 
          text: 'An unexpected error occurred. Please try again.' 
        }
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    handleGSTLookup
  };
};
