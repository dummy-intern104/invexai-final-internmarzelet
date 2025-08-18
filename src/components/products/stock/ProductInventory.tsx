
import React, { useState } from "react";
import { RefreshCw, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Product } from "@/types";

interface ProductInventoryProps {
  title: string;
  description: string;
  products: Product[];
  onRestock: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export const ProductInventory: React.FC<ProductInventoryProps> = ({
  title,
  description,
  products,
  onRestock,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const generateReferenceNumber = (productId: number, productName: string) => {
    const prefix = productName.substring(0, 3).toUpperCase();
    const paddedId = productId.toString().padStart(4, '0');
    return `${prefix}${paddedId}`;
  };

  const columns = [
    {
      accessorKey: "serial",
      header: "S.No",
      cell: ({ row }) => {
        const index = currentProducts.findIndex(p => p.product_id === row.original.product_id);
        return <div>{startIndex + index + 1}</div>;
      },
    },
    {
      accessorKey: "reference",
      header: "Ref No",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="font-mono text-sm">
            {generateReferenceNumber(product.product_id, product.product_name)}
          </div>
        );
      },
    },
    {
      accessorKey: "product_name",
      header: "Product Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "units",
      header: "Available Units",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return <div>₹{price.toFixed(2)}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onRestock(product)}
              className="text-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Restock
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(product.product_id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTable columns={columns} data={currentProducts} />
          
          {/* Custom Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} products
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
        </div>
      </CardContent>
    </Card>
  );
};
