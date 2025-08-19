
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Package, Users } from "lucide-react";
import { useSupabaseSales } from "@/hooks/useSupabaseSales";
import { useSupabaseClients } from "@/hooks/useSupabaseClients";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";

const RecentActivitySection = () => {
  const { sales, loading: salesLoading } = useSupabaseSales();
  const { clients, loading: clientsLoading } = useSupabaseClients();
  const { products, loading: productsLoading } = useSupabaseProducts();

  const loading = salesLoading || clientsLoading || productsLoading;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg m-4"></div>
      </Card>
    );
  }

  const recentSales = sales.slice(0, 5);
  const recentClients = clients.slice(0, 3);
  const recentProducts = products.slice(0, 3);

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
                recentSales.map((sale, index) => (
                  <div key={sale.id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{sale.products?.product_name || 'Product'}</p>
                      <p className="text-xs text-gray-500">
                        {sale.clients?.name || 'Customer'} • {sale.quantity_sold} units
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      ₹{sale.total_amount?.toLocaleString()}
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
                recentClients.map((client, index) => (
                  <div key={client.id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
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
                recentProducts.map((product, index) => (
                  <div key={product.id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{product.product_name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      ₹{product.price?.toLocaleString()}
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
