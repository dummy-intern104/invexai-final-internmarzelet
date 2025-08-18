
import { CreditCard } from "lucide-react";
import { Payment } from "@/types";

interface PaymentStatsProps {
  payments: Payment[];
}

const PaymentStats = ({ payments }: PaymentStatsProps) => {
  const totalPaid = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalPending = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
            <h3 className="text-3xl font-bold mt-1">₹{totalPaid.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
            <h3 className="text-3xl font-bold mt-1">₹{totalPending.toLocaleString()}</h3>
            <p className="text-xs text-muted-foreground mt-1">{payments.filter(p => p.status === 'pending').length} payments pending</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10">
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
            <h3 className="text-3xl font-bold mt-1">{payments.length}</h3>
            <p className="text-xs text-muted-foreground mt-1">transactions this month</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10">
            <CreditCard className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStats;
