
import { TrendingUp, ShoppingCart, Package, Users } from "lucide-react";
import { CardStat } from "@/components/ui/card-stat";
import { useNavigate } from "react-router-dom";
import { Sale, Product, Client } from "@/types";

interface DashboardStatsProps {
  sales: Sale[];
  products: Product[];
  clients: Client[];
  todaysPurchases: number;
}

export const DashboardStats = ({ 
  sales, 
  products, 
  clients, 
  todaysPurchases 
}: DashboardStatsProps) => {
  const navigate = useNavigate();
  
  console.log("DashboardStats: Input data:", {
    salesCount: sales.length,
    productsCount: products.length,
    clientsCount: clients.length,
    todaysPurchases
  });
  
  // Calculate today's revenue from real data
  const today = new Date().toDateString();
  const todaysRevenue = sales
    .filter(sale => {
      const saleDate = new Date(sale.sale_date).toDateString();
      const isToday = saleDate === today;
      console.log(`DashboardStats: Sale on ${sale.sale_date}, Today: ${today}, Is Today: ${isToday}`);
      return isToday;
    })
    .reduce((sum, sale) => {
      const revenue = (sale.selling_price || 0) * (sale.quantity_sold || 0);
      console.log(`DashboardStats: Sale revenue: ${sale.selling_price} * ${sale.quantity_sold} = ${revenue}`);
      return sum + revenue;
    }, 0);

  console.log("DashboardStats: Calculated values:", {
    todaysRevenue,
    todaysPurchases,
    totalProducts: products.length,
    totalClients: clients.length
  });

  const mainStats = [
    {
      title: "Today's Sales",
      value: `₹${todaysRevenue.toFixed(2)}`,
      icon: <TrendingUp className="h-5 w-5 text-success" />,
      onClick: () => navigate("/sales"),
    },
    {
      title: "Today's Purchases",
      value: `₹${todaysPurchases.toFixed(2)}`,
      icon: <ShoppingCart className="h-5 w-5 text-info" />,
      onClick: () => navigate("/purchases"),
    },
    {
      title: "Total Products",
      value: products.length,
      icon: <Package className="h-5 w-5 text-primary" />,
      onClick: () => navigate("/products"),
    },
    {
      title: "Total Clients",
      value: clients.length,
      icon: <Users className="h-5 w-5 text-purple-500" />,
      onClick: () => navigate("/clients"),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Business Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => (
          <CardStat
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            onClick={stat.onClick}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        ))}
      </div>
    </div>
  );
};
