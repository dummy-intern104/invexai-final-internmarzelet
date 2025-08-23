
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import useAppStore from "@/store/appStore";

export const SimpleChartsSection = () => {
  const { sales, products } = useAppStore();

  // Generate revenue chart data for last 7 days
  const revenueChartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toDateString();
    
    const dayRevenue = sales
      .filter(sale => new Date(sale.sale_date).toDateString() === dateStr)
      .reduce((sum, sale) => sum + (sale.selling_price * sale.quantity_sold), 0);
    
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: dayRevenue
    };
  });

  // Generate top products data - fix product ID comparison
  const productSales = sales.reduce((acc, sale) => {
    const product = products.find(p => String(p.id) === String(sale.product_id) || p.product_id === sale.product_id);
    const productName = product?.product_name || 'Unknown Product';
    acc[productName] = (acc[productName] || 0) + (sale.selling_price * sale.quantity_sold);
    return acc;
  }, {} as Record<string, number>);

  const topProductsData = Object.entries(productSales)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Last 7 days revenue performance</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueChartData.some(d => d.value > 0) ? (
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
