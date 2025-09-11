
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Users, Package } from "lucide-react";
import useAppStore from "@/store/appStore";

export const UltraSimpleRecentActivity = () => {
  const { sales, clients, products } = useAppStore();

  console.log('Recent Activity Data:', {
    salesCount: sales?.length || 0,
    clientsCount: clients?.length || 0,
    productsCount: products?.length || 0
  });

  // Get recent sales (last 5) - simple approach
  const recentSales = (sales || [])
    .sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())
    .slice(0, 5);

  // Get recent clients (last 3)
  const recentClients = (clients || [])
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 3);

  // Get recent products (last 3)
  const recentProducts = (products || [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const findClientName = (clientId: number) => {
    if (!clientId) return 'Walk-in Customer';
    const client = clients?.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const findProductName = (productId: number) => {
    if (!productId) return 'Unknown Product';
    const product = products?.find(p => p.id === String(productId));
    return product?.product_name || 'Unknown Product';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <div key={sale.sale_id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{findProductName(sale.product_id)}</p>
                        <p className="text-xs text-gray-500">
                          {findClientName(sale.clientId)} • {sale.quantity_sold} units
                        </p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        ₹{Number((sale.selling_price * sale.quantity_sold) || 0).toLocaleString()}
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
                        <p className="text-xs text-gray-500">{client.email || client.phone || 'No contact info'}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(client.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No new clients</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Products Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            Recent Products
          </CardTitle>
          <CardDescription>
            Latest products added to inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <p className="text-sm text-gray-500 text-center py-4">No products added yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
