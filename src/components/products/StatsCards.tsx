
import { Package, ChartBarIcon, FileText, TrendingUp } from "lucide-react";
import { CardStat } from "@/components/ui/card-stat";
import { Product } from "@/types";

interface StatsCardsProps {
  products: Product[];
}

export const StatsCards = ({ products }: StatsCardsProps) => {
  // Stats for the top cards
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
    {
      title: "Low Stock Items",
      value: products.filter(p => parseInt(p.units as string) < p.reorder_level).length,
      icon: <ChartBarIcon className="h-5 w-5 text-warning" />,
    },
    {
      title: "Categories",
      value: [...new Set(products.map(p => p.category))].length,
      icon: <FileText className="h-5 w-5 text-info" />,
    },
    {
      title: "Value",
      value: `₹${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}`,
      icon: <TrendingUp className="h-5 w-5 text-success" />,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <CardStat
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};
