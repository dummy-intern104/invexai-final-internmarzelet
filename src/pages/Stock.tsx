import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Warehouse, MoveHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useSupabaseInventory } from "@/hooks/useSupabaseInventory";

// Import components
import { StockHeader } from "@/components/products/stock/StockHeader";
import { StockStats } from "@/components/products/stock/StockStats";
import { SearchAndActions } from "@/components/products/stock/SearchAndActions";
import { ProductInventory } from "@/components/products/stock/ProductInventory";
import { TransferContent } from "@/components/products/stock/TransferContent";
import { ProductForm, ProductFormValues } from "@/components/products/stock/ProductForm";
import { TransferProductDialog } from "@/components/products/TransferProductDialog";
import { AddCategoryDialog } from "@/components/products/AddCategoryDialog";
import { RestockProductDialog } from "@/components/products/RestockProductDialog";
import ReportDownloadDialog from "@/components/products/ReportDownloadDialog";

const Stock = () => {
  const [activeTab, setActiveTab] = useState("local");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showRestockDialog, setShowRestockDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  const { products, addProduct, deleteProduct, loading: productsLoading } = useSupabaseProducts();
  const { inventory, updateInventory, transferStock, loading: inventoryLoading } = useSupabaseInventory();

  const categories = [...new Set(products.map(p => p.category))];

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      // Add warehouse tag to product name if it's for warehouse
      // Ensure category is always provided
      const productData = {
        ...values,
        product_name: values.location === "warehouse" 
          ? `${values.product_name} (Warehouse)` 
          : values.product_name,
        price: parseFloat(values.price),
        reorder_level: parseInt(values.reorder_level || "5"),
        category: values.category || "Uncategorized", // Ensure category is always provided
        units: values.units || "0",
      };
      
      const newProduct = await addProduct(productData);
      
      // Also create inventory entry
      if (newProduct) {
        await updateInventory({
          product_id: parseInt(newProduct.id),
          product_name: newProduct.product_name,
          current_stock: parseInt(values.units || "0"),
          warehouse_stock: values.location === "warehouse" ? parseInt(values.units || "0") : 0,
          local_stock: values.location === "local" ? parseInt(values.units || "0") : 0,
          reorder_level: parseInt(values.reorder_level || "5")
        });
      }
      
      toast.success("Product added successfully");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  // Function to handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Function to handle product restock
  const handleRestock = (product: any) => {
    setSelectedProduct(product);
    setShowRestockDialog(true);
  };

  // Handler for search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (productsLoading || inventoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <StockHeader onOpenReportDialog={() => setShowReportDialog(true)} />

      {/* Stats Cards */}
      <StockStats products={products} />

      {/* Search and Action Buttons */}
      <SearchAndActions 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenTransferDialog={() => setOpenTransferDialog(true)}
        onOpenProductDialog={() => setOpenDialog(true)}
      />

      {/* Tabs */}
      <Tabs defaultValue="local" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="local" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Local Stock</span>
          </TabsTrigger>
          <TabsTrigger value="warehouse" className="flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            <span>Warehouse Stock</span>
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <MoveHorizontal className="h-4 w-4" />
            <span>Transfer</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="space-y-4">
          <ProductInventory 
            title="Local Stock Inventory"
            description="Manage stock available in your shop"
            products={filteredProducts.filter(product => !product.product_name.includes("(Warehouse)"))}
            onRestock={handleRestock}
            onDelete={handleDeleteProduct}
          />
        </TabsContent>

        <TabsContent value="warehouse" className="space-y-4">
          <ProductInventory 
            title="Warehouse Stock Inventory"
            description="Manage stock available in your warehouse/godown"
            products={filteredProducts.filter(product => product.product_name.includes("(Warehouse)"))}
            onRestock={handleRestock}
            onDelete={handleDeleteProduct}
          />
        </TabsContent>

        <TabsContent value="transfer" className="space-y-4">
          <TransferContent 
            onOpenTransferDialog={() => {
              setActiveTab("transfer");
              setOpenTransferDialog(true);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Add Product Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm 
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setOpenDialog(false)}
            onOpenAddCategoryDialog={() => setShowAddCategoryDialog(true)}
          />
        </DialogContent>
      </Dialog>

      {/* Other Dialogs */}
      <TransferProductDialog 
        open={openTransferDialog} 
        onOpenChange={setOpenTransferDialog}
        sourceType={activeTab === "warehouse" ? "warehouse" : "local"}
      />

      <AddCategoryDialog 
        open={showAddCategoryDialog}
        onOpenChange={setShowAddCategoryDialog}
      />

      <RestockProductDialog
        open={showRestockDialog}
        onOpenChange={setShowRestockDialog}
        product={selectedProduct}
      />
      
      <ReportDownloadDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
      />
    </div>
  );
};

export default Stock;
