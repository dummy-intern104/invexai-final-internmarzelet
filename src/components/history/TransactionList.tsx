import React, { useState } from "react";
import { Package, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sale, Product } from "@/types";
import { format } from "date-fns";
interface TransactionListProps {
  filteredTransactions: Sale[];
  onDeleteTransaction: (id: number) => void;
  productsExist: boolean;
}
export const TransactionList = ({
  filteredTransactions,
  onDeleteTransaction,
  productsExist
}: TransactionListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);
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
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.length > 0 ? currentTransactions.map((sale, index) => {
            const total = sale.quantity_sold * sale.selling_price;
            return <TableRow key={sale.sale_id}>
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {generateReferenceNumber(sale.sale_id, sale.product?.product_name || "")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(sale.sale_date), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        sale
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {sale.product?.product_name}
                    </TableCell>
                    <TableCell>{sale.quantity_sold}</TableCell>
                    <TableCell>₹{sale.selling_price.toFixed(2)}</TableCell>
                    <TableCell>
                      ₹{total.toFixed(2)}
                    </TableCell>
                    
                  </TableRow>;
          }) : <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No transactions found</h3>
                    <p className="text-muted-foreground">
                      {productsExist ? "Record sales to view transaction history" : "Add products and record sales to view transaction history"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
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