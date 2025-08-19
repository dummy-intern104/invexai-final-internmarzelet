
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { useSupabaseAnalytics } from "@/hooks/useSupabaseAnalytics";

const ChartsSection = () => {
  const { revenueChartData, topProductsData, loading } = useSupabaseAnalytics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg m-4"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Last 7 days revenue performance</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueChartData.length > 0 ? (
            <LineChart 
              data={revenueChartData} 
              xKey="name" 
              yKey="value" 
              color="#8884d8"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium">No revenue data yet</p>
                <p className="text-sm">Start making sales to see your revenue trend</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best performing products by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          {topProductsData.length > 0 ? (
            <BarChart 
              data={topProductsData} 
              dataKey="value" 
              xAxisDataKey="name" 
              fill="#82ca9d"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium">No sales data yet</p>
                <p className="text-sm">Record some sales to see your top products</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
