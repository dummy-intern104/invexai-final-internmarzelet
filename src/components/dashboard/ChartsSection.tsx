
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
          <CardDescription>Last 30 days revenue performance</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart 
            data={revenueChartData} 
            xKey="name" 
            yKey="value" 
            color="#8884d8"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best performing products by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart 
            data={topProductsData} 
            xKey="name" 
            yKey="value" 
            color="#82ca9d"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
