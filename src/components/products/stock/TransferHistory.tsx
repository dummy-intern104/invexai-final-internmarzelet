
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, Warehouse } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Mock transfer history data - in a real app, this would come from the store
const mockTransferHistory = [
  {
    id: 1,
    productName: "Sample Product A",
    quantity: 25,
    fromLocation: "Local Shop",
    toLocation: "Warehouse",
    transferDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "completed"
  },
  {
    id: 2,
    productName: "Sample Product B (Warehouse)",
    quantity: 15,
    fromLocation: "Warehouse",
    toLocation: "Local Shop",
    transferDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: "completed"
  },
  {
    id: 3,
    productName: "Sample Product C",
    quantity: 30,
    fromLocation: "Local Shop",
    toLocation: "Warehouse",
    transferDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: "completed"
  }
];

export const TransferHistory: React.FC = () => {
  if (mockTransferHistory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No transfer history available</p>
        <p className="text-sm">Start transferring products to see history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mockTransferHistory.map((transfer) => (
        <div
          key={transfer.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {transfer.fromLocation === "Local Shop" ? (
                <Package className="h-4 w-4 text-blue-500" />
              ) : (
                <Warehouse className="h-4 w-4 text-green-500" />
              )}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              {transfer.toLocation === "Warehouse" ? (
                <Warehouse className="h-4 w-4 text-green-500" />
              ) : (
                <Package className="h-4 w-4 text-blue-500" />
              )}
            </div>
            
            <div>
              <h4 className="font-medium">
                {transfer.productName.replace(" (Warehouse)", "")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {transfer.quantity} units • {transfer.fromLocation} → {transfer.toLocation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-600">
              {transfer.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(transfer.transferDate, { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
