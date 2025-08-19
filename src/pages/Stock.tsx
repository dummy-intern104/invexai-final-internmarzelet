
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Package, ArrowUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockHeader } from "@/components/products/stock/StockHeader";
import { StockStats } from "@/components/products/stock/StockStats";
import { ProductInventory } from "@/components/products/stock/ProductInventory";
import { TransferContent } from "@/components/products/stock/TransferContent";
import { TransferHistory } from "@/components/products/stock/TransferHistory";
import { useSupabaseInventory } from "@/hooks/useSupabaseInventory";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Stock = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inventory");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { inventory, loading, transferStock } = useSupabaseInventory();
  const { products } = useSupabaseProducts();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to access stock management');
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleTransferStock = async (
    productId: number, 
    quantity: number, 
    from: 'warehouse' | 'local', 
    to: 'warehouse' | 'local'
  ) => {
    try {
      await transferStock(productId, quantity, from, to);
    } catch (error) {
      console.error('Transfer failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <StockHeader onOpenReportDialog={() => setShowReportDialog(true)} />
      
      <StockStats products={products} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">
            <Package className="mr-2 h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="transfer">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Stock Transfer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <ProductInventory 
            products={products}
            inventory={inventory}
          />
        </TabsContent>

        <TabsContent value="transfer" className="space-y-4">
          <TransferContent 
            inventory={inventory}
            onTransferStock={handleTransferStock}
          />
          <TransferHistory />
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => navigate("/products/add")}
          size="lg"
          className="rounded-full shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Product
        </Button>
      </div>
    </div>
  );
};

export default Stock;
