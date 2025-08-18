
import { useState } from "react";
import { MoreHorizontal, Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/types";
import { PaymentReceiptPrint } from "./PaymentReceiptPrint";
import { useNavigate } from "react-router-dom";

interface PaymentTableProps {
  payments: Payment[];
  onDeletePayment: (id: number) => void;
  onAddPayment?: () => void;
}

const PaymentTable = ({
  payments,
  onDeletePayment,
  onAddPayment
}: PaymentTableProps) => {
  const navigate = useNavigate();
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handlePrintPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPrintDialogOpen(true);
  };

  const handleAddClick = () => {
    if (onAddPayment) {
      onAddPayment();
    } else {
      navigate("/payments/add");
    }
  };

  if (payments.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500 mb-4">No payments recorded yet</p>
        <Button onClick={handleAddClick}>Add First Payment</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map(payment => (
              <TableRow key={payment.id}>
                <TableCell>
                  {new Date(payment.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">{payment.clientName}</TableCell>
                <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{payment.method}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>{payment.description || "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePrintPayment(payment)}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Receipt
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedPayment && (
        <PaymentReceiptPrint 
          open={isPrintDialogOpen} 
          onOpenChange={setIsPrintDialogOpen} 
          payment={selectedPayment} 
        />
      )}
    </>
  );
};

export default PaymentTable;
