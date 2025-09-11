
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { BarChart } from '@/components/charts/BarChart';
import { Download, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProductSalesData {
  name: string;
  quantity: number;
  revenue: number;
}

const MonthlySales = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const { data: salesData = [], isLoading } = useQuery({
    queryKey: ['monthly-sales', selectedMonth],
    queryFn: async () => {
      const [year, month] = selectedMonth.split('-');
      const startDate = startOfMonth(new Date(parseInt(year), parseInt(month) - 1));
      const endDate = endOfMonth(startDate);

      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          products (
            product_name
          )
        `)
        .gte('sale_date', startDate.toISOString())
        .lte('sale_date', endDate.toISOString())
        .order('sale_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching monthly sales:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!selectedMonth,
  });

  // Calculate top selling products
  const topProducts: ProductSalesData[] = React.useMemo(() => {
    const productSales: Record<string, ProductSalesData> = {};
    
    salesData.forEach(sale => {
      const productName = 'Unknown Product'; // Simplified for now
      if (productSales[productName]) {
        productSales[productName].quantity += sale.quantity_sold;
        productSales[productName].revenue += sale.total_amount;
      } else {
        productSales[productName] = {
          name: productName,
          quantity: sale.quantity_sold,
          revenue: sale.total_amount
        };
      }
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [salesData]);

  // Calculate daily trends
  const dailyTrends = React.useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const startDate = startOfMonth(new Date(parseInt(year), parseInt(month) - 1));
    const endDate = endOfMonth(startDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map(day => {
      const daySales = salesData.filter(sale => 
        format(new Date(sale.sale_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      return {
        date: format(day, 'dd'),
        sales: daySales.reduce((sum, sale) => sum + Number(sale.total_amount), 0),
        count: daySales.length
      };
    });
  }, [salesData, selectedMonth]);

  const totalSales = salesData.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
  const totalInvoices = salesData.length;

  const columns = [
    {
      accessorKey: 'name',
      header: 'Product',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity Sold',
    },
    {
      accessorKey: 'revenue',
      header: 'Revenue',
      cell: ({ row }) => `₹${row.getValue('revenue').toLocaleString()}`,
    },
  ];

  const exportToCSV = () => {
    const csvContent = [
      ['Product', 'Quantity Sold', 'Revenue'],
      ...topProducts.map(product => [
        product.name,
        product.quantity,
        product.revenue
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-sales-${selectedMonth}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading monthly sales data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Monthly Sales Report</h1>
          <p className="text-muted-foreground">Sales trends and top products</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - i);
                  const value = format(date, 'yyyy-MM');
                  const label = format(date, 'MMMM yyyy');
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{totalSales.toLocaleString()}</CardTitle>
            <CardDescription>Total Sales</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totalInvoices}</CardTitle>
            <CardDescription>Total Sales</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{totalInvoices > 0 ? (totalSales / totalInvoices).toFixed(0) : 0}</CardTitle>
            <CardDescription>Average Sale</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Daily Sales Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <BarChart
              data={dailyTrends}
              dataKey="sales"
              xAxisDataKey="date"
              fill="#10b981"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={topProducts} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlySales;
