
import { ProductExpiry } from '@/types';
import { AppState } from '../types';

export const createExpirySlice = (set: any, get: any) => ({
  productExpiries: [] as ProductExpiry[],
  
  setProductExpiries: (expiries: ProductExpiry[]) => {
    console.log("EXPIRY SLICE: Setting product expiries:", expiries.length);
    set((state: AppState) => ({ productExpiries: expiries }));
  },

  addProductExpiry: (expiry: Omit<ProductExpiry, 'id' | 'created_at' | 'updated_at'>) => {
    console.log("EXPIRY SLICE: Adding product expiry:", expiry);
    const newExpiry: ProductExpiry = {
      ...expiry,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    set((state: AppState) => ({
      productExpiries: [...state.productExpiries, newExpiry]
    }));
    
    return newExpiry;
  },

  updateProductExpiry: (id: string, updates: Partial<ProductExpiry>) => {
    console.log("EXPIRY SLICE: Updating product expiry:", id, updates);
    set((state: AppState) => ({
      productExpiries: state.productExpiries.map(expiry =>
        expiry.id === id 
          ? { ...expiry, ...updates, updated_at: new Date().toISOString() }
          : expiry
      )
    }));
  },

  deleteProductExpiry: (id: string) => {
    console.log("EXPIRY SLICE: Deleting product expiry:", id);
    set((state: AppState) => ({
      productExpiries: state.productExpiries.filter(expiry => expiry.id !== id)
    }));
  },

  loadProductExpiries: async () => {
    console.log("EXPIRY SLICE: Loading product expiries from Supabase");
    // This will be handled by the store's syncDataWithSupabase method
  },

  // Helper methods for expiry calculations
  getExpiringProducts: (daysAhead: number = 7) => {
    const state = get();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
    
    return state.productExpiries.filter((expiry: ProductExpiry) => {
      const expiryDate = new Date(expiry.expiry_date);
      const today = new Date();
      return expiry.status === 'active' && expiryDate <= cutoffDate && expiryDate >= today;
    });
  },

  getExpiredProducts: () => {
    const state = get();
    const today = new Date();
    
    return state.productExpiries.filter((expiry: ProductExpiry) => {
      const expiryDate = new Date(expiry.expiry_date);
      return expiry.status === 'active' && expiryDate < today;
    });
  }
});
