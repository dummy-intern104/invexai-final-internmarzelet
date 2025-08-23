
import React, { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UltraSimpleDashboardStats } from "@/components/dashboard/UltraSimpleDashboardStats";
import { UltraSimpleChartsSection } from "@/components/dashboard/UltraSimpleChartsSection";
import { UltraSimpleRecentActivity } from "@/components/dashboard/UltraSimpleRecentActivity";
import useAppStore from "@/store/appStore";

const Dashboard = () => {
  const { loadDataFromSupabase, products, sales, clients, payments } = useAppStore();

  useEffect(() => {
    console.log('Dashboard mounting, loading data from Supabase...');
    // Load all data from Supabase when dashboard mounts
    loadDataFromSupabase();
  }, [loadDataFromSupabase]);

  // Debug logging
  useEffect(() => {
    console.log('Dashboard data updated:', {
      products: products?.length || 0,
      sales: sales?.length || 0,
      clients: clients?.length || 0,
      payments: payments?.length || 0
    });
  }, [products, sales, clients, payments]);

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <UltraSimpleDashboardStats />
      <UltraSimpleChartsSection />
      <UltraSimpleRecentActivity />
    </div>
  );
};

export default Dashboard;
