import { AppState } from '../types';
import { createProductSlice } from '../slices/productSlice';
import { createSaleSlice } from '../slices/saleSlice';
import { createClientSlice } from '../slices/client';
import { createPaymentSlice } from '../slices/paymentSlice';
import { createUserSlice } from '../slices/userSlice';
import { createCompanySlice } from '../slices/companySlice';
import { createMeetingSlice } from '../slices/meetingSlice';
import { createExpirySlice } from '../slices/expirySlice';
import { createSupportSlice } from '../slices/supportSlice';

export const integrateSlices = (
  set: any, 
  get: any, 
  store: any,
  saveDataToSupabase: () => Promise<void>,
  setWithAutoSave: (fn: any) => void
) => {
  console.log("SLICE INTEGRATION: Starting slice integration");
  
  // Initialize user slice with the proper save function
  const userSlice = createUserSlice(set, get, saveDataToSupabase);
  console.log("SLICE INTEGRATION: User slice created");
  
  // Create individual slices with cross-slice access
  const productSlice = createProductSlice(set, get);
  console.log("SLICE INTEGRATION: Product slice created");
  
  const clientSlice = createClientSlice(set, get);
  console.log("SLICE INTEGRATION: Client slice created");
  
  const companySlice = createCompanySlice(set, get);
  console.log("SLICE INTEGRATION: Company slice created");
  
  // Create sale slice with enhanced error handling and dependencies
  const saleSlice = createSaleSlice(
    set, 
    get, 
    // Enhanced getProducts function with validation
    () => {
      const state = get();
      const products = state.products || [];
      console.log("SLICE INTEGRATION: getProducts called, returning:", products.length, "products");
      return products;
    },
    // Enhanced updateProduct function with validation
    (updatedProduct) => {
      console.log("SLICE INTEGRATION: updateProduct called for:", updatedProduct.product_id);
      if (!updatedProduct || !updatedProduct.product_id) {
        console.error("SLICE INTEGRATION: Invalid product update data");
        return;
      }
      
      set((state: AppState) => {
        const updatedProducts = state.products.map(p => 
          p.product_id === updatedProduct.product_id ? updatedProduct : p
        );
        console.log("SLICE INTEGRATION: Product updated successfully");
        return { products: updatedProducts };
      });
    },
    // Enhanced client update function with comprehensive validation
    (clientName: string, amount: number, productName: string, quantity: number, transactionId?: string) => {
      // Comprehensive input validation
      if (!clientName || !clientName.trim()) {
        console.error("SLICE INTEGRATION: Invalid client name for update");
        return;
      }
      
      if (typeof amount !== 'number' || amount <= 0) {
        console.error("SLICE INTEGRATION: Invalid amount for client update:", amount);
        return;
      }
      
      if (typeof quantity !== 'number' || quantity <= 0) {
        console.error("SLICE INTEGRATION: Invalid quantity for client update:", quantity);
        return;
      }
      
      if (!productName || !productName.trim()) {
        console.error("SLICE INTEGRATION: Invalid product name for client update");
        return;
      }
      
      console.log("SLICE INTEGRATION: Updating client purchase:", { 
        clientName: clientName.trim(), 
        amount, 
        productName, 
        quantity, 
        transactionId 
      });
      
      try {
        clientSlice.updateClientPurchase(clientName.trim(), amount, productName, quantity, transactionId);
        console.log("SLICE INTEGRATION: Client purchase updated successfully");
      } catch (error) {
        console.error("SLICE INTEGRATION: Error updating client purchase:", error);
      }
    }
  );
  console.log("SLICE INTEGRATION: Sale slice created with recordSale type:", typeof saleSlice.recordSale);
  
  // Enhanced payment slice with better transaction management
  const paymentSlice = createPaymentSlice(
    set, 
    get,
    // Payment client update with validation
    (clientName: string, amount: number) => {
      // Validate inputs
      if (!clientName || !clientName.trim() || typeof amount !== 'number' || amount <= 0) {
        console.error("SLICE INTEGRATION: Invalid payment client update inputs");
        return;
      }
      
      // Generate unique transaction ID for payments
      const transactionId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log("SLICE INTEGRATION: Processing payment with transaction ID:", { 
        clientName: clientName.trim(), 
        amount, 
        transactionId 
      });
      
      try {
        clientSlice.updateClientPurchase(clientName.trim(), amount, "Payment", 1, transactionId);
        console.log("SLICE INTEGRATION: Payment client update completed");
      } catch (error) {
        console.error("SLICE INTEGRATION: Error in payment client update:", error);
      }
    }
  );
  console.log("SLICE INTEGRATION: Payment slice created");

  const meetingSlice = createMeetingSlice(set, get);
  console.log("SLICE INTEGRATION: Meeting slice created");

  const expirySlice = createExpirySlice(set, get);
  console.log("SLICE INTEGRATION: Expiry slice created");

  const supportSlice = createSupportSlice(set, get, store);
  console.log("SLICE INTEGRATION: Support slice created");

  const result = {
    userSlice,
    productSlice,
    clientSlice,
    companySlice,
    saleSlice,
    paymentSlice,
    meetingSlice,
    expirySlice,
    supportSlice
  };
  
  console.log("SLICE INTEGRATION: All slices integrated successfully");
  return result;
};
