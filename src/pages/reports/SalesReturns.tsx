
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { Download, RotateCcw } from 'lucide-react';
import useAppStore from '@/store/appStore';
import { format } from 'date-fns';

const SalesReturns = () => {
  const { clients, products } = useAppStore();
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');

  // Mock sales returns data since it doesn't exist in the store
  const mockSalesReturns = [
    {
      id: '1',
      returnNumber: 'SR-001',
      clientId: 1,
      totalAmount: 5000,
      reason: 'Defective product',
      date: '2024-01-15',
      status: 'completed',
      items: [{ productId: 1, quantity: 2, price: 2500 }]
    },
    {
      id: '2',
      returnNumber: 'SR-002',
      clientId: 2,
      totalAmount: 3000,
      reason: 'Customer dissatisfaction',
      date: '2024-01-20',
      status: 'pending',
      items: [{ productId: 2, quantity: 1, price: 3000 }]
    }
  ];

  useEffect(() => {
    let filtered = [...mockSalesReturns];

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(returnItem => 
        new Date(returnItem.date) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filtered = filtered.filter(returnItem => 
        new Date(returnItem.date) <= new Date(dateTo)
      );
    }

    // Filter by customer
    if (selectedCustomer !== 'all') {
      filtered = filtered.filter(returnItem => 
        returnItem.clientId === parseInt(selectedCustomer)
      );
    }

    // Filter by product
    if (selectedProduct !== 'all') {
      filtered = filtered.filter(returnItem => 
        returnItem.items?.some(item => item.productId === parseInt(selectedProduct))
      );
    }

    setFilteredReturns(filtered);
  }, [dateFrom, dateTo, selectedCustomer, selectedProduct]);

  const columns = [
    {
      accessorKey: 'returnNumber',
      header: 'Return #',
    },
    {
      accessorKey: 'clientId',
      header: 'Customer',
      cell: ({ row }) => {
        const client = clients.find(c => c.id === row.getValue('clientId'));
        return client?.name || 'Unknown Customer';
      },
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount',
      cell: ({ row }) => `₹${row.getValue('totalAmount').toLocaleString()}`,
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.getValue('date')), 'dd/MM/yyyy'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.getValue('status') === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.getValue('status')}
        </span>
      ),
    },
  ];

  const totalReturns = filteredReturns.reduce((sum, returnItem) => sum + returnItem.totalAmount, 0);
  const totalCount = filteredReturns.length;

  const exportToCSV = () => {
    const csvContent = [
      ['Return Number', 'Customer', 'Amount', 'Reason', 'Date', 'Status'],
      ...filteredReturns.map(returnItem => {
        const client = clients.find(c => c.id === returnItem.clientId);
        return [
          returnItem.returnNumber,
          client?.name || 'Unknown Customer',
          returnItem.totalAmount,
          returnItem.reason,
          format(new Date(returnItem.date), 'dd/MM/yyyy'),
          returnItem.status
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-returns-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedCustomer('all');
    setSelectedProduct('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Returns Report</h1>
          <p className="text-muted-foreground">Track and analyze all sales returns</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div>
              <Label>Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product.product_id} value={product.product_id.toString()}>
                      {product.product_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totalCount}</CardTitle>
            <CardDescription>Total Returns</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{totalReturns.toLocaleString()}</CardTitle>
            <CardDescription>Total Return Value</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{totalCount > 0 ? (totalReturns / totalCount).toFixed(0) : 0}</CardTitle>
            <CardDescription>Average Return Value</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Returns Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredReturns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReturns;
