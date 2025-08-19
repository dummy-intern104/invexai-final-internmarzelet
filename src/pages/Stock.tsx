
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, AlertTriangle, ArrowUpDown, Warehouse, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useSupabaseInventory } from "@/hooks/useSupabaseInventory";
import { toast } from "sonner";

const Stock = () => {
  const { products, loading: productsLoading } = useSupabaseProducts();
  const { inventory, loading: inventoryLoading, transferStock } = useSupabaseInventory();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferDirection, setTransferDirection] = useState<'warehouse-to-local' | 'local-to-warehouse'>('warehouse-to-local');

  const loading = productsLoading || inventoryLoading;

  // Get inventory stats
  const totalProducts = products.length;
  const lowStockProducts = inventory.filter(item => item.current_stock <= item.reorder_level);
  const outOfStockProducts = inventory.filter(item => item.current_stock === 0);

  const handleTransfer = async () => {
    if (!selectedProduct || transferAmount <= 0) {
      toast.error("Please select a product and enter a valid transfer amount");
      return;
    }

    try {
      await transferStock(selectedProduct, transferAmount, transferDirection);
      setSelectedProduct(null);
      setTransferAmount(0);
      toast.success("Stock transferred successfully");
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Failed to transfer stock");
    }
  };

  const getInventoryForProduct = (productId: string) => {
    return inventory.find(inv => inv.product_id.toString() === productId);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading stock data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stock Management</h1>
          <p className="text-muted-foreground">
            Manage inventory across warehouse and local storage
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/products/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{outOfStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{inventory.reduce((sum, item) => {
                const product = products.find(p => p.id === item.product_id.toString());
                return sum + (item.current_stock * (product?.price || 0));
              }, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
          <TabsTrigger value="transfer">Stock Transfer</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
              <CardDescription>
                Current stock levels across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => {
                  const inventoryItem = getInventoryForProduct(product.id);
                  const isLowStock = inventoryItem && inventoryItem.current_stock <= inventoryItem.reorder_level;
                  const isOutOfStock = inventoryItem && inventoryItem.current_stock === 0;

                  return (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">{product.product_name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <div className="flex gap-2">
                          {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
                          {isLowStock && !isOutOfStock && <Badge variant="secondary">Low Stock</Badge>}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Warehouse className="w-3 h-3" />
                              Warehouse
                            </div>
                            <div className="font-medium">{inventoryItem?.warehouse_stock || 0}</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Building className="w-3 h-3" />
                              Local
                            </div>
                            <div className="font-medium">{inventoryItem?.local_stock || 0}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Total</div>
                            <div className="font-bold">{inventoryItem?.current_stock || 0}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>Stock Transfer</CardTitle>
              <CardDescription>
                Transfer stock between warehouse and local storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stock transfer form would go here */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Product</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded"
                    value={selectedProduct || ""}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.product_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Transfer Direction</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded"
                    value={transferDirection}
                    onChange={(e) => setTransferDirection(e.target.value as any)}
                  >
                    <option value="warehouse-to-local">Warehouse to Local</option>
                    <option value="local-to-warehouse">Local to Warehouse</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full mt-1 p-2 border rounded"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(parseInt(e.target.value) || 0)}
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              
              <Button onClick={handleTransfer} disabled={!selectedProduct || transferAmount <= 0}>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Transfer Stock
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>
                Products requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outOfStockProducts.length > 0 && (
                  <div>
                    <h3 className="font-medium text-red-600 mb-2">Out of Stock</h3>
                    {outOfStockProducts.map((item) => {
                      const product = products.find(p => p.id === item.product_id.toString());
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                          <span>{product?.product_name}</span>
                          <Badge variant="destructive">0 units</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {lowStockProducts.filter(item => item.current_stock > 0).length > 0 && (
                  <div>
                    <h3 className="font-medium text-orange-600 mb-2">Low Stock</h3>
                    {lowStockProducts.filter(item => item.current_stock > 0).map((item) => {
                      const product = products.find(p => p.id === item.product_id.toString());
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded">
                          <span>{product?.product_name}</span>
                          <Badge variant="secondary">{item.current_stock} units</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-8 h-8 mx-auto mb-2" />
                    All products are well stocked
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Stock;
