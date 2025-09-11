
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useAppStore from "@/store/appStore";

export const UltraSimpleChartsSection = () => {
  const { sales, products } = useAppStore();

  console.log('Charts Data:', {
    salesCount: sales?.length || 0,
    productsCount: products?.length || 0
  });

  // Calculate basic stats for display
  const totalSales = sales?.length || 0;
  const totalProducts = products?.length || 0;
  const totalRevenue = sales?.reduce((sum, sale) => {
    const amount = (sale.selling_price * sale.quantity_sold) || 0;
    return sum + Number(amount);
  }, 0) || 0;

  // Get top categories by product count
  const categoryStats = products?.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Business Overview</CardTitle>
          <CardDescription>Key metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Total Sales</span>
              <span className="text-lg font-bold text-green-600">{totalSales}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Total Revenue</span>
              <span className="text-lg font-bold text-blue-600">₹{totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Products</span>
              <span className="text-lg font-bold text-purple-600">{totalProducts}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
          <CardDescription>Products by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topCategories.length > 0 ? (
              topCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-sm font-bold text-blue-600">{count} products</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg font-medium">No categories yet</p>
                <p className="text-sm">Add some products to see category statistics</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
