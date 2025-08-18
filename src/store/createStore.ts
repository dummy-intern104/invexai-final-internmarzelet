import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from './types';

// Ensure we import React to fix the useSyncExternalStore issue
import * as React from 'react';

/**
 * Creates a persisted Zustand store with the given implementation function
 */
export function createPersistedStore<T extends AppState>(
  storeImplementation: (set: any, get: any, store: any) => T
) {
  return create<T>()(
    persist(
      storeImplementation,
      {
        name: 'invex-store', // Name for the persisted storage
        partialize: (state) => {
          // Keep UI preferences and minimal data for faster startup
          // Supabase is now the primary data store
          const { 
            currentUser, 
            pendingSalePayment,
            ...rest 
          } = state;
          
          console.log('[STORE-PERSIST] Saving to localStorage:', {
            hasCurrentUser: !!currentUser,
            productsCount: (state.products || []).length,
            salesCount: (state.sales || []).length,
            clientsCount: (state.clients || []).length,
            paymentsCount: (state.payments || []).length
          });
          
          return {
            // Keep UI preferences and settings
            ...rest,
            // Keep user reference for auth state
            currentUser,
            // Keep data in localStorage as backup, but Supabase is primary
            products: state.products || [],
            sales: state.sales || [],
            clients: state.clients || [],
            payments: state.payments || [],
            meetings: state.meetings || []
          };
        },
      }
    )
  );
}
