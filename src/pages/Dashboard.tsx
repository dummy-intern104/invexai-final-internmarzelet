import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AlertsSection } from "@/components/dashboard/AlertsSection";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { RecentActivitySection } from "@/components/dashboard/RecentActivitySection";
import { InsightsSection } from "@/components/products/InsightsSection";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Sale, Product, Client, Payment, ProductExpiry } from "@/types";
import useAppStore from "@/store/appStore";

const Dashboard = () => {
  // Get data from app store instead of direct Supabase queries
  const { 
    products, 
    sales, 
    clients, 
    payments, 
    productExpiries 
  } = useAppStore();
  
  // Fetch expenses and purchase orders for today's purchases calculation
  const { data: expenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', `${today}T00:00:00.000Z`)
        .lte('date', `${today}T23:59:59.999Z`);
      
      if (error) {
        console.error('Error fetching expenses:', error);
        return [];
      }
      return data || [];
    }
  });

  const { data: purchaseOrders } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calculate today's purchases from real data
  const today = new Date().toDateString();
  const todaysPurchases = React.useMemo(() => {
    const purchaseOrdersToday = purchaseOrders
      ? purchaseOrders
          .filter(order => new Date(order.order_date).toDateString() === today)
          .reduce((sum, order) => sum + Number(order.total_amount), 0)
      : 0;
    
    const expensesToday = expenses
      ? expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
      : 0;
    
    return purchaseOrdersToday + expensesToday;
  }, [purchaseOrders, expenses, today]);

  console.log("Dashboard: Using app store data:", {
    salesCount: sales.length,
    productsCount: products.length,
    clientsCount: clients.length,
    paymentsCount: payments.length,
    expiryCount: productExpiries.length,
    todaysPurchases
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader />

      {/* Main Business Stats */}
      <DashboardStats 
        sales={sales}
        products={products}
        clients={clients}
        todaysPurchases={todaysPurchases}
      />

      {/* Alerts & Notifications */}
      <AlertsSection 
        products={products}
        payments={payments}
        inventory={[]}
        productExpiries={productExpiries}
      />

      {/* Real-time Data Visualization */}
      <ChartsSection 
        sales={sales}
        products={products}
        todaysPurchases={todaysPurchases}
      />

      {/* Recent Activity */}
      <RecentActivitySection 
        sales={sales}
        products={products}
      />

      {/* AI Insights Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">AI Insights</h2>
        <InsightsSection />
      </div>
    </div>
  );
};

export default Dashboard;
