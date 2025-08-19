
import { supabase } from '@/integrations/supabase/client';
import { ChartData } from '@/types';

export const supabaseAnalyticsService = {
  // Get sales analytics with proper date filtering
  getSalesAnalytics: async () => {
    try {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      // Get today's revenue
      const { data: todayRevenue } = await supabase
        .from('sales')
        .select('total_amount')
        .gte('sale_date', startOfToday.toISOString())
        .lt('sale_date', new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000).toISOString());

      // Get monthly revenue
      const { data: monthlyRevenue } = await supabase
        .from('sales')
        .select('total_amount')
        .gte('sale_date', startOfMonth.toISOString());

      // Get yearly revenue
      const { data: yearlyRevenue } = await supabase
        .from('sales')
        .select('total_amount')
        .gte('sale_date', startOfYear.toISOString());

      // Get today's transactions count
      const { data: todayTransactions } = await supabase
        .from('sales')
        .select('id')
        .gte('sale_date', startOfToday.toISOString())
        .lt('sale_date', new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000).toISOString());

      // Get monthly transactions count
      const { data: monthlyTransactions } = await supabase
        .from('sales')
        .select('id')
        .gte('sale_date', startOfMonth.toISOString());

      // Get yearly transactions count
      const { data: yearlyTransactions } = await supabase
        .from('sales')
        .select('id')
        .gte('sale_date', startOfYear.toISOString());

      return {
        todayRevenue: todayRevenue?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0,
        monthlyRevenue: monthlyRevenue?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0,
        yearlyRevenue: yearlyRevenue?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0,
        todayTransactions: todayTransactions?.length || 0,
        monthlyTransactions: monthlyTransactions?.length || 0,
        yearlyTransactions: yearlyTransactions?.length || 0,
      };
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      return {
        todayRevenue: 0,
        monthlyRevenue: 0,
        yearlyRevenue: 0,
        todayTransactions: 0,
        monthlyTransactions: 0,
        yearlyTransactions: 0,
      };
    }
  },

  // Get inventory analytics
  getInventoryAnalytics: async () => {
    try {
      // Get total products count
      const { data: products } = await supabase
        .from('products')
        .select('id, price');

      // Get inventory with stock levels
      const { data: inventory } = await supabase
        .from('inventory')
        .select('current_stock, reorder_level, product_name');

      const totalProducts = products?.length || 0;
      
      // Calculate low stock items
      const lowStockCount = inventory?.filter(item => 
        item.current_stock <= item.reorder_level
      ).length || 0;

      // Calculate out of stock items
      const outOfStockCount = inventory?.filter(item => 
        item.current_stock === 0
      ).length || 0;

      // Calculate total inventory value (products * their prices)
      const totalInventoryValue = products?.reduce((sum, product) => 
        sum + Number(product.price || 0), 0
      ) || 0;

      return {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        totalInventoryValue,
      };
    } catch (error) {
      console.error('Error fetching inventory analytics:', error);
      return {
        totalProducts: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        totalInventoryValue: 0,
      };
    }
  },

  // Get revenue chart data for the last 7 days
  getRevenueChartData: async (): Promise<ChartData[]> => {
    try {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
      });

      const chartData: ChartData[] = [];

      for (const date of last7Days) {
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const { data: dayRevenue } = await supabase
          .from('sales')
          .select('total_amount')
          .gte('sale_date', startOfDay.toISOString())
          .lt('sale_date', endOfDay.toISOString());

        const revenue = dayRevenue?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0;

        chartData.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: revenue,
        });
      }

      return chartData;
    } catch (error) {
      console.error('Error fetching revenue chart data:', error);
      return [];
    }
  },

  // Get top products by revenue
  getTopProductsData: async (): Promise<ChartData[]> => {
    try {
      const { data: salesData } = await supabase
        .from('sales')
        .select(`
          total_amount,
          products (
            product_name
          )
        `);

      if (!salesData) return [];

      // Group by product and sum revenue
      const productRevenue = salesData.reduce((acc, sale) => {
        const productName = sale.products?.product_name || 'Unknown Product';
        acc[productName] = (acc[productName] || 0) + Number(sale.total_amount || 0);
        return acc;
      }, {} as Record<string, number>);

      // Convert to chart data and sort by revenue
      const chartData = Object.entries(productRevenue)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 products

      return chartData;
    } catch (error) {
      console.error('Error fetching top products data:', error);
      return [];
    }
  },
};
