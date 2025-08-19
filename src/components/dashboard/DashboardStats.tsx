
import React from "react";
import { CardStat } from "@/components/ui/card-stat";
import { TrendingUp, ShoppingCart, Package, AlertCircle } from "lucide-react";
import { useSupabaseAnalytics } from "@/hooks/useSupabaseAnalytics";

const DashboardStats = () => {
  const { analytics, loading } = useSupabaseAnalytics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <CardStat
        title="Today's Revenue"
        value={`₹${analytics?.todayRevenue?.toLocaleString() || '0'}`}
        icon={<TrendingUp className="h-4 w-4" />}
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
      />
      
      <CardStat
        title="Monthly Revenue"
        value={`₹${analytics?.monthlyRevenue?.toLocaleString() || '0'}`}
        icon={<TrendingUp className="h-4 w-4" />}
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      />
      
      <CardStat
        title="Total Products"
        value={analytics?.totalProducts?.toString() || '0'}
        icon={<Package className="h-4 w-4" />}
        className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
      />
      
      <CardStat
        title="Today's Orders"
        value={analytics?.todayTransactions?.toString() || '0'}
        icon={<ShoppingCart className="h-4 w-4" />}
        className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
      />
    </div>
  );
};

export default DashboardStats;
