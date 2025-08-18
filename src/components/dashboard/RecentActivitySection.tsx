
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sale, Product } from "@/types";

interface RecentActivitySectionProps {
  sales: Sale[];
  products: Product[];
}

export const RecentActivitySection = ({ sales, products }: RecentActivitySectionProps) => {
  const navigate = useNavigate();

  const recentSales = sales
    .sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())
    .slice(0, 5);

  // Mock recent purchases
  const recentPurchases = [
    { id: 1, date: new Date().toISOString(), amount: 15000, supplier: "ABC Suppliers" },
    { id: 2, date: new Date().toISOString(), amount: 8500, supplier: "XYZ Corp" }
  ].slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSales.length > 0 ? (
              recentSales.map((sale, index) => {
                const product = products.find(p => p.product_id === sale.product_id);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{product?.product_name || 'Unknown Product'}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {sale.quantity_sold} • {new Date(sale.sale_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(sale.selling_price * sale.quantity_sold).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent sales</p>
            )}
            <Button variant="outline" className="w-full" onClick={() => navigate("/sales")}>
              View All Sales
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Purchase Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPurchases.map((purchase, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{purchase.supplier}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(purchase.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{purchase.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => navigate("/purchases")}>
              View All Purchases
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
