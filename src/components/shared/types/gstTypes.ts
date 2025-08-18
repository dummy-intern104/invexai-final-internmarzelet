
export interface GSTDetails {
  companyName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface GSTLookupState {
  isLoading: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
  lastLookedUpGST: string;
}
