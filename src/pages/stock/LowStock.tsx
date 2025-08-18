
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Search, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface InventoryItem {
  id: string;
  product_id: number;
  product_name: string;
  current_stock: number;
  reserved_stock: number;
  reorder_level: number;
  location: string;
  last_updated: string;
}

const LowStock = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['low-stock-inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('product_name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Filter products that are low in stock (current stock <= reorder level)
  const lowStockProducts = inventory?.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const isLowStock = item.current_stock <= item.reorder_level && item.reorder_level > 0;
    return matchesSearch && isLowStock;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            Low Stock Products
          </h1>
          <p className="text-muted-foreground">Products that are running low and need to be restocked</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {lowStockProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No low stock products found</h3>
          <p className="mt-1 text-sm text-gray-500">All products are adequately stocked.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lowStockProducts.map((item: InventoryItem) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.product_name}</CardTitle>
                  </div>
                  <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                    Low Stock
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Stock:</span>
                    <span className="font-semibold text-orange-600">{item.current_stock}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reserved:</span>
                    <span className="text-sm">{item.reserved_stock}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reorder Level:</span>
                    <span className="text-sm font-medium text-orange-600">{item.reorder_level}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm">{item.location}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Updated: {new Date(item.last_updated).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStock;
