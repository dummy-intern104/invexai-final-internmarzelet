
import { useState, useEffect } from "react";
import useAppStore from "@/store/appStore";
import { HistoryHeader } from "@/components/history/HistoryHeader";
import { HistoryStats } from "@/components/history/HistoryStats";
import { HistoryCharts } from "@/components/history/HistoryCharts";
import { TransactionSection } from "@/components/history/TransactionSection";
import ReportDownloadDialog from "@/components/products/ReportDownloadDialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const History = () => {
  const navigate = useNavigate();
  const { sales, products, deleteSale } = useAppStore();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to access history');
        navigate('/auth');
        return;
      }
    };
    checkAuth();
  }, [navigate]);
  
  // Ensure we save any pending changes when visiting this page
  useEffect(() => {
    const saveData = async () => {
      try {
        const { saveDataToSupabase, currentUser, isSignedIn } = useAppStore.getState();
        
        if (currentUser && isSignedIn) {
          console.log("Ensuring data is saved when viewing History page");
          await saveDataToSupabase();
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    
    saveData();
  }, []);
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <HistoryHeader />
        <Button 
          onClick={() => setIsReportDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>
      
      <HistoryStats sales={sales} />
      
      <HistoryCharts sales={sales} showAllTime={true} />
      
      <TransactionSection
        sales={sales}
        onDeleteTransaction={deleteSale}
        productsExist={products.length > 0}
      />

      <ReportDownloadDialog 
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </div>
  );
};

export default History;
