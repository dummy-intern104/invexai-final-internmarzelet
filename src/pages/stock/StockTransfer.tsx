
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Warehouse, ArrowRightLeft, History, TrendingUp } from "lucide-react";
import { TransferProductDialog } from "@/components/products/TransferProductDialog";
import { TransferHistory } from "@/components/products/stock/TransferHistory";
import useAppStore from "@/store/appStore";

const StockTransfer = () => {
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [transferSourceType, setTransferSourceType] = useState<'local' | 'warehouse'>('local');
  const products = useAppStore((state) => state.products);

  // Calculate stock statistics
  const localProducts = products.filter(p => !p.product_name.includes("(Warehouse)"));
  const warehouseProducts = products.filter(p => p.product_name.includes("(Warehouse)"));
  const totalLocalStock = localProducts.reduce((sum, p) => sum + parseInt(p.units as string), 0);
  const totalWarehouseStock = warehouseProducts.reduce((sum, p) => sum + parseInt(p.units as string), 0);

  const handleTransferClick = (sourceType: 'local' | 'warehouse') => {
    setTransferSourceType(sourceType);
    setOpenTransferDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Transfer</h1>
          <p className="text-muted-foreground">
            Transfer products between your local shop and warehouse
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          Transfer Management
        </Badge>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Local Shop Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocalStock}</div>
            <p className="text-xs text-muted-foreground">
              {localProducts.length} products
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouse Stock</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouseStock}</div>
            <p className="text-xs text-muted-foreground">
              {warehouseProducts.length} products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocalStock + totalWarehouseStock}</div>
            <p className="text-xs text-muted-foreground">
              All locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Local to Warehouse</CardTitle>
                <CardDescription>
                  Move excess inventory from your shop to warehouse storage
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available for transfer:</span>
                <span className="font-medium">{localProducts.length} products</span>
              </div>
              <Button 
                onClick={() => handleTransferClick('local')} 
                className="w-full"
                size="lg"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Transfer to Warehouse
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
                <Warehouse className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Warehouse to Local</CardTitle>
                <CardDescription>
                  Restock your local shop with products from the warehouse
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available for transfer:</span>
                <span className="font-medium">{warehouseProducts.length} products</span>
              </div>
              <Button 
                onClick={() => handleTransferClick('warehouse')} 
                className="w-full"
                size="lg"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Transfer to Local Shop
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfer History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <CardTitle>Recent Transfers</CardTitle>
          </div>
          <CardDescription>
            View your recent stock transfer activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransferHistory />
        </CardContent>
      </Card>

      {/* Transfer Dialog */}
      <TransferProductDialog 
        open={openTransferDialog} 
        onOpenChange={setOpenTransferDialog}
        sourceType={transferSourceType}
      />
    </div>
  );
};

export default StockTransfer;
