
import { create } from 'zustand';
import { ProductState } from './types';
import { createBasicOperations } from './basicOperations';
import { createInventoryOperations } from './inventoryOperations';
import { createCSVImportOperations } from './csvImport';
import { createSupabaseProductOperations } from './supabaseOperations';

export const createProductSlice = (set: any, get: any) => {
  const basicOps = createBasicOperations(set, get);
  const inventoryOps = createInventoryOperations(set, get);
  // Pass only the required two arguments (set and get)
  const csvOps = createCSVImportOperations(set, get);
  // Pass set, get, and the state API as the third argument
  const supabaseOps = createSupabaseProductOperations(set, get, { set, get });
  
  // Combine all operations
  return {
    ...basicOps,
    ...inventoryOps,
    ...csvOps,
    ...supabaseOps,
  };
};

// Create a standalone store for direct usage if needed
const useProductStore = create<ProductState>((set, get) => 
  createProductSlice(set, get)
);

export default useProductStore;
