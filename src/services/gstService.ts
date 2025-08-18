import { GSTDetails, GSTLookupResult } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const validateGSTNumber = (gstNumber: string): boolean => {
  // Basic GST number validation (15 characters, specific pattern)
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gstNumber);
};

export const lookupGSTDetails = async (gstNumber: string): Promise<GSTLookupResult> => {
  try {
    if (!validateGSTNumber(gstNumber)) {
      return {
        success: false,
        error: 'Invalid GST number format. Please enter a valid 15-digit GST number.'
      };
    }

    console.log('Looking up GST details for:', gstNumber);

    const { data, error } = await supabase.functions.invoke('gst-lookup', {
      body: { gstNumber: formatGSTNumber(gstNumber) }
    });

    if (error) {
      console.error('GST lookup error:', error);
      return {
        success: false,
        error: 'Failed to fetch GST details. Please try again.'
      };
    }

    if (data.error) {
      return {
        success: false,
        error: data.error
      };
    }

    return {
      success: true,
      data: data as GSTDetails
    };

  } catch (error) {
    console.error('GST service error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.'
    };
  }
};

export const formatGSTNumber = (gstNumber: string): string => {
  // Remove spaces and convert to uppercase
  return gstNumber.replace(/\s/g, '').toUpperCase();
};

// Mock data for fallback (keeping existing mock data)
const mockGSTDatabase: Record<string, GSTDetails> = {
  '27AABCU9603R1ZX': {
    gstNumber: '27AABCU9603R1ZX',
    companyName: 'ABC Private Limited',
    address: '123 Business Park, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    registrationDate: '2023-01-15',
    businessType: 'Private Limited Company'
  },
  '29AABCU9603R1ZY': {
    gstNumber: '29AABCU9603R1ZY',
    companyName: 'XYZ Enterprises',
    address: '456 Tech Hub, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    registrationDate: '2022-08-20',
    businessType: 'Proprietorship'
  },
  '36AABCU9603R1ZZ': {
    gstNumber: '36AABCU9603R1ZZ',
    companyName: 'DEF Solutions Pvt Ltd',
    address: '789 IT Corridor, Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    registrationDate: '2023-03-10',
    businessType: 'Private Limited Company'
  }
};

export const lookupGSTDetailsMock = async (gstNumber: string): Promise<GSTLookupResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data = mockGSTDatabase[gstNumber];
  
  if (data) {
    return {
      success: true,
      data
    };
  }
  
  return {
    success: false,
    error: 'GST number not found in our database'
  };
};
