
import { AppState } from './types';
import { createPersistedStore } from './createStore';
import { createStoreConfiguration } from './config/storeConfig';
import { integrateSlices } from './integration/sliceIntegration';
import { createStoreMethods } from './methods/storeMethods';

// Create a combined store with all slices
const useAppStore = createPersistedStore<AppState>(
  (set, get, store) => {
    // Create store configuration
    const { saveDataToSupabase, setWithAutoSave, setupRealtimeUpdates } = createStoreConfiguration(set, get);
    
    // Integrate all slices
    const slices = integrateSlices(set, get, store, saveDataToSupabase, setWithAutoSave);
    
    // Create store methods (without passing saveDataToSupabase as parameter since it's defined internally)
    const storeMethods = createStoreMethods(set, get, setWithAutoSave, slices, setupRealtimeUpdates);
    
    // Combine all slices and methods - ENSURE storeMethods override slice methods
    const combinedStore = {
      // Initialize with default values from slices
      products: [],
      sales: [],
      clients: [],
      payments: [],
      meetings: [],
      productExpiries: [],
      
      // Product slice methods
      ...slices.productSlice,
      // Sale slice methods
      ...slices.saleSlice,
      // Client slice methods
      ...slices.clientSlice,
      // Payment slice methods
      ...slices.paymentSlice,
      // User slice methods
      ...slices.userSlice,
      // Company slice methods
      ...slices.companySlice,
      // Meeting slice methods
      ...slices.meetingSlice,
      // Expiry slice methods
      ...slices.expirySlice,
      // Support slice methods
      ...slices.supportSlice,
      
      // Store methods - these OVERRIDE any slice methods with same names
      ...storeMethods,
    };
    
    console.log("APP STORE: Final store recordSale type:", typeof combinedStore.recordSale);
    console.log("APP STORE: Final store addSale type:", typeof combinedStore.addSale);
    
    // Return the combined store (type assertion is safe here as we're combining all required parts)
    return combinedStore as unknown as AppState;
  }
);

export default useAppStore;
