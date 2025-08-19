
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Package, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductInventory } from '@/components/products/stock/ProductInventory';
import { TransferContent } from '@/components/products/stock/TransferContent';
import { StockStats } from '@/components/products/stock/StockStats';
import { useSupabaseInventory } from '@/hooks/useSupabaseInventory';

const Stock = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { inventory, loading, updateInventory, transferStock } = useSupabaseInventory();

  const handleStockTransfer = async (productId: number, quantity: number, from: 'warehouse' | 'local', to: 'warehouse' | 'local') => {
    try {
      await transferStock(productId, quantity, from, to);
    } catch (error) {
      console.error('Error transferring stock:', error);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Management</h1>
          <p className="text-muted-foreground">Manage your inventory and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Link to="/products/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <StockStats inventory={inventory} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductInventory 
            inventory={inventory}
            onTransferStock={handleStockTransfer}
          />
        </div>
        <div>
          <TransferContent 
            inventory={inventory}
            onTransferStock={handleStockTransfer}
          />
        </div>
      </div>
    </div>
  );
};

export default Stock;
