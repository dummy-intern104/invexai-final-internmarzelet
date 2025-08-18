
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaymentHeaderProps {
  onAddPayment?: () => void;
}

const PaymentHeader = ({ onAddPayment }: PaymentHeaderProps) => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (onAddPayment) {
      onAddPayment();
    } else {
      navigate("/payments/add");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground mt-1">
          Manage your payments and transactions
        </p>
      </div>
      <Button
        onClick={handleAddClick}
        className="self-start sm:self-auto"
      >
        <Plus className="mr-2 h-4 w-4" /> New Payment
      </Button>
    </div>
  );
};

export default PaymentHeader;
