
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export const createSupabaseStoreMethods = (set: any, get: any) => ({
  // Load all data from Supabase
  loadDataFromSupabase: async () => {
    try {
      console.log('Loading data from Supabase...');
      
      // Load all data in parallel
      const [products, sales, clients, payments, meetings] = await Promise.all([
        supabaseService.products.getAll(),
        supabaseService.sales.getAll(),
        supabaseService.clients.getAll(),
        supabaseService.payments.getAll(),
        supabaseService.meetings.getAll()
      ]);

      // Update store with loaded data
      set({
        products: products || [],
        sales: sales || [],
        clients: clients || [],
        payments: payments || [],
        meetings: meetings || []
      });

      console.log('Data loaded from Supabase successfully');
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
      toast.error('Failed to load data from database');
    }
  },

  // Save individual entities (kept for compatibility)
  saveDataToSupabase: async () => {
    // This method is now handled individually by each service
    console.log('Individual save operations now handled by specific services');
  },

  // Sync method (now just reloads from Supabase)
  syncDataWithSupabase: async () => {
    const state = get();
    await state.loadDataFromSupabase();
  },

  // Clear local data
  clearLocalData: async () => {
    set({
      products: [],
      sales: [],
      clients: [],
      payments: [],
      meetings: [],
      productExpiries: []
    });
    toast.success('Local data cleared');
  },

  // Setup realtime updates (placeholder for future implementation)
  setupRealtimeUpdates: (userId?: string) => {
    if (userId) {
      console.log('Setting up realtime updates for user:', userId);
      // This could be enhanced with Supabase realtime subscriptions
    }
  }
});
