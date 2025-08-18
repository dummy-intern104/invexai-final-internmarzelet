
import React, { useState } from 'react';
import { Pencil, Trash2, CheckCircle2, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DeliveryChallan {
  id: string;
  clientName: string;
  date: string;
  challanNo: string;
  status: "pending" | "delivered" | "cancelled";
  vehicleNo?: string;
  deliveryAddress?: string;
  createdAt: string;
  items?: any[];
  itemsCount?: number;
  notes?: string;
}

interface DeliveryTableProps {
  challans: DeliveryChallan[];
  onEditChallan: (challan: DeliveryChallan) => void;
  onDeleteChallan: (id: string) => void;
  onPrintChallan: (challan: DeliveryChallan) => void;
  onStatusChange: (id: string, newStatus: "delivered") => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function DeliveryTable({ 
  challans, 
  onEditChallan, 
  onDeleteChallan, 
  onPrintChallan,
  onStatusChange
}: DeliveryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleMarkAsDelivered = (challan: DeliveryChallan) => {
    console.log("Marking challan as delivered:", challan.id, challan.status);
    if (challan.status === "pending") {
      onStatusChange(challan.id, "delivered");
    }
  };

  // Sort challans by challan number in descending order (newest first)
  const sortedChallans = [...challans].sort((a, b) => {
    // Extract number from challan number (e.g., "DC-123456" -> 123456)
    const extractNumber = (challanNo: string) => {
      const match = challanNo.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    
    const aNum = extractNumber(a.challanNo);
    const bNum = extractNumber(b.challanNo);
    
    return bNum - aNum; // Descending order
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedChallans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChallans = sortedChallans.slice(startIndex, endIndex);

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
              <TableHead>Challan No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentChallans.map((challan, index) => (
              <TableRow key={challan.id}>
                <TableCell>
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm">
                    {challan.challanNo}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(challan.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{challan.clientName}</TableCell>
                <TableCell className="text-center">{challan.itemsCount || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(challan.status)}`}>
                    {challan.status.charAt(0).toUpperCase() + challan.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onPrintChallan(challan)}
                      title="Print Challan"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEditChallan(challan)}
                      title="Edit Challan"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {challan.status === "pending" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleMarkAsDelivered(challan)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Mark as Delivered"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-red-50"
                      onClick={() => onDeleteChallan(challan.id)}
                      title="Delete Challan"
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
            Showing {startIndex + 1} to {Math.min(endIndex, sortedChallans.length)} of {sortedChallans.length} challans
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
    </>
  );
}
