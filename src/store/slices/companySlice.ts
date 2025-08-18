
import { create } from 'zustand';
import { toast } from 'sonner';

interface CompanyDetails {
  companyName: string;
  registrationNumber: string;
  taxId: string;
  gstin: string; // Add GSTIN field
  email: string;
  phone: string;
  website: string;
}

interface CompanyAddress {
  street: string;
  aptSuite: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CompanyLogo {
  logoUrl: string;
  logoFile?: File;
  signatureUrl: string;
  signatureFile?: File;
}

interface CompanyDefaults {
  currency: string;
  taxRate: number;
  paymentTerms: string;
  invoicePrefix: string;
  estimatePrefix: string;
  defaultNote: string;
}

interface CompanyDocuments {
  invoiceTemplate: string;
  estimateTemplate: string;
  termsAndConditions: string;
  footerText: string;
}

interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown';
  options?: string[];
  required: boolean;
}

interface CompanyState {
  // Legacy field for backward compatibility
  companyName: string;
  
  // Comprehensive company data
  details: CompanyDetails;
  address: CompanyAddress;
  logo: CompanyLogo;
  defaults: CompanyDefaults;
  documents: CompanyDocuments;
  customFields: CustomField[];
  
  // Actions
  setCompanyName: (name: string) => void;
  updateDetails: (details: Partial<CompanyDetails>) => void;
  updateAddress: (address: Partial<CompanyAddress>) => void;
  updateLogo: (logo: Partial<CompanyLogo>) => void;
  updateDefaults: (defaults: Partial<CompanyDefaults>) => void;
  updateDocuments: (documents: Partial<CompanyDocuments>) => void;
  addCustomField: (field: Omit<CustomField, 'id'>) => void;
  updateCustomField: (id: string, field: Partial<CustomField>) => void;
  removeCustomField: (id: string) => void;
}

const defaultDetails: CompanyDetails = {
  companyName: localStorage.getItem('companyName') || '',
  registrationNumber: '',
  taxId: '',
  gstin: '', // Add GSTIN to default details
  email: '',
  phone: '',
  website: '',
};

const defaultAddress: CompanyAddress = {
  street: '',
  aptSuite: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
};

const defaultLogo: CompanyLogo = {
  logoUrl: '',
  signatureUrl: '',
};

const defaultDefaults: CompanyDefaults = {
  currency: 'USD',
  taxRate: 0,
  paymentTerms: 'Net 30',
  invoicePrefix: 'INV',
  estimatePrefix: 'EST',
  defaultNote: '',
};

const defaultDocuments: CompanyDocuments = {
  invoiceTemplate: 'standard',
  estimateTemplate: 'standard',
  termsAndConditions: '',
  footerText: '',
};

export const createCompanySlice = (set: any, get: any) => ({
  // Legacy field
  companyName: localStorage.getItem('companyName') || '',
  
  // Comprehensive company data
  details: defaultDetails,
  address: defaultAddress,
  logo: defaultLogo,
  defaults: defaultDefaults,
  documents: defaultDocuments,
  customFields: [],
  
  setCompanyName: (name: string) => {
    localStorage.setItem('companyName', name);
    set((state: CompanyState) => ({
      companyName: name,
      details: { ...state.details, companyName: name }
    }));
    toast.success("Company name saved successfully");
  },
  
  updateDetails: (newDetails: Partial<CompanyDetails>) => {
    set((state: CompanyState) => {
      const updatedDetails = { ...state.details, ...newDetails };
      // Update legacy companyName if it was changed
      if (newDetails.companyName) {
        localStorage.setItem('companyName', newDetails.companyName);
      }
      return {
        details: updatedDetails,
        companyName: updatedDetails.companyName,
      };
    });
    toast.success("Company details updated successfully");
  },
  
  updateAddress: (newAddress: Partial<CompanyAddress>) => {
    set((state: CompanyState) => ({
      address: { ...state.address, ...newAddress }
    }));
    toast.success("Company address updated successfully");
  },
  
  updateLogo: (newLogo: Partial<CompanyLogo>) => {
    set((state: CompanyState) => ({
      logo: { ...state.logo, ...newLogo }
    }));
    toast.success("Company logo updated successfully");
  },
  
  updateDefaults: (newDefaults: Partial<CompanyDefaults>) => {
    set((state: CompanyState) => ({
      defaults: { ...state.defaults, ...newDefaults }
    }));
    toast.success("Default settings updated successfully");
  },
  
  updateDocuments: (newDocuments: Partial<CompanyDocuments>) => {
    set((state: CompanyState) => ({
      documents: { ...state.documents, ...newDocuments }
    }));
    toast.success("Document settings updated successfully");
  },
  
  addCustomField: (field: Omit<CustomField, 'id'>) => {
    const newField: CustomField = {
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state: CompanyState) => ({
      customFields: [...state.customFields, newField]
    }));
    toast.success("Custom field added successfully");
  },
  
  updateCustomField: (id: string, updatedField: Partial<CustomField>) => {
    set((state: CompanyState) => ({
      customFields: state.customFields.map(field =>
        field.id === id ? { ...field, ...updatedField } : field
      )
    }));
    toast.success("Custom field updated successfully");
  },
  
  removeCustomField: (id: string) => {
    set((state: CompanyState) => ({
      customFields: state.customFields.filter(field => field.id !== id)
    }));
    toast.success("Custom field removed successfully");
  },
});

export const useCompanyStore = create<CompanyState>((set, get) => 
  createCompanySlice(set, get)
);

export default useCompanyStore;
