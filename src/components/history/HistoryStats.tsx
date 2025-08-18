
import React from "react";
import { Calendar, Package, TrendingUp } from "lucide-react";
import { CardStat } from "@/components/ui/card-stat";
import { Sale } from "@/types";

interface HistoryStatsProps {
  sales: Sale[];
}

export const HistoryStats = ({ sales }: HistoryStatsProps) => {
  // Calculate totals from actual data
  const totalTransactions = sales.length;
  const totalProductsSold = sales.reduce(
    (acc, sale) => acc + sale.quantity_sold,
    0
  );
  const totalRevenue = sales.reduce(
    (acc, sale) => acc + sale.quantity_sold * sale.selling_price,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardStat
        title="Total Transactions"
        value={totalTransactions.toLocaleString()}
        icon={<Calendar className="w-5 h-5 text-primary" />}
        className="bg-blue-50 dark:bg-blue-950/30"
      />
      <CardStat
        title="Products Sold"
        value={totalProductsSold.toLocaleString()}
        icon={<Package className="w-5 h-5 text-primary" />}
        className="bg-green-50 dark:bg-green-950/30"
      />
      <CardStat
        title="Total Revenue"
        value={`₹${totalRevenue.toLocaleString()}`}
        icon={<TrendingUp className="w-5 h-5 text-primary" />}
        className="bg-purple-50 dark:bg-purple-950/30"
      />
    </div>
  );
};
