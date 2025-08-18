
import { Search, Trash2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types";
import useAppStore from "@/store/appStore";
import { useState } from "react";
import { RestockProductDialog } from "./RestockProductDialog";

interface ProductsTableProps {
  products: Product[];
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductsTable = ({
  products,
  searchTerm,
  onSearchChange,
}: ProductsTableProps) => {
  const { deleteProduct } = useAppStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRestockDialog, setShowRestockDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = products.filter((product) => {
    return product.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleRestock = (product: Product) => {
    setSelectedProduct(product);
    setShowRestockDialog(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const generateReferenceNumber = (productId: number, productName: string) => {
    const prefix = productName.substring(0, 3).toUpperCase();
    const paddedId = productId.toString().padStart(4, '0');
    return `${prefix}${paddedId}`;
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-xl font-semibold">Product Inventory</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={onSearchChange}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Ref No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <TableRow key={product.product_id}>
                  <TableCell className="font-medium">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {generateReferenceNumber(product.product_id, product.product_name)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.product_name}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.units}</TableCell>
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        parseInt(product.units as string) > 10
                          ? "bg-green-100 text-green-800"
                          : parseInt(product.units as string) > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {parseInt(product.units as string) > 10
                        ? "In Stock"
                        : parseInt(product.units as string) > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestock(product)}
                      className="text-blue-500"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Restock
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProduct(product.product_id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  {products.length === 0 
                    ? "No products available. Add some products or import from CSV."
                    : "No products found matching your search."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
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
      
      <RestockProductDialog
        open={showRestockDialog}
        onOpenChange={setShowRestockDialog}
        product={selectedProduct}
      />
    </div>
  );
};
