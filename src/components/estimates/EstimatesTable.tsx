
import React, { useState } from 'react';
import { Pencil, Trash2, CheckCircle2, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import useAppStore from '@/store/appStore';
import { toast } from 'sonner';

interface Estimate {
  id: string;
  clientName: string;
  date: string;
  referenceNo: string;
  totalAmount: number;
  status: "pending" | "accepted" | "rejected" | "completed";
  validUntil: string;
  createdAt: string;
  items?: any[];
  notes?: string;
  terms?: string;
}

interface EstimatesTableProps {
  estimates: Estimate[];
  onPrintEstimate: (estimate: Estimate) => void;
  onDeleteEstimate: (id: string) => void;
  onEditEstimate: (estimate: Estimate) => void;
  onUpdateEstimateStatus?: (estimateId: string, newStatus: "pending" | "accepted" | "rejected" | "completed") => void;
}

export function EstimatesTable({ 
  estimates, 
  onPrintEstimate, 
  onDeleteEstimate, 
  onEditEstimate,
  onUpdateEstimateStatus 
}: EstimatesTableProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { setPendingEstimateForSale } = useAppStore();

  const itemsPerPage = 10;

  function getStatusColor(status: string) {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  const handleApprovalClick = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setShowApprovalDialog(true);
  };

  const handleApprovalConfirm = () => {
    if (!selectedEstimate) return;

    // Update estimate status to accepted
    if (onUpdateEstimateStatus) {
      onUpdateEstimateStatus(selectedEstimate.id, "accepted");
    }

    // Convert estimate to pending estimate format for sales
    const estimateData = {
      id: selectedEstimate.id,
      clientName: selectedEstimate.clientName,
      referenceNo: selectedEstimate.referenceNo,
      totalAmount: selectedEstimate.totalAmount,
      items: selectedEstimate.items || [],
      notes: selectedEstimate.notes,
      terms: selectedEstimate.terms
    };

    // Set the pending estimate data
    setPendingEstimateForSale(estimateData);
    
    toast.success("Estimate approved! Redirecting to record sale...");
    
    // Close dialog and navigate
    setShowApprovalDialog(false);
    setSelectedEstimate(null);
    
    // Navigate to sales page
    setTimeout(() => {
      navigate("/sales");
    }, 100);
  };

  const handleApprovalDeny = () => {
    setShowApprovalDialog(false);
    setSelectedEstimate(null);
    toast.info("Estimate approval cancelled");
  };

  // Sort estimates by reference number in descending order (newest first)
  const sortedEstimates = [...estimates].sort((a, b) => {
    // Extract number from reference number (e.g., "EST-123456" -> 123456)
    const extractNumber = (refNo: string) => {
      const match = refNo.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    
    const aNum = extractNumber(a.referenceNo);
    const bNum = extractNumber(b.referenceNo);
    
    return bNum - aNum; // Descending order
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedEstimates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEstimates = sortedEstimates.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Reference No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEstimates.map((estimate, index) => (
              <TableRow key={estimate.id}>
                <TableCell>
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm">
                    {estimate.referenceNo}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(estimate.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{estimate.clientName}</TableCell>
                <TableCell>₹{estimate.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(estimate.status)}`}>
                    {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onPrintEstimate(estimate)}
                      title="Print Estimate"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEditEstimate(estimate)}
                      title="Edit Estimate"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {estimate.status === "pending" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleApprovalClick(estimate)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Approve Estimate"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-red-50"
                      onClick={() => onDeleteEstimate(estimate.id)}
                      title="Delete Estimate"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Custom Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedEstimates.length)} of {sortedEstimates.length} estimates
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Estimate</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to approve this estimate and proceed to record a new sale with the estimated products?
              <br />
              <br />
              <strong>Estimate:</strong> {selectedEstimate?.referenceNo}
              <br />
              <strong>Client:</strong> {selectedEstimate?.clientName}
              <br />
              <strong>Amount:</strong> ₹{selectedEstimate?.totalAmount.toLocaleString()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleApprovalDeny}>
              Deny
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleApprovalConfirm}>
              Allow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
