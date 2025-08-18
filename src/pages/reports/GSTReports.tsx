import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { Download, Receipt, FileText } from 'lucide-react';
import useAppStore from '@/store/appStore';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const GSTReports = () => {
  const { sales } = useAppStore();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [gstData, setGstData] = useState({
    collected: [],
    paid: [],
    summary: {
      totalCollected: 0,
      totalPaid: 0,
      netPayable: 0
    }
  });

  useEffect(() => {
    const [year, month] = selectedMonth.split('-');
    const startDate = startOfMonth(new Date(parseInt(year), parseInt(month) - 1));
    const endDate = endOfMonth(startDate);

    // Calculate GST collected from sales using sale_date
    const periodSales = sales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate >= startDate && saleDate <= endDate;
    });

    const gstCollected = periodSales.map(sale => {
      const totalAmount = sale.selling_price * sale.quantity_sold;
      const baseAmount = totalAmount / 1.18; // Assuming 18% GST
      const gstAmount = totalAmount - baseAmount;
      return {
        invoiceNumber: `INV-${sale.sale_id}`,
        clientName: sale.clientName || 'Walk-in Customer',
        date: sale.sale_date,
        baseAmount: baseAmount,
        gstAmount: gstAmount,
        totalAmount: totalAmount,
        gstRate: 18
      };
    });

    // Mock GST paid data
    const gstPaid = [
      {
        purchaseNumber: 'PUR-001',
        supplierName: 'ABC Suppliers',
        date: new Date().toISOString(),
        baseAmount: 10000,
        gstAmount: 1800,
        totalAmount: 11800,
        gstRate: 18
      }
    ];

    const totalCollected = gstCollected.reduce((sum, item) => sum + item.gstAmount, 0);
    const totalPaid = gstPaid.reduce((sum, item) => sum + item.gstAmount, 0);

    setGstData({
      collected: gstCollected,
      paid: gstPaid,
      summary: {
        totalCollected,
        totalPaid,
        netPayable: totalCollected - totalPaid
      }
    });
  }, [sales, selectedMonth]);

  const collectedColumns = [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
    },
    {
      accessorKey: 'clientName',
      header: 'Customer',
    },
    {
      accessorKey: 'baseAmount',
      header: 'Base Amount',
      cell: ({ row }) => `₹${row.getValue('baseAmount').toFixed(2)}`,
    },
    {
      accessorKey: 'gstAmount',
      header: 'GST Amount',
      cell: ({ row }) => `₹${row.getValue('gstAmount').toFixed(2)}`,
    },
    {
      accessorKey: 'gstRate',
      header: 'GST Rate',
      cell: ({ row }) => `${row.getValue('gstRate')}%`,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.getValue('date')), 'dd/MM/yyyy'),
    },
  ];

  const paidColumns = [
    {
      accessorKey: 'purchaseNumber',
      header: 'Purchase #',
    },
    {
      accessorKey: 'supplierName',
      header: 'Supplier',
    },
    {
      accessorKey: 'baseAmount',
      header: 'Base Amount',
      cell: ({ row }) => `₹${row.getValue('baseAmount').toFixed(2)}`,
    },
    {
      accessorKey: 'gstAmount',
      header: 'GST Amount',
      cell: ({ row }) => `₹${row.getValue('gstAmount').toFixed(2)}`,
    },
    {
      accessorKey: 'gstRate',
      header: 'GST Rate',
      cell: ({ row }) => `${row.getValue('gstRate')}%`,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.getValue('date')), 'dd/MM/yyyy'),
    },
  ];

  const exportToCSV = () => {
    const csvContent = [
      ['GST Summary'],
      ['Total GST Collected', gstData.summary.totalCollected.toFixed(2)],
      ['Total GST Paid', gstData.summary.totalPaid.toFixed(2)],
      ['Net GST Payable', gstData.summary.netPayable.toFixed(2)],
      [''],
      ['GST Collected Details'],
      ['Invoice #', 'Customer', 'Base Amount', 'GST Amount', 'GST Rate', 'Date'],
      ...gstData.collected.map(item => [
        item.invoiceNumber,
        item.clientName,
        item.baseAmount.toFixed(2),
        item.gstAmount.toFixed(2),
        `${item.gstRate}%`,
        format(new Date(item.date), 'dd/MM/yyyy')
      ]),
      [''],
      ['GST Paid Details'],
      ['Purchase #', 'Supplier', 'Base Amount', 'GST Amount', 'GST Rate', 'Date'],
      ...gstData.paid.map(item => [
        item.purchaseNumber,
        item.supplierName,
        item.baseAmount.toFixed(2),
        item.gstAmount.toFixed(2),
        `${item.gstRate}%`,
        format(new Date(item.date), 'dd/MM/yyyy')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gst-report-${selectedMonth}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">GST Reports</h1>
          <p className="text-muted-foreground">GST collected and paid summaries</p>
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
            <CardTitle className="text-2xl text-green-600">₹{gstData.summary.totalCollected.toFixed(2)}</CardTitle>
            <CardDescription>GST Collected</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-blue-600">₹{gstData.summary.totalPaid.toFixed(2)}</CardTitle>
            <CardDescription>GST Paid</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-2xl ${gstData.summary.netPayable >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{Math.abs(gstData.summary.netPayable).toFixed(2)}
            </CardTitle>
            <CardDescription>
              {gstData.summary.netPayable >= 0 ? 'Net Payable' : 'Net Refund'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            GST Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">₹{gstData.summary.totalCollected.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total GST Collected</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">₹{gstData.summary.totalPaid.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total GST Paid</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${
              gstData.summary.netPayable >= 0 
                ? 'bg-red-50 dark:bg-red-900/20' 
                : 'bg-green-50 dark:bg-green-900/20'
            }`}>
              <div className={`text-2xl font-bold ${
                gstData.summary.netPayable >= 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                ₹{Math.abs(gstData.summary.netPayable).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                {gstData.summary.netPayable >= 0 ? 'Net GST Payable' : 'Net GST Refund'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            GST Collected (Sales)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={collectedColumns} data={gstData.collected} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            GST Paid (Purchases)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={paidColumns} data={gstData.paid} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GSTReports;
