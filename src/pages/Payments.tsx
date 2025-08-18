
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import useAppStore from "@/store/appStore";
import PaymentHeader from "@/components/payments/PaymentHeader";
import PaymentStats from "@/components/payments/PaymentStats";
import PaymentTable from "@/components/payments/PaymentTable";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Payments = () => {
  const navigate = useNavigate();
  const { 
    payments, 
    deletePayment, 
    clients, 
    pendingSalePayment, 
    setPendingSalePayment 
  } = useAppStore();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to access payments');
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="space-y-8 animate-fade-in">
      <PaymentHeader />
      
      <PaymentStats payments={payments} />
      
      <PaymentTable 
        payments={payments} 
        onDeletePayment={deletePayment} 
      />
    </div>
  );
};

export default Payments;
