
import { useState, useEffect } from 'react';
import { salesReturnService } from '@/services/supabaseService';
import { toast } from 'sonner';

// Define the Supabase response type that includes joined tables
interface SupabaseSalesReturnResponse {
  id: string;
  user_id?: string;
  sale_id?: string;
  product_id?: string;
  client_id?: string;
  quantity_returned: number;
  return_amount: number;
  return_date: string;
  reason?: string;
  status: string; // This comes as string from Supabase
  created_at?: string;
  updated_at?: string;
  products?: {
    product_name: string;
  } | null;
  clients?: {
    name: string;
  } | null;
  sales?: {
    id: string;
  } | null;
}

export interface SupabaseSalesReturn {
  id: string;
  user_id?: string;
  sale_id?: string;
  product_id?: string;
  client_id?: string;
  quantity_returned: number;
  return_amount: number;
  return_date: string;
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
const transformResponse = (data: SupabaseSalesReturnResponse): SupabaseSalesReturn => ({
  id: data.id,
  user_id: data.user_id,
  sale_id: data.sale_id,
  product_id: data.product_id,
  client_id: data.client_id,
  quantity_returned: data.quantity_returned,
  return_amount: data.return_amount,
  return_date: data.return_date,
  reason: data.reason,
  status: ensureValidStatus(data.status),
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const useSupabaseSalesReturns = () => {
  const [returns, setReturns] = useState<SupabaseSalesReturn[]>([]);
  const [loading, setLoading] = useState(true);

  // Load returns from Supabase
  const loadReturns = async () => {
    try {
      setLoading(true);
      const data = await salesReturnService.getAll();
      // Handle the response safely without strict type casting
      const transformedData = Array.isArray(data) 
        ? data.map((item: any) => transformResponse(item as SupabaseSalesReturnResponse))
        : [];
      setReturns(transformedData);
    } catch (error) {
      console.error('Error loading sales returns:', error);
      toast.error('Failed to load sales returns');
    } finally {
      setLoading(false);
    }
  };

  // Add a new return
  const addReturn = async (returnData: Omit<SupabaseSalesReturn, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newReturn = await salesReturnService.create({
        sale_id: returnData.sale_id,
        product_id: returnData.product_id,
        client_id: returnData.client_id,
        quantity_returned: returnData.quantity_returned,
        return_amount: returnData.return_amount,
        return_date: returnData.return_date,
        reason: returnData.reason,
        status: returnData.status,
      });
      
      const transformedReturn = transformResponse(newReturn as SupabaseSalesReturnResponse);
      setReturns(prev => [transformedReturn, ...prev]);
      toast.success('Sales return created successfully');
      return transformedReturn;
    } catch (error) {
      console.error('Error creating sales return:', error);
      toast.error('Failed to create sales return');
      throw error;
    }
  };

  // Delete a return
  const deleteReturn = async (returnId: string) => {
    try {
      await salesReturnService.delete(returnId);
      setReturns(prev => prev.filter(returnItem => returnItem.id !== returnId));
      toast.success('Sales return deleted successfully');
    } catch (error) {
      console.error('Error deleting sales return:', error);
      toast.error('Failed to delete sales return');
      throw error;
    }
  };

  // Update return status
  const updateReturnStatus = async (returnId: string, status: SupabaseSalesReturn['status']) => {
    try {
      const updatedReturn = await salesReturnService.update(returnId, { status });
      const transformedReturn = transformResponse(updatedReturn as SupabaseSalesReturnResponse);
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
