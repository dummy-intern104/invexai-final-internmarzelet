
import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Client } from "@/types";

interface ClientTableRowProps {
  client: Client;
  index: number;
  startIndex: number;
  onDeleteClient: (id: number) => void;
}

export const ClientTableRow = ({ 
  client, 
  index, 
  startIndex, 
  onDeleteClient 
}: ClientTableRowProps) => {
  const generateReferenceNumber = (clientId: number, clientName: string) => {
    const prefix = clientName ? clientName.substring(0, 3).toUpperCase() : "CLI";
    const paddedId = clientId.toString().padStart(4, '0');
    return `${prefix}${paddedId}`;
  };

  const getRecentPurchases = (client: Client) => {
    if (!client.purchaseHistory || client.purchaseHistory.length === 0) {
      return "No purchases yet";
    }
    
    const recent = client.purchaseHistory.slice(0, 3);
    return recent.map(p => p.productName).join(", ");
  };

  return (
    <TableRow key={client.id}>
      <TableCell className="font-medium">
        {startIndex + index + 1}
      </TableCell>
      <TableCell className="font-mono text-sm">
        {generateReferenceNumber(client.id, client.name)}
      </TableCell>
      <TableCell className="font-medium">
        <Link 
          to={`/clients/${client.id}`}
          className="hover:text-primary hover:underline transition-colors"
        >
          {client.name}
        </Link>
      </TableCell>
      <TableCell>{client.email}</TableCell>
      <TableCell>{client.phone}</TableCell>
      <TableCell>{client.totalPurchases}</TableCell>
      <TableCell>₹{client.totalSpent.toLocaleString()}</TableCell>
      <TableCell className="max-w-xs">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate text-sm text-muted-foreground cursor-help">
                {getRecentPurchases(client)}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <div className="space-y-1">
                <p className="font-semibold">Recent Products:</p>
                {client.purchaseHistory && client.purchaseHistory.length > 0 ? (
                  client.purchaseHistory.slice(0, 5).map((purchase, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium">{purchase.productName}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No purchases yet</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        {new Date(client.lastPurchase).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Link to={`/clients/${client.id}`}>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClient(client.id)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
