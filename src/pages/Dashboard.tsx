
import React, { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SimpleDashboardStats } from "@/components/dashboard/SimpleDashboardStats";
import { SimpleChartsSection } from "@/components/dashboard/SimpleChartsSection";
import { SimpleRecentActivity } from "@/components/dashboard/SimpleRecentActivity";
import useAppStore from "@/store/appStore";

const Dashboard = () => {
  const { loadDataFromSupabase } = useAppStore();

  useEffect(() => {
    // Load all data from Supabase when dashboard mounts
    loadDataFromSupabase();
  }, [loadDataFromSupabase]);

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <SimpleDashboardStats />
      <SimpleChartsSection />
      <SimpleRecentActivity />
    </div>
  );
};

export default Dashboard;
