
import React from "react";
import { CardStat } from "@/components/ui/card-stat";
import { TrendingUp, ShoppingCart, Package, Users } from "lucide-react";
import useAppStore from "@/store/appStore";

export const UltraSimpleDashboardStats = () => {
  const { products, sales, clients, payments } = useAppStore();

  console.log('Dashboard Stats Data:', {
    productsCount: products?.length || 0,
    salesCount: sales?.length || 0,
    clientsCount: clients?.length || 0,
    paymentsCount: payments?.length || 0
  });

  // Calculate basic stats without complex joins
  const totalProducts = products?.length || 0;
  const totalSales = sales?.length || 0;
  const totalClients = clients?.length || 0;
  
  // Calculate simple revenue - just sum all sales amounts
  const totalRevenue = sales?.reduce((sum, sale) => {
    const amount = sale.total_amount || (sale.selling_price * sale.quantity_sold) || 0;
    return sum + Number(amount);
  }, 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <CardStat
        title="Total Products"
        value={totalProducts.toString()}
        icon={<Package className="h-4 w-4" />}
        className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
      />
      
      <CardStat
        title="Total Sales"
        value={totalSales.toString()}
        icon={<ShoppingCart className="h-4 w-4" />}
        className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
      />
      
      <CardStat
        title="Total Clients"
        value={totalClients.toString()}
        icon={<Users className="h-4 w-4" />}
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      />
      
      <CardStat
        title="Total Revenue"
        value={`₹${totalRevenue.toLocaleString()}`}
        icon={<TrendingUp className="h-4 w-4" />}
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
      />
    </div>
  );
};
