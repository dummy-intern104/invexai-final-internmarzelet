
import React from "react";
import { CardStat } from "@/components/ui/card-stat";
import { TrendingUp, ShoppingCart, Package, Users } from "lucide-react";
import useAppStore from "@/store/appStore";

export const SimpleDashboardStats = () => {
  const { products, sales, clients, payments } = useAppStore();

  // Calculate today's revenue from sales
  const today = new Date().toDateString();
  const todayRevenue = sales
    .filter(sale => new Date(sale.sale_date).toDateString() === today)
    .reduce((sum, sale) => sum + (sale.selling_price * sale.quantity_sold), 0);

  // Calculate total revenue
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.selling_price * sale.quantity_sold), 0);

  // Calculate today's orders
  const todayOrders = sales.filter(sale => new Date(sale.sale_date).toDateString() === today).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <CardStat
        title="Today's Revenue"
        value={`₹${todayRevenue.toLocaleString()}`}
        icon={<TrendingUp className="h-4 w-4" />}
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
      />
      
      <CardStat
        title="Total Revenue"
        value={`₹${totalRevenue.toLocaleString()}`}
        icon={<TrendingUp className="h-4 w-4" />}
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      />
      
      <CardStat
        title="Total Products"
        value={products.length.toString()}
        icon={<Package className="h-4 w-4" />}
        className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
      />
      
      <CardStat
        title="Today's Orders"
        value={todayOrders.toString()}
        icon={<ShoppingCart className="h-4 w-4" />}
        className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
      />
    </div>
  );
};
