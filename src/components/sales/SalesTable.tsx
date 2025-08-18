import { ChartLineIcon, Trash2, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types";
interface SalesTableProps {
  sales: Sale[];
  onDeleteSale: (saleId: number) => void;
}
const SalesTable = ({
  sales,
  onDeleteSale
}: SalesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = sales.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const generateReferenceNumber = (saleId: number, productName: string) => {
    const prefix = productName ? productName.substring(0, 3).toUpperCase() : "SAL";
    const paddedId = saleId.toString().padStart(4, '0');
    return `${prefix}${paddedId}`;
  };
  return <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Ref No</TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ChartLineIcon className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSales.length > 0 ? currentSales.map((sale, index) => <TableRow key={sale.sale_id}>
                  <TableCell className="font-medium">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {generateReferenceNumber(sale.sale_id, sale.product?.product_name || "")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{sale.product?.product_name}</TableCell>
                  <TableCell>
                    {sale.clientName ? <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {sale.clientName}
                      </div> : <span className="text-muted-foreground text-sm">No client</span>}
                  </TableCell>
                  <TableCell>{sale.quantity_sold}</TableCell>
                  <TableCell>₹{sale.selling_price.toFixed(2)}</TableCell>
                  <TableCell>
                    ₹{(sale.quantity_sold * sale.selling_price).toFixed(2)}
                  </TableCell>
                  
                </TableRow>) : <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No sales found matching your search.
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, sales.length)} of {sales.length} sales
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({
            length: totalPages
          }, (_, i) => i + 1).map(page => <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => handlePageChange(page)} className="w-8 h-8 p-0">
                  {page}
                </Button>)}
            </div>
            
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center gap-1">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>}
    </div>;
};
export default SalesTable;