
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RecordSaleForm from "./RecordSaleForm";

interface SalesHeaderProps {
  productsExist: boolean;
  isRecordSaleOpen: boolean;
  onOpenRecordSale: () => void;
  onCloseRecordSale: () => void;
}

const SalesHeader = ({ 
  productsExist, 
  isRecordSaleOpen, 
  onOpenRecordSale, 
  onCloseRecordSale 
}: SalesHeaderProps) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">Record and manage your sales transactions</p>
        </div>
        
        <Button onClick={onOpenRecordSale} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Record Sale
        </Button>
      </div>

      {!productsExist && (
        <Card>
          <CardHeader>
            <CardTitle>No Products Available</CardTitle>
            <CardDescription>
              You don't have any products yet, but you can still record a sale or add products first.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={onOpenRecordSale} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Record Sale
            </Button>
            <Button onClick={() => window.location.href = '/products'} variant="outline">
              Go to Products
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isRecordSaleOpen} onOpenChange={onCloseRecordSale}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record New Sale</DialogTitle>
          </DialogHeader>
          <RecordSaleForm onClose={onCloseRecordSale} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SalesHeader;
