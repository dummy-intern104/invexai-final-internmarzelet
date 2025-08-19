
import { AppState } from '../types';
import { Sale, Product, ProductExpiry } from '@/types';
import { toast } from 'sonner';
import { createEnhancedStoreMethods } from './enhancedStoreMethods';
import { createSupabaseStoreMethods } from './supabaseStoreMethods';

export const createStoreMethods = (set: any, get: any, setWithAutoSave: any, slices: any, setupRealtimeUpdates: any) => {
  // Get supabase methods for data loading
  const supabaseMethods = createSupabaseStoreMethods(set, get);
  
  // Use the enhanced store methods for immediate auto-save functionality
  const enhancedMethods = createEnhancedStoreMethods(set, get, setWithAutoSave, slices, setupRealtimeUpdates);
  
  console.log("STORE METHODS: Using enhanced methods with immediate auto-save");
  
  // Combine both enhanced methods and supabase methods
  return {
    ...enhancedMethods,
    ...supabaseMethods, // This includes loadDataFromSupabase
  };
};
