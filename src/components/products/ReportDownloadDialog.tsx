
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { format } from "date-fns";
import useAppStore from "@/store/appStore";

// Import our new components and utilities
import { ReportTypeSelection, ReportType } from "./reports/ReportTypeSelection";
import { TimeRangeSelection, TimeRange } from "./reports/TimeRangeSelection";
import { generateReport } from "./reports/reportUtils";

interface ReportDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportDownloadDialog = ({ open, onOpenChange }: ReportDownloadDialogProps) => {
  const [reportType, setReportType] = useState<ReportType>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>(new Date());
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>(new Date());
  
  const { products, sales, payments } = useAppStore();

  const handleDownload = () => {
    // Generate the report using our utility function
    const doc = generateReport(
      reportType,
      timeRange,
      products,
      sales,
      payments,
      customDateFrom,
      customDateTo
    );
    
    // Save PDF and close dialog
    doc.save(`${reportType}-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Download Report</DialogTitle>
          <DialogDescription>
            Select the type of report and time range you want to download.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <ReportTypeSelection 
            value={reportType} 
            onChange={setReportType} 
          />
          
          <TimeRangeSelection
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            customDateFrom={customDateFrom}
            customDateTo={customDateTo}
            onCustomDateFromChange={setCustomDateFrom}
            onCustomDateToChange={setCustomDateTo}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDownloadDialog;
