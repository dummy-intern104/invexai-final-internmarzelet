
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export const createSupabasePaymentOperations = (set: any, get: any) => ({
  setPayments: (payments: any[]) => {
    set({ payments });
  },

  addPayment: async (paymentData: any) => {
    try {
      const newPayment = await supabaseService.payments.create({
        client_id: paymentData.client_id,
        amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        reference_number: paymentData.reference_number,
        notes: paymentData.notes,
        status: paymentData.status || 'completed'
      });

      set((state: any) => ({
        payments: [newPayment, ...state.payments]
      }));

      toast.success('Payment recorded successfully');
      return newPayment;
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
      throw error;
    }
  },

  deletePayment: async (paymentId: string) => {
    try {
      await supabaseService.payments.delete(paymentId);
      set((state: any) => ({
        payments: state.payments.filter((payment: any) => payment.id !== paymentId)
      }));
      toast.success('Payment deleted successfully');
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Failed to delete payment');
      throw error;
    }
  },

  loadPayments: async () => {
    try {
      const payments = await supabaseService.payments.getAll();
      set({ payments });
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Failed to load payments');
    }
  }
});
