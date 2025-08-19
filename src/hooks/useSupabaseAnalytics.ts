
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface DashboardAnalytics {
  todayRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  todayTransactions: number;
  monthlyTransactions: number;
  yearlyTransactions: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export const useSupabaseAnalytics = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [revenueChartData, setRevenueChartData] = useState<ChartData[]>([]);
  const [topProductsData, setTopProductsData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load all analytics data in parallel
      const [salesAnalytics, inventoryAnalytics, revenueData, topProductsData] = await Promise.all([
        supabaseService.analytics.getSalesAnalytics(),
        supabaseService.analytics.getInventoryAnalytics(),
        supabaseService.analytics.getRevenueChartData(),
        supabaseService.analytics.getTopProductsData()
      ]);

      setAnalytics({
        ...salesAnalytics,
        ...inventoryAnalytics
      });
      
      setRevenueChartData(revenueData);
      setTopProductsData(topProductsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = () => {
    if (!analytics) return [];

    const insights = [];

    // Revenue insights
    if (analytics.monthlyRevenue > analytics.yearlyRevenue * 0.2) {
      insights.push({
        title: 'Strong Monthly Performance',
        description: `This month's revenue (₹${analytics.monthlyRevenue.toLocaleString()}) represents ${((analytics.monthlyRevenue / analytics.yearlyRevenue) * 100).toFixed(1)}% of your yearly revenue.`,
        type: 'success' as const
      });
    }

    // Inventory insights
    if (analytics.lowStockCount > 0) {
      insights.push({
        title: 'Low Stock Alert',
        description: `${analytics.lowStockCount} products are running low on stock. Consider restocking soon to avoid stockouts.`,
        type: 'warning' as const
      });
    }

    if (analytics.outOfStockCount > 0) {
      insights.push({
        title: 'Out of Stock Alert',
        description: `${analytics.outOfStockCount} products are completely out of stock. Immediate restocking required.`,
        type: 'warning' as const
      });
    }

    // Transaction insights
    if (analytics.todayTransactions > analytics.monthlyTransactions / 30 * 1.2) {
      insights.push({
        title: 'High Activity Day',
        description: `Today's transaction count (${analytics.todayTransactions}) is 20% above your daily average.`,
        type: 'success' as const
      });
    }

    return insights;
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return {
    analytics,
    revenueChartData,
    topProductsData,
    insights: generateAIInsights(),
    loading,
    loadAnalytics
  };
};
