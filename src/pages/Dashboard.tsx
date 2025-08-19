
import React, { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { AlertsSection } from "@/components/dashboard/AlertsSection";
import { RecentActivitySection } from "@/components/dashboard/RecentActivitySection";
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
      <DashboardStats />
      <ChartsSection />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsSection />
        <RecentActivitySection />
      </div>
    </div>
  );
};

export default Dashboard;
