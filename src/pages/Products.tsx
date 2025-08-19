import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatsCards } from "@/components/products/StatsCards";
import { ProductsTable } from "@/components/products/ProductsTable";
import { StockPredictor } from "@/components/products/StockPredictor";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InsightsSection from "@/components/products/InsightsSection";
import useAppStore from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProductsProps {
  filterType?: "low-stock" | "all";
}

const Products = ({ filterType = "all" }: ProductsProps) => {
  const navigate = useNavigate();
  const { products, importProductsFromCSV } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("inventory");

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to access products');
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  // Auto-set to Inventory tab if low-stock filter is active
  useState(() => {
    if (filterType === "low-stock") {
      setActiveTab("inventory");
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        setUploading(true);
        await importProductsFromCSV(e.target.files[0]);
        setShowUploadDialog(false);
      } catch (error) {
        console.error('Error importing CSV:', error);
        toast.error("Failed to import products");
      } finally {
        setUploading(false);
      }
    }
  };
  
  // Filter products based on filterType
  const filteredProducts = filterType === "low-stock" 
    ? products.filter(p => parseInt(p.units as string) < p.reorder_level)
    : products;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {filterType === "low-stock" ? "Low Stock Items" : "Products"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {filterType === "low-stock" 
              ? "Products that need to be restocked soon" 
              : "Manage your inventory, add new products, and view insights"}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => navigate("/products/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards products={products} />

      {/* Main Tabs */}
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="predict">AI Stock Predictor</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="space-y-4">
          <ProductsTable
            products={filteredProducts}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </TabsContent>
        <TabsContent value="predict">
          <StockPredictor products={products} />
        </TabsContent>
        <TabsContent value="insights">
          <InsightsSection />
        </TabsContent>
      </Tabs>

      {/* File Upload Dialog (simplified version) */}
      {showUploadDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Import Products from CSV</h3>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with columns for product name, category, price, units, and reorder level.
              </p>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">
                    {uploading ? "Uploading..." : "Click to browse files"}
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadDialog(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
