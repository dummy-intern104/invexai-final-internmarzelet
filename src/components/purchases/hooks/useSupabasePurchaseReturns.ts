
import { useState, useEffect } from 'react';
import { purchaseReturnService } from '@/services/supabaseService';
import { toast } from 'sonner';

// Define the Supabase response type that includes joined tables
interface SupabasePurchaseReturnResponse {
  id: string;
  user_id?: string;
  purchase_order_id?: string;
  supplier_id?: string;
  return_number: string;
  return_date: string;
  total_amount: number;
  reason?: string;
  status: string; // This comes as string from Supabase
  created_at?: string;
  updated_at?: string;
  suppliers?: {
    supplier_name: string;
  } | null;
  purchase_orders?: {
    order_number: string;
  } | null;
}

export interface SupabasePurchaseReturn {
  id: string;
  user_id?: string;
  purchase_order_id?: string;
  supplier_id?: string;
  return_number: string;
  return_date: string;
  total_amount: number;
  reason?: string;
  status: "pending" | "approved" | "completed" | "rejected";
  created_at?: string;
  updated_at?: string;
}

// Helper function to ensure status is valid
const ensureValidStatus = (status: string): "pending" | "approved" | "completed" | "rejected" => {
  const validStatuses = ["pending", "approved", "completed", "rejected"] as const;
  return validStatuses.includes(status as any) ? status as any : "pending";
};

// Helper function to transform response to our interface
const transformResponse = (data: SupabasePurchaseReturnResponse): SupabasePurchaseReturn => ({
  id: data.id,
  user_id: data.user_id,
  purchase_order_id: data.purchase_order_id,
  supplier_id: data.supplier_id,
  return_number: data.return_number,
  return_date: data.return_date,
  total_amount: data.total_amount,
  reason: data.reason,
  status: ensureValidStatus(data.status),
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const useSupabasePurchaseReturns = () => {
  const [returns, setReturns] = useState<SupabasePurchaseReturn[]>([]);
  const [loading, setLoading] = useState(true);

  // Load returns from Supabase
  const loadReturns = async () => {
    try {
      setLoading(true);
      const data = await purchaseReturnService.getAll();
      // Handle the response safely without strict type casting
      const transformedData = Array.isArray(data) 
        ? data.map((item: any) => transformResponse(item as SupabasePurchaseReturnResponse))
        : [];
      setReturns(transformedData);
    } catch (error) {
      console.error('Error loading purchase returns:', error);
      toast.error('Failed to load purchase returns');
    } finally {
      setLoading(false);
    }
  };

  // Add a new return
  const addReturn = async (returnData: Omit<SupabasePurchaseReturn, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newReturn = await purchaseReturnService.create({
        return_number: returnData.return_number,
        return_date: returnData.return_date,
        total_amount: returnData.total_amount,
        reason: returnData.reason,
        status: returnData.status,
        purchase_order_id: returnData.purchase_order_id,
        supplier_id: returnData.supplier_id,
      });
      
      const transformedReturn = transformResponse(newReturn as SupabasePurchaseReturnResponse);
      setReturns(prev => [transformedReturn, ...prev]);
      toast.success('Purchase return created successfully');
      return transformedReturn;
    } catch (error) {
      console.error('Error creating purchase return:', error);
      toast.error('Failed to create purchase return');
      throw error;
    }
  };

  // Delete a return
  const deleteReturn = async (returnId: string) => {
    try {
      await purchaseReturnService.delete(returnId);
      setReturns(prev => prev.filter(returnItem => returnItem.id !== returnId));
      toast.success('Purchase return deleted successfully');
    } catch (error) {
      console.error('Error deleting purchase return:', error);
      toast.error('Failed to delete purchase return');
      throw error;
    }
  };

  // Update return status
  const updateReturnStatus = async (returnId: string, status: SupabasePurchaseReturn['status']) => {
    try {
      const updatedReturn = await purchaseReturnService.update(returnId, { status });
      const transformedReturn = transformResponse(updatedReturn as SupabasePurchaseReturnResponse);
      setReturns(prev => prev.map(returnItem => 
        returnItem.id === returnId ? transformedReturn : returnItem
      ));
      toast.success('Return status updated successfully');
      return transformedReturn;
    } catch (error) {
      console.error('Error updating return status:', error);
      toast.error('Failed to update return status');
      throw error;
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  return {
    returns,
    loading,
    addReturn,
    deleteReturn,
    updateReturnStatus,
    loadReturns
  };
};
