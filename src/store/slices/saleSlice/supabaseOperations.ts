
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export const createSupabaseSaleOperations = (set: any, get: any) => ({
  setSales: (sales: any[]) => {
    set({ sales });
  },

  addSale: async (saleData: any) => {
    try {
      const newSale = await supabaseService.sales.create({
        product_id: saleData.product_id,
        client_id: saleData.client_id,
        quantity_sold: saleData.quantity_sold,
        selling_price: saleData.selling_price,
        total_amount: saleData.total_amount,
        payment_method: saleData.payment_method || 'cash',
        notes: saleData.notes
      });

      set((state: any) => ({
        sales: [newSale, ...state.sales]
      }));

      toast.success('Sale recorded successfully');
      return newSale;
    } catch (error) {
      console.error('Error recording sale:', error);
      toast.error('Failed to record sale');
      return null;
    }
  },

  recordSale: async (saleData: any) => {
    // Alias for addSale for compatibility
    return get().addSale(saleData);
  },

  deleteSale: async (saleId: string) => {
    try {
      await supabaseService.sales.delete(saleId);
      set((state: any) => ({
        sales: state.sales.filter((sale: any) => sale.id !== saleId)
      }));
      toast.success('Sale deleted successfully');
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Failed to delete sale');
      throw error;
    }
  },

  loadSales: async () => {
    try {
      const sales = await supabaseService.sales.getAll();
      set({ sales });
    } catch (error) {
      console.error('Error loading sales:', error);
      toast.error('Failed to load sales');
    }
  }
});
