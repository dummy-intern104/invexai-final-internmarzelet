
import { ChartLineIcon } from "lucide-react";
import SalesSearch from "./SalesSearch";
import SalesTable from "./SalesTable";
import { Sale } from "@/types";

interface SalesListSectionProps {
  sales: Sale[];
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteSale: (saleId: number) => void;
  totalSales: number;
}

const SalesListSection = ({ 
  sales, 
  searchTerm, 
  onSearchChange, 
  onDeleteSale,
  totalSales 
}: SalesListSectionProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2">
            <ChartLineIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Sales Records</h2>
          </div>
          <SalesSearch 
            searchTerm={searchTerm} 
            onSearchChange={onSearchChange} 
          />
        </div>
      </div>
      <SalesTable 
        sales={sales} 
        onDeleteSale={onDeleteSale} 
      />
      {totalSales > 0 && sales.length === 0 && (
        <div className="text-center py-4">
          No sales found matching your search.
        </div>
      )}
    </div>
  );
};

export default SalesListSection;
