
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Package, Search, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier_name: string;
  order_date: string;
  status: string;
  total_amount: number;
  supplier_contact?: string;
  notes?: string;
}

const PurchaseList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: purchaseOrders, isLoading } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredPurchases = purchaseOrders?.filter((purchase: PurchaseOrder) =>
    purchase.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.order_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
          <h1 className="text-3xl font-bold">Purchase List</h1>
          <p className="text-muted-foreground">View and manage all your purchase orders</p>
        </div>
        <Button onClick={() => navigate("/purchases/orders/create")}>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredPurchases.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No purchases found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new purchase order.</p>
          <div className="mt-6">
            <Button onClick={() => navigate("/purchases/orders/create")}>
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPurchases.map((purchase: PurchaseOrder) => (
            <Card key={purchase.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{purchase.order_number}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                        {purchase.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{purchase.supplier_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {purchase.order_date ? format(new Date(purchase.order_date), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="text-lg font-semibold pt-2 border-t">
                    Total: ₹{Number(purchase.total_amount)?.toFixed(2) || '0.00'}
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

export default PurchaseList;
