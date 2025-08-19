
import { useState, useEffect } from 'react';
import { supabaseAnalyticsService } from '@/services/supabaseAnalyticsService';
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
        supabaseAnalyticsService.getSalesAnalytics(),
        supabaseAnalyticsService.getInventoryAnalytics(),
        supabaseAnalyticsService.getRevenueChartData(),
        supabaseAnalyticsService.getTopProductsData()
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
    if (analytics.monthlyRevenue > 0) {
      const dailyAverage = analytics.monthlyRevenue / 30;
      if (analytics.todayRevenue > dailyAverage * 1.2) {
        insights.push({
          title: 'Strong Sales Day',
          description: `Today's revenue (₹${analytics.todayRevenue.toLocaleString()}) is 20% above your daily average. Great performance!`,
          type: 'success' as const
        });
      }
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
    if (analytics.todayTransactions > 0) {
      insights.push({
        title: 'Active Business Day',
        description: `${analytics.todayTransactions} transactions completed today. Keep up the good work!`,
        type: 'success' as const
      });
    }

    // Default insight if no specific insights
    if (insights.length === 0) {
      insights.push({
        title: 'Business Running Smoothly',
        description: 'Your business operations are running well. Monitor key metrics to maintain performance.',
        type: 'info' as const
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
