
import React from "react";
import { Package, Warehouse } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";

interface StockStatsProps {
  products: Product[];
}

export const StockStats: React.FC<StockStatsProps> = ({ products }) => {
  const localProducts = products.filter(p => !p.product_name.includes("(Warehouse)"));
  const warehouseProducts = products.filter(p => p.product_name.includes("(Warehouse)"));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Local Stock</CardTitle>
          <CardDescription>Stock available in your shop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500 mr-2" />
            <div>
              <div className="text-3xl font-bold">{localProducts.length}</div>
              <div className="text-muted-foreground">Items</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Warehouse Stock</CardTitle>
          <CardDescription>Stock available in your warehouse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Warehouse className="h-8 w-8 text-green-500 mr-2" />
            <div>
              <div className="text-3xl font-bold">{warehouseProducts.length}</div>
              <div className="text-muted-foreground">Items</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
