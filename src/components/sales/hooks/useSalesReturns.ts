
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useAppStore from '@/store/appStore';

export interface SalesReturn {
  id: string;
  user_id?: string;
  original_sale_id?: number;
  original_invoice_id?: string;
  invoice_no?: string;
  product_id?: number;
  product_name: string;
  client_name: string;
  return_quantity: number;
  return_amount: number;
  return_reason: string;
  refund_type: string;
  notes: string;
  return_date: string;
  status: "pending" | "approved" | "completed" | "rejected";
  created_at?: string;
  updated_at?: string;
}

export const useSalesReturns = () => {
  const [returns, setReturns] = useState<SalesReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAppStore();

  // Load returns from Supabase
  const loadReturns = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data: userData, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Cast userData to any to access sales_returns field until types are updated
      const userDataWithReturns = userData as any;
      if (userDataWithReturns?.sales_returns) {
        setReturns(userDataWithReturns.sales_returns as SalesReturn[]);
      }
    } catch (error) {
      console.error('Error loading sales returns:', error);
      toast.error('Failed to load sales returns');
    } finally {
      setLoading(false);
    }
  };

  // Save returns to Supabase
  const saveReturns = async (updatedReturns: SalesReturn[]) => {
    if (!currentUser?.id) return;

    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: currentUser.id,
          sales_returns: updatedReturns as any,
          updated_at: new Date().toISOString()
        } as any, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving sales returns:', error);
      toast.error('Failed to save sales returns');
    }
  };

  // Add a new return
  const addReturn = async (returnData: Omit<SalesReturn, 'id' | 'created_at' | 'updated_at'>) => {
    const newReturn: SalesReturn = {
      ...returnData,
      id: Date.now().toString(),
      user_id: currentUser?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedReturns = [newReturn, ...returns];
    setReturns(updatedReturns);
    await saveReturns(updatedReturns);
    return newReturn;
  };

  // Delete a return
  const deleteReturn = async (returnId: string) => {
    const updatedReturns = returns.filter(returnItem => returnItem.id !== returnId);
    setReturns(updatedReturns);
    await saveReturns(updatedReturns);
  };

  // Update return status
  const updateReturnStatus = async (returnId: string, status: SalesReturn['status']) => {
    const updatedReturns = returns.map(returnItem => 
      returnItem.id === returnId 
        ? { ...returnItem, status, updated_at: new Date().toISOString() }
        : returnItem
    );
    setReturns(updatedReturns);
    await saveReturns(updatedReturns);
  };

  useEffect(() => {
    loadReturns();
  }, [currentUser?.id]);

  return {
    returns,
    loading,
    addReturn,
    deleteReturn,
    updateReturnStatus,
    loadReturns
  };
};
