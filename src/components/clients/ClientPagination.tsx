
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalClients: number;
  onPageChange: (page: number) => void;
}

export const ClientPagination = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalClients,
  onPageChange
}: ClientPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t">
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1} to {Math.min(endIndex, totalClients)} of {totalClients} clients
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
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
              onClick={() => onPageChange(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
