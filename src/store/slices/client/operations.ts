
import { Client, ProductPurchase } from '@/types';
import { ClientState } from './types';
import { validateClientPurchaseInputs, generateTransactionId, ensureProcessedTransactionsSet, managedProcessedTransactions } from './utils';

export const updateClientPurchaseOperation = (
  state: ClientState,
  clientName: string,
  amount: number,
  productName: string,
  quantity: number,
  transactionId?: string
) => {
  // Validate inputs first
  if (!validateClientPurchaseInputs(clientName, amount, quantity, productName)) {
    return { clients: state.clients };
  }
  
  // Generate transaction ID if not provided
  const txId = transactionId || generateTransactionId(clientName, productName, quantity, amount);
  
  console.log("CLIENT UPDATE: Processing transaction:", { 
    txId, 
    clientName: clientName.trim(), 
    amount, 
    productName, 
    quantity,
    processedTransactionsType: typeof state.processedTransactions,
    isSet: state.processedTransactions instanceof Set
  });
  
  // Ensure processedTransactions is always a Set
  const currentProcessedTransactions = ensureProcessedTransactionsSet(state.processedTransactions);
  
  // Check if this transaction has already been processed
  if (currentProcessedTransactions.has(txId)) {
    console.log("CLIENT UPDATE: DUPLICATE DETECTED - transaction already processed:", txId);
    return { clients: state.clients };
  }
  
  // Check if the client exists
  const clientExists = state.clients.some(client => client.name.trim() === clientName.trim());
  
  if (!clientExists) {
    console.log("CLIENT UPDATE: Skipping - client does not exist:", clientName.trim());
    console.log("CLIENT UPDATE: Available clients:", state.clients.map(c => c.name));
    return { clients: state.clients };
  }
  
  console.log("CLIENT UPDATE: Processing purchase update:", { 
    clientName: clientName.trim(), 
    amount, 
    productName, 
    quantity, 
    txId 
  });
  
  // Update the client with enhanced validation
  const updatedClients = state.clients.map(client => {
    if (client.name.trim() === clientName.trim()) {
      const newPurchase: ProductPurchase = {
        productName: productName || "Unknown Product",
        quantity: Number(quantity),
        amount: Number(amount),
        purchaseDate: new Date().toISOString(),
        transactionId: txId,
      };
      
      // Validate existing totals before updating
      const currentTotalPurchases = Number(client.totalPurchases) || 0;
      const currentTotalSpent = Number(client.totalSpent) || 0;
      
      const updatedClient = {
        ...client,
        totalPurchases: currentTotalPurchases + Number(quantity),
        totalSpent: currentTotalSpent + Number(amount),
        lastPurchase: new Date().toISOString(),
        purchaseHistory: [newPurchase, ...(client.purchaseHistory || [])],
      };
      
      console.log("CLIENT UPDATE: Updated client data:", {
        name: updatedClient.name,
        oldTotalPurchases: currentTotalPurchases,
        newTotalPurchases: updatedClient.totalPurchases,
        oldTotalSpent: currentTotalSpent,
        newTotalSpent: updatedClient.totalSpent,
        newPurchase
      });
      
      return updatedClient;
    }
    return client;
  });
  
  // Mark transaction as processed with size limit
  const newProcessedTransactions = managedProcessedTransactions(currentProcessedTransactions, txId);
  
  console.log("CLIENT UPDATE: Transaction marked as processed. Total processed:", newProcessedTransactions.size);
  
  return { 
    clients: updatedClients,
    processedTransactions: newProcessedTransactions
  };
};

export const recalculateClientTotalsOperation = (
  state: ClientState,
  clientId: number
) => {
  console.log("CLIENT RECALCULATE: Recalculating totals for client:", clientId);
  
  const updatedClients = state.clients.map(client => {
    if (client.id === clientId) {
      // Validate purchase history before calculation
      const validPurchases = (client.purchaseHistory || []).filter(purchase => 
        purchase && 
        typeof purchase.quantity === 'number' && 
        typeof purchase.amount === 'number' &&
        purchase.quantity > 0 &&
        purchase.amount >= 0
      );
      
      const totalPurchases = validPurchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
      const totalSpent = validPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
      
      console.log("CLIENT RECALCULATE: New totals:", { 
        clientId,
        validPurchasesCount: validPurchases.length,
        totalPurchases, 
        totalSpent 
      });
      
      return {
        ...client,
        totalPurchases,
        totalSpent
      };
    }
    return client;
  });
  
  return { clients: updatedClients };
};
