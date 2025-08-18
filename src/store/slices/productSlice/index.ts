
import { create } from 'zustand';
import { ProductState } from './types';
import { createBasicOperations } from './basicOperations';
import { createInventoryOperations } from './inventoryOperations';
import { createCSVImportOperations } from './csvImport';

export const createProductSlice = (set: any, get: any) => {
  // Combine all operations
  return {
    ...createBasicOperations(set, get),
    ...createInventoryOperations(set, get),
    ...createCSVImportOperations(set, get),
  };
};

// Create a standalone store for direct usage if needed
const useProductStore = create<ProductState>((set, get) => 
  createProductSlice(set, get)
);

export default useProductStore;
