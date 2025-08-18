
import { create } from 'zustand';
import { Client } from '@/types';
import { toast } from 'sonner';
import { ClientState } from './types';
import { createNewClient } from './utils';
import { updateClientPurchaseOperation, recalculateClientTotalsOperation } from './operations';

export const createClientSlice = (set: any, get: any) => ({
  clients: [],
  processedTransactions: new Set<string>(),
  
  setClients: (clients: Client[]) => {
    console.log("CLIENT SET: Setting clients:", clients.length);
    set({ clients });
  },
  
  addClient: (clientData) => set((state: ClientState) => {
    const newClient = createNewClient(clientData, state.clients);
    
    console.log("CLIENT ADD: Adding new client:", newClient.name, "Total clients will be:", state.clients.length + 1);
    toast.success(`Client "${newClient.name}" added successfully`);
    
    const updatedClients = [...state.clients, newClient];
    console.log("CLIENT ADD: Updated clients array:", updatedClients.map(c => c.name));
    
    return { clients: updatedClients };
  }),
  
  deleteClient: (clientId) => set((state: ClientState) => {
    const clientToDelete = state.clients.find(c => c.id === clientId);
    console.log("CLIENT DELETE: Deleting client:", clientToDelete?.name || clientId);
    toast.success("Client deleted successfully");
    return { clients: state.clients.filter(client => client.id !== clientId) };
  }),
  
  removeClient: (clientId) => set((state: ClientState) => {
    const clientToRemove = state.clients.find(c => c.id === clientId);
    console.log("CLIENT REMOVE: Removing client:", clientToRemove?.name || clientId);
    toast.success("Client deleted successfully");
    return { clients: state.clients.filter(client => client.id !== clientId) };
  }),
  
  updateClientPurchase: (clientName, amount, productName, quantity, transactionId) => set((state: ClientState) => 
    updateClientPurchaseOperation(state, clientName, amount, productName, quantity, transactionId)
  ),
  
  recalculateClientTotals: (clientId) => set((state: ClientState) => 
    recalculateClientTotalsOperation(state, clientId)
  ),
  
  clearProcessedTransactions: () => {
    console.log("CLIENT CLEAR: Clearing all processed transactions");
    set({ processedTransactions: new Set() });
  }
});

export const useClientStore = create<ClientState>((set, get) => 
  createClientSlice(set, get)
);
