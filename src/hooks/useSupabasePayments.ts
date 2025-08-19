
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface SupabasePayment {
  id: string;
  user_id: string;
  client_id?: string;
  amount: number;
  payment_date: string;
  created_at: string;
  payment_method: string;
  reference_number?: string;
  notes?: string;
  status: string;
  clients?: {
    name: string;
  };
}

export const useSupabasePayments = () => {
  const [payments, setPayments] = useState<SupabasePayment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.payments.getAll();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (paymentData: Omit<SupabasePayment, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const newPayment = await supabaseService.payments.create(paymentData);
      setPayments(prev => [newPayment, ...prev]);
      toast.success('Payment recorded successfully');
      return newPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to record payment');
      throw error;
    }
  };

  const deletePayment = async (paymentId: string) => {
    try {
      await supabaseService.payments.delete(paymentId);
      setPayments(prev => prev.filter(payment => payment.id !== paymentId));
      toast.success('Payment deleted successfully');
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Failed to delete payment');
      throw error;
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return {
    payments,
    loading,
    addPayment,
    deletePayment,
    loadPayments
  };
};
