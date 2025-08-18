
import { create } from 'zustand';
import { Payment, Sale } from '@/types';
import { toast } from 'sonner';
import { PaymentState, PendingEstimateData } from '../types';

export const createPaymentSlice = (
  set: any, 
  get: any,
  updateClientPurchase: (clientName: string, amount: number) => void
) => ({
  payments: [],
  pendingSalePayment: null,
  pendingEstimateForSale: null,
  
  setPayments: (payments: Payment[]) => set({ payments }),
  
  setPendingSalePayment: (sale: Sale | null) => set({ pendingSalePayment: sale }),
  
  setPendingEstimateForSale: (estimate: PendingEstimateData | null) => set({ pendingEstimateForSale: estimate }),
  
  addPayment: (paymentData) => set((state: PaymentState) => {
    const newPayment: Payment = {
      id: state.payments.length > 0 ? Math.max(...state.payments.map(p => p.id)) + 1 : 1,
      date: new Date().toISOString(),
      clientName: paymentData.clientName,
      amount: paymentData.amount,
      status: paymentData.status,
      method: paymentData.method,
      description: paymentData.description,
      relatedSaleId: paymentData.relatedSaleId,
    };
    
    // Update client in the client store
    updateClientPurchase(paymentData.clientName, paymentData.amount);
    
    toast.success("Payment added successfully");
    
    return { 
      payments: [newPayment, ...state.payments],
    };
  }),
  
  deletePayment: (paymentId) => set((state: PaymentState) => {
    toast.success("Payment deleted successfully");
    return { payments: state.payments.filter(payment => payment.id !== paymentId) };
  })
});

// This is just a placeholder since the standalone store needs the client store
// The actual implementation will be in the root store
const useStandalonePaymentStore = create<PaymentState>((set, get) => 
  createPaymentSlice(set, get, () => {})
);

export default useStandalonePaymentStore;
