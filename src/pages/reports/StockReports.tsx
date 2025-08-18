
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { BarChart } from '@/components/charts/BarChart';
import { Download, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import useAppStore from '@/store/appStore';

const StockReports = () => {
  const { products, sales } = useAppStore();
  const [reportType, setReportType] = useState('valuation');
  const [stockData, setStockData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (reportType === 'valuation') {
      // Stock valuation report - using correct property names
      const valuationData = products.map(product => ({
        name: product.product_name,
        quantity: 100, // Mock stock quantity since it's not in the Product type
        costPrice: product.price * 0.8, // Mock cost price
        sellingPrice: product.price,
        totalCost: (product.price * 0.8) * 100,
        totalValue: product.price * 100,
        category: product.category || 'Uncategorized'
      }));
      setStockData(valuationData);
      setChartData(valuationData.slice(0, 10).map(item => ({
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
        value: item.totalValue
      })));
    } else if (reportType === 'movement') {
      // Stock movement report
      const movementData = products.map(product => {
        const productSales = sales.filter(sale => sale.product_id === product.product_id);
        const totalSold = productSales.reduce((sum, sale) => sum + sale.quantity_sold, 0);
        const currentStock = 100; // Mock current stock
        
        return {
          name: product.product_name,
          currentStock: currentStock,
          totalSold: totalSold,
          turnoverRate: currentStock > 0 ? (totalSold / (currentStock + totalSold)) * 100 : 0,
          category: product.category || 'Uncategorized'
        };
      });
      setStockData(movementData);
      setChartData(movementData.slice(0, 10).map(item => ({
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
        value: item.totalSold
      })));
    }
  }, [products, sales, reportType]);

  const getColumns = () => {
    if (reportType === 'valuation') {
      return [
        {
          accessorKey: 'name',
          header: 'Product Name',
        },
        {
          accessorKey: 'quantity',
          header: 'Quantity',
        },
        {
          accessorKey: 'costPrice',
          header: 'Cost Price',
          cell: ({ row }) => `₹${row.getValue('costPrice').toLocaleString()}`,
        },
        {
          accessorKey: 'sellingPrice',
          header: 'Selling Price',
          cell: ({ row }) => `₹${row.getValue('sellingPrice').toLocaleString()}`,
        },
        {
          accessorKey: 'totalCost',
          header: 'Total Cost',
          cell: ({ row }) => `₹${row.getValue('totalCost').toLocaleString()}`,
        },
        {
          accessorKey: 'totalValue',
          header: 'Total Value',
          cell: ({ row }) => `₹${row.getValue('totalValue').toLocaleString()}`,
        },
        {
          accessorKey: 'category',
          header: 'Category',
        },
      ];
    } else {
      return [
        {
          accessorKey: 'name',
          header: 'Product Name',
        },
        {
          accessorKey: 'currentStock',
          header: 'Current Stock',
        },
        {
          accessorKey: 'totalSold',
          header: 'Total Sold',
        },
        {
          accessorKey: 'turnoverRate',
          header: 'Turnover Rate (%)',
          cell: ({ row }) => `${row.getValue('turnoverRate').toFixed(1)}%`,
        },
        {
          accessorKey: 'category',
          header: 'Category',
        },
      ];
    }
  };

  const exportToCSV = () => {
    const headers = getColumns().map(col => col.header);
    const csvContent = [
      headers,
      ...stockData.map(item => 
        getColumns().map(col => {
          if (col.accessorKey === 'turnoverRate') {
            return `${item[col.accessorKey].toFixed(1)}%`;
          } else if (['costPrice', 'sellingPrice', 'totalCost', 'totalValue'].includes(col.accessorKey)) {
            return item[col.accessorKey].toLocaleString();
          }
          return item[col.accessorKey];
        })
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-${reportType}-report.csv`;
    a.click();
  };

  const totalValue = stockData.reduce((sum, item) => 
    sum + (reportType === 'valuation' ? item.totalValue : item.totalSold), 0
  );
  const totalItems = stockData.length;
  const lowStockItems = 5; // Mock low stock count

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stock Reports</h1>
          <p className="text-muted-foreground">Stock valuation and movement analysis</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="valuation">Stock Valuation</SelectItem>
                <SelectItem value="movement">Stock Movement</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totalItems}</CardTitle>
            <CardDescription>Total Products</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{totalValue.toLocaleString()}</CardTitle>
            <CardDescription>
              {reportType === 'valuation' ? 'Total Stock Value' : 'Total Sales Volume'}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${lowStockItems > 0 ? 'text-red-500' : 'text-green-500'}`} />
              {lowStockItems}
            </CardTitle>
            <CardDescription>Low Stock Items</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {reportType === 'valuation' ? <Package className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
            {reportType === 'valuation' ? 'Stock Value Distribution' : 'Sales Volume Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <BarChart
              data={chartData}
              dataKey="value"
              xAxisDataKey="name"
              fill={reportType === 'valuation' ? '#f59e0b' : '#10b981'}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === 'valuation' ? 'Stock Valuation Details' : 'Stock Movement Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={getColumns()} data={stockData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StockReports;
