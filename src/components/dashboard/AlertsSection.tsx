
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Package } from "lucide-react";
import { AIInsightCard } from "@/components/ai/AIInsightCard";
import { useSupabaseAnalytics } from "@/hooks/useSupabaseAnalytics";

const AlertsSection = () => {
  const { analytics, insights, loading } = useSupabaseAnalytics();

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-lg m-4"></div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          AI Insights & Alerts
        </CardTitle>
        <CardDescription>
          Real-time business insights and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <AIInsightCard
                key={index}
                title={insight.title}
                description={insight.description}
                type={insight.type}
              />
            ))
          ) : (
            <AIInsightCard
              title="All Systems Normal"
              description="Your business is running smoothly. No immediate action required."
              type="success"
            />
          )}
          
          {analytics && (
            <>
              <AIInsightCard
                title="Inventory Overview"
                description={`Total inventory value: ₹${analytics.totalInventoryValue.toLocaleString()}. ${analytics.lowStockCount > 0 ? `${analytics.lowStockCount} items need restocking.` : 'All items are well stocked.'}`}
                type={analytics.lowStockCount > 0 ? "warning" : "info"}
              />
              
              <AIInsightCard
                title="Monthly Performance"
                description={`This month: ₹${analytics.monthlyRevenue.toLocaleString()} revenue from ${analytics.monthlyTransactions} transactions. ${analytics.monthlyRevenue > 50000 ? 'Excellent performance!' : 'Good progress, keep it up!'}`}
                type="info"
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsSection;
