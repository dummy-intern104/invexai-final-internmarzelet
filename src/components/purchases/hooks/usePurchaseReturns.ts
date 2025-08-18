
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useAppStore from '@/store/appStore';

export interface PurchaseReturn {
  id: string;
  user_id?: string;
  purchaseOrderNo: string;
  supplierName: string;
  productName: string;
  returnQuantity: number;
  returnReason: string;
  notes: string;
  returnDate: string;
  status: "pending" | "approved" | "completed" | "rejected";
  returnNo: string;
  totalAmount: number;
  created_at?: string;
  updated_at?: string;
}

export const usePurchaseReturns = () => {
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
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

      // Cast userData to any to access purchase_returns field until types are updated
      const userDataWithReturns = userData as any;
      if (userDataWithReturns?.purchase_returns) {
        setReturns(userDataWithReturns.purchase_returns as PurchaseReturn[]);
      }
    } catch (error) {
      console.error('Error loading purchase returns:', error);
      toast.error('Failed to load purchase returns');
    } finally {
      setLoading(false);
    }
  };

  // Save returns to Supabase
  const saveReturns = async (updatedReturns: PurchaseReturn[]) => {
    if (!currentUser?.id) return;

    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: currentUser.id,
          purchase_returns: updatedReturns as any,
          updated_at: new Date().toISOString()
        } as any, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving purchase returns:', error);
      toast.error('Failed to save purchase returns');
    }
  };

  // Add a new return
  const addReturn = async (returnData: Omit<PurchaseReturn, 'id' | 'created_at' | 'updated_at'>) => {
    const newReturn: PurchaseReturn = {
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
  const updateReturnStatus = async (returnId: string, status: PurchaseReturn['status']) => {
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
