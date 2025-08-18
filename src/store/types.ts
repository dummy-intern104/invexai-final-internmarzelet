
import { Product, Sale, Client, Payment, Meeting, ProductExpiry, Supplier } from '@/types';

export interface AppState extends ProductState, SaleState, ClientState, PaymentState, UserState, CompanyState, MeetingState, ExpiryState, SupportState {
  // Core data
  products: Product[];
  sales: Sale[];
  clients: Client[];
  payments: Payment[];
  meetings: Meeting[];
  productExpiries: ProductExpiry[];
  
  // App state
  isSignedIn: boolean;
  currentUser: any;
  
  // Methods
  saveDataToSupabase: () => Promise<void>;
  loadDataFromSupabase: () => Promise<void>;
  syncDataWithSupabase: () => Promise<void>;
  clearLocalData: () => Promise<void>;
  clearProcessedTransactions: () => void;
  
  // Store management
  setWithAutoSave: (fn: any) => void;
  setupRealtimeUpdates: (userId?: string) => void;
  
  // Meeting methods
  getMeetingsByClient: (clientId: number) => Meeting[];
  updateMeetingStatus: (meetingId: string, status: 'scheduled' | 'completed' | 'cancelled') => void;
  getTotalMeetings: () => number;
  
  // Expiry methods
  getExpiringProducts: (days: number) => ProductExpiry[];
  getExpiredProducts: () => ProductExpiry[];
  
  // Support methods
  addComplaint: (complaintData: any) => void;
  addFeedback: (feedbackData: any) => void;
  addTicket: (ticketData: any) => void;
  complaints: any[];
  feedback: any[];
  tickets: any[];
  
  // Company methods
  details: any;
  address: any;
  logo: any;
  defaults: any;
  documents: any;
  customFields: any[];
  updateDetails: (details: any) => void;
  updateAddress: (address: any) => void;
  updateLogo: (logo: any) => void;
  updateDefaults: (defaults: any) => void;
  updateDocuments: (documents: any) => void;
  addCustomField: (field: any) => void;
  updateCustomField: (id: string, field: any) => void;
  removeCustomField: (id: string) => void;
  
  // Client methods
  removeClient: (clientId: number) => void;
}

export interface ProductState {
  products: Product[];
  categories: string[];
  setProducts: (products: Product[]) => void;
  setCategories: (categories: string[]) => void;
  addProduct: (productData: any) => void;
  updateProduct: (productId: number, updatedData: any) => void;
  deleteProduct: (productId: number) => void;
  importProductsFromCSV: (file: File) => Promise<void>;
  transferProduct: (productId: number, quantity: number, destinationType: string) => void;
  restockProduct: (productId: number, quantity: number) => void;
}

export interface SaleState {
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  addSale: (saleData: any) => Sale | null;
  recordSale: (saleData: any) => Sale | null;
  deleteSale: (saleId: number) => void;
}

export interface ClientState {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (clientData: any) => void;
  updateClient: (clientId: number, updatedData: any) => void;
  deleteClient: (clientId: number) => void;
  removeClient: (clientId: number) => void;
  updateClientPurchase: (clientName: string, amount: number, productName: string, quantity: number, transactionId?: string) => void;
}

export interface PaymentState {
  payments: Payment[];
  pendingSalePayment: Sale | null;
  pendingEstimateForSale: any;
  setPayments: (payments: Payment[]) => void;
  setPendingSalePayment: (sale: Sale | null) => void;
  setPendingEstimateForSale: (estimate: any) => void;
  addPayment: (paymentData: any) => void;
  deletePayment: (paymentId: number) => void;
}

export interface UserState {
  isSignedIn: boolean;
  currentUser: any;
  setSignedIn: (isSignedIn: boolean) => void;
  setCurrentUser: (user: any) => void;
  signOut: () => Promise<void>;
}

export interface CompanyState {
  companyInfo: any;
  setCompanyInfo: (info: any) => void;
  // Company details
  details: any;
  address: any;
  logo: any;
  defaults: any;
  documents: any;
  customFields: any[];
  updateDetails: (details: any) => void;
  updateAddress: (address: any) => void;
  updateLogo: (logo: any) => void;
  updateDefaults: (defaults: any) => void;
  updateDocuments: (documents: any) => void;
  addCustomField: (field: any) => void;
  updateCustomField: (id: string, field: any) => void;
  removeCustomField: (id: string) => void;
}

export interface MeetingState {
  meetings: Meeting[];
  setMeetings: (meetings: Meeting[]) => void;
  addMeeting: (meetingData: any) => void;
  updateMeeting: (meetingId: number, updatedData: any) => void;
  deleteMeeting: (meetingId: string) => void;
}

export interface ExpiryState {
  productExpiries: ProductExpiry[];
  setProductExpiries: (expiries: ProductExpiry[]) => void;
  addProductExpiry: (expiryData: any) => void;
  updateProductExpiry: (expiryId: string, updatedData: any) => void;
  deleteProductExpiry: (expiryId: string) => void;
  loadProductExpiries: () => Promise<void>;
}

export interface SupportState {
  supportTickets: any[];
  setSupportTickets: (tickets: any[]) => void;
  addSupportTicket: (ticketData: any) => void;
  updateSupportTicket: (ticketId: string, updatedData: any) => void;
}

export interface PendingEstimateData {
  estimateId: string;
  shouldCompleteEstimate: boolean;
}

// Utility function for checking user data rows
export const isUserDataRow = (data: any): boolean => {
  return data && typeof data === 'object' && 'user_id' in data;
};
