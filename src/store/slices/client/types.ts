
import { Client } from '@/types';

export interface ClientState {
  clients: Client[];
  processedTransactions: Set<string>; // Track processed transactions
  setClients: (clients: Client[]) => void;
  addClient: (clientData: any) => void;
  deleteClient: (clientId: number) => void;
  removeClient: (clientId: number) => void;
  updateClientPurchase: (clientName: string, amount: number, productName: string, quantity: number, transactionId?: string) => void;
  recalculateClientTotals: (clientId: number) => void;
  clearProcessedTransactions: () => void;
}

export interface ClientPurchaseUpdate {
  clientName: string;
  amount: number;
  productName: string;
  quantity: number;
  transactionId?: string;
}
