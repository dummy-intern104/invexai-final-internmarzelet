
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Package, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const RecentActivitySection = () => {
  // Fetch recent sales with proper joins
  const { data: recentSales = [], isLoading: salesLoading } = useQuery({
    queryKey: ['recent-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          clients (
            name
          ),
          products (
            product_name
          )
        `)
        .order('sale_date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch recent clients
  const { data: recentClients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['recent-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch recent products
  const { data: recentProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['recent-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  const loading = salesLoading || clientsLoading || productsLoading;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg m-4"></div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest updates across your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Recent Sales */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Sales
            </h4>
            <div className="space-y-2">
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{sale.products?.product_name || 'Product'}</p>
                      <p className="text-xs text-gray-500">
                        {sale.clients?.name || 'Walk-in Customer'} • {sale.quantity_sold} units
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      ₹{Number(sale.total_amount || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent sales</p>
              )}
            </div>
          </div>

          {/* Recent Clients */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              New Clients
            </h4>
            <div className="space-y-2">
              {recentClients.length > 0 ? (
                recentClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.email || client.phone}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(client.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No new clients</p>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              New Products
            </h4>
            <div className="space-y-2">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{product.product_name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      ₹{Number(product.price || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No new products</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitySection;
