import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { BarChart } from '@/components/charts/BarChart';
import { Download, Building, TrendingUp } from 'lucide-react';
import useAppStore from '@/store/appStore';

const SupplierReports = () => {
  const { payments } = useAppStore();
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [supplierData, setSupplierData] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Mock suppliers data
  const mockSuppliers = [
    { id: 'sup1', name: 'ABC Suppliers', contact: '9876543210', email: 'abc@suppliers.com' },
    { id: 'sup2', name: 'XYZ Trading', contact: '9876543211', email: 'xyz@trading.com' },
    { id: 'sup3', name: 'DEF Enterprises', contact: '9876543212', email: 'def@enterprises.com' }
  ];

  // Mock purchase data
  const mockPurchases = [
    { id: '1', supplierId: 'sup1', amount: 50000, date: '2024-01-15', status: 'completed' },
    { id: '2', supplierId: 'sup2', amount: 30000, date: '2024-01-20', status: 'completed' },
    { id: '3', supplierId: 'sup1', amount: 25000, date: '2024-02-10', status: 'pending' }
  ];

  const mockPayments = [
    { id: '1', supplierId: 'sup1', amount: 45000, date: '2024-01-20' },
    { id: '2', supplierId: 'sup2', amount: 30000, date: '2024-01-25' }
  ];

  const mockReturns = [
    { id: '1', supplierId: 'sup1', amount: 5000, date: '2024-01-25', reason: 'Damaged goods' }
  ];

  useEffect(() => {
    let suppliers = mockSuppliers;
    if (selectedSupplier !== 'all') {
      suppliers = suppliers.filter(supplier => supplier.id === selectedSupplier);
    }

    const supplierAnalysis = suppliers.map(supplier => {
      const supplierPurchases = mockPurchases.filter(p => p.supplierId === supplier.id);
      const supplierPayments = mockPayments.filter(p => p.supplierId === supplier.id);
      const supplierReturns = mockReturns.filter(r => r.supplierId === supplier.id);

      const totalPurchases = supplierPurchases.reduce((sum, p) => sum + p.amount, 0);
      const totalPayments = supplierPayments.reduce((sum, p) => sum + p.amount, 0);
      const totalReturns = supplierReturns.reduce((sum, r) => sum + r.amount, 0);
      const outstanding = totalPurchases - totalPayments;

      return {
        id: supplier.id,
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email,
        totalPurchases,
        totalPayments,
        totalReturns,
        outstanding,
        purchaseCount: supplierPurchases.length,
        returnCount: supplierReturns.length
      };
    });

    setSupplierData(supplierAnalysis);

    // Prepare chart data
    const topSuppliers = supplierAnalysis
      .sort((a, b) => b.totalPurchases - a.totalPurchases)
      .slice(0, 10);

    setChartData(topSuppliers.map(supplier => ({
      name: supplier.name.length > 15 ? supplier.name.substring(0, 15) + '...' : supplier.name,
      purchases: supplier.totalPurchases,
      payments: supplier.totalPayments
    })));
  }, [payments, selectedSupplier]);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Supplier Name',
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
    },
    {
      accessorKey: 'totalPurchases',
      header: 'Total Purchases',
      cell: ({ row }) => `₹${row.getValue('totalPurchases').toLocaleString()}`,
    },
    {
      accessorKey: 'totalPayments',
      header: 'Total Payments',
      cell: ({ row }) => `₹${row.getValue('totalPayments').toLocaleString()}`,
    },
    {
      accessorKey: 'totalReturns',
      header: 'Total Returns',
      cell: ({ row }) => `₹${row.getValue('totalReturns').toLocaleString()}`,
    },
    {
      accessorKey: 'outstanding',
      header: 'Outstanding',
      cell: ({ row }) => {
        const value = row.getValue('outstanding');
        return (
          <span className={value > 0 ? 'text-red-600' : 'text-green-600'}>
            ₹{Math.abs(value).toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: 'purchaseCount',
      header: 'Purchase Orders',
    },
  ];

  const exportToCSV = () => {
    const csvContent = [
      ['Supplier Name', 'Contact', 'Email', 'Total Purchases', 'Total Payments', 'Total Returns', 'Outstanding', 'Purchase Orders'],
      ...supplierData.map(supplier => [
        supplier.name,
        supplier.contact,
        supplier.email,
        supplier.totalPurchases,
        supplier.totalPayments,
        supplier.totalReturns,
        supplier.outstanding,
        supplier.purchaseCount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supplier-reports.csv';
    a.click();
  };

  const totalPurchases = supplierData.reduce((sum, s) => sum + s.totalPurchases, 0);
  const totalPayments = supplierData.reduce((sum, s) => sum + s.totalPayments, 0);
  const totalOutstanding = supplierData.reduce((sum, s) => sum + s.outstanding, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Supplier Reports</h1>
          <p className="text-muted-foreground">Supplier-wise purchases, payments, and returns</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="All Suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {mockSuppliers.map(supplier => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{supplierData.length}</CardTitle>
            <CardDescription>Active Suppliers</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{totalPurchases.toLocaleString()}</CardTitle>
            <CardDescription>Total Purchases</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{totalPayments.toLocaleString()}</CardTitle>
            <CardDescription>Total Payments</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-2xl ${totalOutstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{Math.abs(totalOutstanding).toLocaleString()}
            </CardTitle>
            <CardDescription>Total Outstanding</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Supplier Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <BarChart
              data={chartData}
              dataKey="purchases"
              xAxisDataKey="name"
              fill="#8b5cf6"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Supplier Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={supplierData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierReports;
