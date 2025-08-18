import { AppState } from '../types';
import { Sale, Product, ProductExpiry, Payment, Client, Meeting } from '@/types';
import { toast } from 'sonner';
import { withImmediateSave, createDefaultAutoSave } from '../config/enhancedAutoSave';

export const createEnhancedStoreMethods = (set: any, get: any, setWithAutoSave: any, slices: any, setupRealtimeUpdates: any) => {
  const immediateAutoSave = createDefaultAutoSave(set, get);

  return {
    // Enhanced product methods with immediate save - return original results
    addProduct: async (productData: Omit<Product, 'product_id' | 'created_at'>) => {
      console.log("ENHANCED STORE: Adding product with immediate save:", productData);
      const result = slices.productSlice.addProduct(productData);
      
      // Handle expiry record creation if needed
      if (productData.expiry_date) {
        const state = get();
        const newProduct = state.products[state.products.length - 1];
        
        if (newProduct) {
          const expiryData = {
            user_id: state.currentUser?.id || "",
            product_id: newProduct.product_id,
            product_name: newProduct.product_name,
            expiry_date: productData.expiry_date,
            quantity: parseInt(productData.units) || 1,
            status: 'active' as const,
            notes: `Auto-created from product: ${newProduct.product_name}`,
          };
          
          slices.expirySlice.addProductExpiry(expiryData);
        }
      }
      
      try {
        await immediateAutoSave('add product');
      } catch (error) {
        console.error("Failed to auto-save after adding product:", error);
        toast.error("Failed to save product. Please try again.");
      }
      
      return result;
    },

    updateProduct: async (updatedProduct: Product) => {
      console.log("ENHANCED STORE: Updating product with immediate save:", updatedProduct.product_id);
      const result = slices.productSlice.updateProduct(updatedProduct);
      
      try {
        await immediateAutoSave('update product');
      } catch (error) {
        console.error("Failed to auto-save after updating product:", error);
        toast.error("Failed to save product update. Please try again.");
      }
      
      return result;
    },

    deleteProduct: async (productId: number) => {
      console.log("ENHANCED STORE: Deleting product with immediate save:", productId);
      const result = slices.productSlice.deleteProduct(productId);
      
      try {
        await immediateAutoSave('delete product');
      } catch (error) {
        console.error("Failed to auto-save after deleting product:", error);
        toast.error("Failed to save product deletion. Please try again.");
      }
      
      return result;
    },

    // Enhanced client methods with immediate save - return original results
    addClient: async (clientData: Omit<Client, "id" | "totalPurchases" | "totalSpent" | "lastPurchase">) => {
      console.log("ENHANCED STORE: Adding client with immediate save:", clientData.name);
      const result = slices.clientSlice.addClient(clientData);
      
      try {
        await immediateAutoSave('add client');
      } catch (error) {
        console.error("Failed to auto-save after adding client:", error);
        toast.error("Failed to save client. Please try again.");
      }
      
      return result;
    },

    deleteClient: async (clientId: string) => {
      console.log("ENHANCED STORE: Deleting client with immediate save:", clientId);
      const result = slices.clientSlice.deleteClient(clientId);
      
      try {
        await immediateAutoSave('delete client');
      } catch (error) {
        console.error("Failed to auto-save after deleting client:", error);
        toast.error("Failed to save client deletion. Please try again.");
      }
      
      return result;
    },

    // Enhanced sale methods with immediate save - return original results
    recordSale: async (saleData: Omit<Sale, 'sale_id' | 'sale_date'>) => {
      console.log("ENHANCED STORE: Recording sale with immediate save:", saleData);
      
      const state = get();
      const newSale: Sale = {
        sale_id: state.sales.length > 0 ? Math.max(...state.sales.map(s => s.sale_id)) + 1 : 1,
        ...saleData,
        sale_date: new Date().toISOString(),
      };
      
      // Update sales
      set((currentState: AppState) => ({
        sales: [...currentState.sales, newSale]
      }));
      
      // Update product stock
      set((currentState: AppState) => ({
        products: currentState.products.map(product => 
          product.product_id === saleData.product_id
            ? { 
                ...product, 
                units: Math.max(0, parseInt(product.units) - saleData.quantity_sold).toString()
              }
            : product
        )
      }));
      
      // Update client data if needed
      if (saleData.clientName && !saleData.transactionId) {
        const transactionId = `sale_${newSale.sale_id}_${Date.now()}`;
        newSale.transactionId = transactionId;
        
        const soldProduct = state.products.find(p => p.product_id === saleData.product_id);
        if (soldProduct) {
          slices.clientSlice.updateClientPurchase(
            saleData.clientName,
            saleData.selling_price * saleData.quantity_sold,
            soldProduct.product_name,
            saleData.quantity_sold,
            transactionId
          );
        }
      }
      
      try {
        await immediateAutoSave('record sale');
      } catch (error) {
        console.error("Failed to auto-save after recording sale:", error);
        toast.error("Failed to save sale. Please try again.");
      }
      
      return newSale;
    },

    // Add the missing addSale method - return original result
    addSale: async (saleData: Omit<Sale, 'sale_id' | 'sale_date'>) => {
      console.log("ENHANCED STORE: Adding sale with immediate save:", saleData);
      const result = slices.saleSlice.addSale(saleData);
      
      try {
        await immediateAutoSave('add sale');
      } catch (error) {
        console.error("Failed to auto-save after adding sale:", error);
        toast.error("Failed to save sale. Please try again.");
      }
      
      return result;
    },

    // Enhanced payment methods with immediate save - return original results
    addPayment: async (paymentData: Omit<Payment, 'payment_id' | 'payment_date'>) => {
      console.log("ENHANCED STORE: Adding payment with immediate save:", paymentData);
      const result = slices.paymentSlice.addPayment(paymentData);
      
      try {
        await immediateAutoSave('add payment');
      } catch (error) {
        console.error("Failed to auto-save after adding payment:", error);
        toast.error("Failed to save payment. Please try again.");
      }
      
      return result;
    },

    deletePayment: async (paymentId: number) => {
      console.log("ENHANCED STORE: Deleting payment with immediate save:", paymentId);
      const result = slices.paymentSlice.deletePayment(paymentId);
      
      try {
        await immediateAutoSave('delete payment');
      } catch (error) {
        console.error("Failed to auto-save after deleting payment:", error);
        toast.error("Failed to save payment deletion. Please try again.");
      }
      
      return result;
    },

    // Enhanced expiry methods with immediate save - return original results
    addProductExpiry: async (expiryData: any) => {
      console.log("ENHANCED STORE: Adding product expiry with immediate save:", expiryData);
      const result = slices.expirySlice.addProductExpiry(expiryData);
      
      try {
        await immediateAutoSave('add product expiry');
      } catch (error) {
        console.error("Failed to auto-save after adding product expiry:", error);
        toast.error("Failed to save product expiry. Please try again.");
      }
      
      return result;
    },

    updateProductExpiry: async (id: string, updates: any) => {
      console.log("ENHANCED STORE: Updating product expiry with immediate save:", id);
      const result = slices.expirySlice.updateProductExpiry(id, updates);
      
      try {
        await immediateAutoSave('update product expiry');
      } catch (error) {
        console.error("Failed to auto-save after updating product expiry:", error);
        toast.error("Failed to save product expiry update. Please try again.");
      }
      
      return result;
    },

    deleteProductExpiry: async (id: string) => {
      console.log("ENHANCED STORE: Deleting product expiry with immediate save:", id);
      const result = slices.expirySlice.deleteProductExpiry(id);
      
      try {
        await immediateAutoSave('delete product expiry');
      } catch (error) {
        console.error("Failed to auto-save after deleting product expiry:", error);
        toast.error("Failed to save product expiry deletion. Please try again.");
      }
      
      return result;
    },

    // Enhanced support methods with immediate save - return original results
    addComplaint: async (complaintData: any) => {
      console.log("ENHANCED STORE: Adding complaint with immediate save:", complaintData);
      const result = slices.supportSlice.addComplaint(complaintData);
      
      try {
        await immediateAutoSave('add complaint');
      } catch (error) {
        console.error("Failed to auto-save after adding complaint:", error);
        toast.error("Failed to save complaint. Please try again.");
      }
      
      return result;
    },

    addFeedback: async (feedbackData: any) => {
      console.log("ENHANCED STORE: Adding feedback with immediate save:", feedbackData);
      const result = slices.supportSlice.addFeedback(feedbackData);
      
      try {
        await immediateAutoSave('add feedback');
      } catch (error) {
        console.error("Failed to auto-save after adding feedback:", error);
        toast.error("Failed to save feedback. Please try again.");
      }
      
      return result;
    },

    addTicket: async (ticketData: any) => {
      console.log("ENHANCED STORE: Adding ticket with immediate save:", ticketData);
      const result = slices.supportSlice.addTicket(ticketData);
      
      try {
        await immediateAutoSave('add ticket');
      } catch (error) {
        console.error("Failed to auto-save after adding ticket:", error);
        toast.error("Failed to save ticket. Please try again.");
      }
      
      return result;
    },

    // Enhanced meeting methods with immediate save - return original results
    addMeeting: async (meetingData: any) => {
      console.log("ENHANCED STORE: Adding meeting with immediate save:", meetingData);
      const result = slices.meetingSlice.addMeeting(meetingData);
      
      try {
        await immediateAutoSave('add meeting');
      } catch (error) {
        console.error("Failed to auto-save after adding meeting:", error);
        toast.error("Failed to save meeting. Please try again.");
      }
      
      return result;
    },

    updateMeeting: async (id: string, updates: any) => {
      console.log("ENHANCED STORE: Updating meeting with immediate save:", id);
      const result = slices.meetingSlice.updateMeeting(id, updates);
      
      try {
        await immediateAutoSave('update meeting');
      } catch (error) {
        console.error("Failed to auto-save after updating meeting:", error);
        toast.error("Failed to save meeting update. Please try again.");
      }
      
      return result;
    },

    deleteMeeting: async (id: string) => {
      console.log("ENHANCED STORE: Deleting meeting with immediate save:", id);
      const result = slices.meetingSlice.deleteMeeting(id);
      
      try {
        await immediateAutoSave('delete meeting');
      } catch (error) {
        console.error("Failed to auto-save after deleting meeting:", error);
        toast.error("Failed to save meeting deletion. Please try again.");
      }
      
      return result;
    },

    // Meeting utility methods
    getMeetingsByClient: (clientId: number) => {
      const state = get();
      return state.meetings.filter((meeting: Meeting) => meeting.clientId === clientId);
    },

    updateMeetingStatus: (meetingId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
      set((state: AppState) => ({
        meetings: state.meetings.map((meeting: Meeting) =>
          meeting.id === meetingId ? { ...meeting, status } : meeting
        )
      }));
    },

    getTotalMeetings: () => {
      const state = get();
      return state.meetings.length;
    },

    // Expiry utility methods
    getExpiringProducts: (days: number) => {
      const state = get();
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      
      return state.productExpiries.filter((expiry: ProductExpiry) => {
        const expiryDate = new Date(expiry.expiry_date);
        return expiryDate <= targetDate && expiryDate >= new Date() && expiry.status === 'active';
      });
    },

    getExpiredProducts: () => {
      const state = get();
      const today = new Date();
      
      return state.productExpiries.filter((expiry: ProductExpiry) => {
        const expiryDate = new Date(expiry.expiry_date);
        return expiryDate < today && expiry.status === 'active';
      });
    },

    // Keep existing methods from slices that don't need enhancement
    saveDataToSupabase: slices.userSlice.saveDataToSupabase,
    syncDataWithSupabase: slices.userSlice.syncDataWithSupabase,
    clearLocalData: slices.userSlice.clearLocalData,
    setupRealtimeUpdates,
    
    // Clear processed transactions method
    clearProcessedTransactions: () => {
      // Implementation for clearing processed transactions
      console.log("Clearing processed transactions");
    },
    
    // Include other slice methods that don't conflict
    setProducts: slices.productSlice.setProducts,
    importProductsFromCSV: slices.productSlice.importProductsFromCSV,
    categories: slices.productSlice.categories,
    setCategories: slices.productSlice.setCategories,
    transferProduct: slices.productSlice.transferProduct,
    restockProduct: slices.productSlice.restockProduct,
    
    // Client methods
    setClients: slices.clientSlice.setClients,
    updateClientPurchase: slices.clientSlice.updateClientPurchase,
    removeClient: slices.clientSlice.removeClient,
    
    // Sale methods
    setSales: slices.saleSlice.setSales,
    deleteSale: slices.saleSlice.deleteSale,
    
    // Payment methods
    setPayments: slices.paymentSlice.setPayments,
    pendingSalePayment: slices.paymentSlice.pendingSalePayment,
    setPendingSalePayment: slices.paymentSlice.setPendingSalePayment,
    pendingEstimateForSale: slices.paymentSlice.pendingEstimateForSale,
    setPendingEstimateForSale: slices.paymentSlice.setPendingEstimateForSale,
    
    // User methods
    currentUser: slices.userSlice.currentUser,
    setCurrentUser: slices.userSlice.setCurrentUser,
    isSignedIn: slices.userSlice.isSignedIn,
    setIsSignedIn: slices.userSlice.setIsSignedIn,
    isLoading: slices.userSlice.isLoading,
    setIsLoading: slices.userSlice.setIsLoading,
    
    // Company methods
    companyName: slices.companySlice.companyName,
    setCompanyName: slices.companySlice.setCompanyName,
    details: slices.companySlice.details,
    address: slices.companySlice.address,
    logo: slices.companySlice.logo,
    defaults: slices.companySlice.defaults,
    documents: slices.companySlice.documents,
    customFields: slices.companySlice.customFields,
    updateDetails: slices.companySlice.updateDetails,
    updateAddress: slices.companySlice.updateAddress,
    updateLogo: slices.companySlice.updateLogo,
    updateDefaults: slices.companySlice.updateDefaults,
    updateDocuments: slices.companySlice.updateDocuments,
    addCustomField: slices.companySlice.addCustomField,
    updateCustomField: slices.companySlice.updateCustomField,
    removeCustomField: slices.companySlice.removeCustomField,
    
    // Expiry methods
    productExpiries: slices.expirySlice.productExpiries,
    setProductExpiries: slices.expirySlice.setProductExpiries,
    loadProductExpiries: slices.expirySlice.loadProductExpiries,
    
    // Meeting methods
    meetings: slices.meetingSlice.meetings,
    setMeetings: slices.meetingSlice.setMeetings,
    
    // Support methods
    complaints: slices.supportSlice.complaints,
    feedback: slices.supportSlice.feedback,
    tickets: slices.supportSlice.tickets,
    setComplaints: slices.supportSlice.setComplaints,
    setFeedback: slices.supportSlice.setFeedback,
    setTickets: slices.supportSlice.setTickets,
  };
};
