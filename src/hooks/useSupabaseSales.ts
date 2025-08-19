
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface SupabaseSale {
  id: string;
  user_id: string;
  product_id?: string;
  client_id?: string;
  quantity_sold: number;
  selling_price: number;
  total_amount: number;
  sale_date: string;
  created_at: string;
  payment_method?: string;
  notes?: string;
  products?: {
    product_name: string;
  };
  clients?: {
    name: string;
  };
}

export const useSupabaseSales = () => {
  const [sales, setSales] = useState<SupabaseSale[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSales = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.sales.getAll();
      setSales(data);
    } catch (error) {
      console.error('Error loading sales:', error);
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (saleData: Omit<SupabaseSale, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const newSale = await supabaseService.sales.create(saleData);
      setSales(prev => [newSale, ...prev]);
      toast.success('Sale recorded successfully');
      return newSale;
    } catch (error) {
      console.error('Error creating sale:', error);
      toast.error('Failed to record sale');
      throw error;
    }
  };

  const deleteSale = async (saleId: string) => {
    try {
      await supabaseService.sales.delete(saleId);
      setSales(prev => prev.filter(sale => sale.id !== saleId));
      toast.success('Sale deleted successfully');
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Failed to delete sale');
      throw error;
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  return {
    sales,
    loading,
    addSale,
    deleteSale,
    loadSales
  };
};
