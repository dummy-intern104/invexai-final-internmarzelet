import { Client } from '@/types';

export const validateClientPurchaseInputs = (
  clientName: string,
  amount: number,
  quantity: number,
  productName: string
): boolean => {
  if (!clientName || !clientName.trim()) {
    console.log("CLIENT UPDATE: Skipping - no client name provided");
    return false;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    console.log("CLIENT UPDATE: Skipping - invalid amount:", amount);
    return false;
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    console.log("CLIENT UPDATE: Skipping - invalid quantity:", quantity);
    return false;
  }

  return true;
};

export const generateTransactionId = (
  clientName: string,
  productName: string,
  quantity: number,
  amount: number
): string => {
  return `${clientName.trim()}-${productName}-${quantity}-${amount}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const ensureProcessedTransactionsSet = (
  processedTransactions: any
): Set<string> => {
  return processedTransactions instanceof Set 
    ? processedTransactions 
    : new Set<string>();
};

export const createNewClient = (clientData: any, existingClients: Client[]): Client => {
  return {
    id: existingClients.length > 0 ? Math.max(...existingClients.map(c => c.id)) + 1 : 1,
    name: clientData.name,
    email: clientData.email,
    phone: clientData.phone,
    totalPurchases: 0,
    totalSpent: 0,
    lastPurchase: new Date().toISOString(),
    joinDate: clientData.joinDate || new Date().toISOString(),
    openInvoices: clientData.openInvoices || 0,
    purchaseHistory: [],
    gstNumber: clientData.gstNumber,
    companyName: clientData.companyName,
    address: clientData.address,
    city: clientData.city,
    state: clientData.state,
    pincode: clientData.pincode,
  };
};

export const managedProcessedTransactions = (
  currentTransactions: Set<string>,
  newTransactionId: string
): Set<string> => {
  const newProcessedTransactions = new Set(currentTransactions);
  
  // Prevent memory buildup by keeping only recent transactions (last 1000)
  if (newProcessedTransactions.size > 1000) {
    console.log("CLIENT UPDATE: Clearing old processed transactions to prevent memory buildup");
    newProcessedTransactions.clear();
  }
  
  newProcessedTransactions.add(newTransactionId);
  return newProcessedTransactions;
};
