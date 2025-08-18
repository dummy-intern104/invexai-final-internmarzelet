
import { AppState } from '../types';
import { Sale, Product, ProductExpiry } from '@/types';
import { toast } from 'sonner';
import { createEnhancedStoreMethods } from './enhancedStoreMethods';

export const createStoreMethods = (set: any, get: any, setWithAutoSave: any, slices: any, setupRealtimeUpdates: any) => {
  // Use the enhanced store methods for immediate auto-save functionality
  const enhancedMethods = createEnhancedStoreMethods(set, get, setWithAutoSave, slices, setupRealtimeUpdates);
  
  console.log("STORE METHODS: Using enhanced methods with immediate auto-save");
  
  return enhancedMethods;
};
