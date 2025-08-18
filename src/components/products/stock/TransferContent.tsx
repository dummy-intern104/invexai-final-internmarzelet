
import React from "react";
import { Package, Warehouse } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TransferContentProps {
  onOpenTransferDialog: () => void;
}

export const TransferContent: React.FC<TransferContentProps> = ({
  onOpenTransferDialog
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Stock</CardTitle>
        <CardDescription>
          Move products between your local shop and warehouse
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/50 p-6 rounded-lg border">
            <h3 className="font-medium text-lg mb-4">Transfer from Local to Warehouse</h3>
            <p className="text-muted-foreground mb-4">
              Move excess inventory from your shop to the warehouse for storage
            </p>
            <Button 
              onClick={onOpenTransferDialog} 
              className="w-full"
            >
              <Package className="h-4 w-4 mr-2" /> 
              Local to Warehouse
            </Button>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg border">
            <h3 className="font-medium text-lg mb-4">Transfer from Warehouse to Local</h3>
            <p className="text-muted-foreground mb-4">
              Restock your local shop with products from the warehouse
            </p>
            <Button 
              onClick={onOpenTransferDialog}
              className="w-full"
            >
              <Warehouse className="h-4 w-4 mr-2" /> 
              Warehouse to Local
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
