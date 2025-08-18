
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StockHeaderProps {
  onOpenReportDialog: () => void;
}

export const StockHeader: React.FC<StockHeaderProps> = ({ onOpenReportDialog }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Stock Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your local shop and warehouse inventory
        </p>
      </div>
      <Button 
        variant="outline" 
        onClick={onOpenReportDialog}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" /> Download Report
      </Button>
    </div>
  );
};
