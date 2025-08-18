
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentDetailsSectionProps {
  description: string;
  amount: number;
  method: string;
  status: "paid" | "pending" | "failed";
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: {
    description: boolean;
    amount: boolean;
    method: boolean;
  };
}

const paymentMethods = ["Credit Card", "UPI", "Bank Transfer", "Cash", "Cheque"];

const PaymentDetailsSection = ({ 
  description, 
  amount, 
  method, 
  status, 
  onChange, 
  errors 
}: PaymentDetailsSectionProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Input
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Enter payment description"
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-xs text-red-500">Description is required</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₹) <span className="text-red-500">*</span></Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount || ""}
          onChange={onChange}
          placeholder="Enter amount"
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && (
          <p className="text-xs text-red-500">Amount must be greater than 0</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="method">Payment Method <span className="text-red-500">*</span></Label>
        <select
          id="method"
          name="method"
          className={`flex h-10 w-full rounded-md border ${errors.method ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          value={method}
          onChange={onChange}
        >
          <option value="">Select payment method</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        {errors.method && (
          <p className="text-xs text-red-500">Payment method is required</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={status}
          onChange={onChange}
        >
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </>
  );
};

export default PaymentDetailsSection;
