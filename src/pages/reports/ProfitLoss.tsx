
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart } from '@/components/charts/BarChart';
import { Download, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import useAppStore from '@/store/appStore';
import { format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';

const ProfitLoss = () => {
  const { sales } = useAppStore();
  const [period, setPeriod] = useState('month');
  const [selectedPeriod, setSelectedPeriod] = useState(format(new Date(), 'yyyy-MM'));
  const [profitLossData, setProfitLossData] = useState({
    revenue: 0,
    expenses: 0,
    grossProfit: 0,
    netProfit: 0,
    profitMargin: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let startDate, endDate;
    
    if (period === 'month') {
      const [year, month] = selectedPeriod.split('-');
      startDate = startOfMonth(new Date(parseInt(year), parseInt(month) - 1));
      endDate = endOfMonth(startDate);
    } else if (period === 'quarter') {
      const [year, quarter] = selectedPeriod.split('-Q');
      const quarterStart = new Date(parseInt(year), (parseInt(quarter) - 1) * 3);
      startDate = startOfQuarter(quarterStart);
      endDate = endOfQuarter(quarterStart);
    } else if (period === 'year') {
      const year = parseInt(selectedPeriod);
      startDate = startOfYear(new Date(year, 0));
      endDate = endOfYear(startDate);
    }

    // Calculate revenue from sales using sale_date
    const periodSales = sales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate >= startDate && saleDate <= endDate;
    });
    
    const totalRevenue = periodSales.reduce((sum, sale) => sum + (sale.selling_price * sale.quantity_sold), 0);

    // Mock expenses data
    const mockExpenses = 5000;
    const totalExpenses = mockExpenses;
    
    // Calculate profit metrics
    const grossProfit = totalRevenue - totalExpenses;
    const netProfit = grossProfit;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    setProfitLossData({
      revenue: totalRevenue,
      expenses: totalExpenses,
      grossProfit,
      netProfit,
      profitMargin
    });

    // Prepare chart data
    setChartData([
      { name: 'Revenue', amount: totalRevenue, type: 'income' },
      { name: 'Expenses', amount: totalExpenses, type: 'expense' },
      { name: 'Net Profit', amount: netProfit, type: netProfit >= 0 ? 'profit' : 'loss' }
    ]);
  }, [sales, period, selectedPeriod]);

  const getPeriodOptions = () => {
    if (period === 'month') {
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const value = format(date, 'yyyy-MM');
        const label = format(date, 'MMMM yyyy');
        return { value, label };
      });
    } else if (period === 'quarter') {
      return Array.from({ length: 8 }, (_, i) => {
        const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
        const currentYear = new Date().getFullYear();
        let quarter = currentQuarter - (i % 4);
        let year = currentYear - Math.floor(i / 4);
        
        if (quarter <= 0) {
          quarter += 4;
          year -= 1;
        }
        
        return {
          value: `${year}-Q${quarter}`,
          label: `Q${quarter} ${year}`
        };
      });
    } else {
      return Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return {
          value: year.toString(),
          label: year.toString()
        };
      });
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Metric', 'Amount'],
      ['Revenue', profitLossData.revenue],
      ['Expenses', profitLossData.expenses],
      ['Gross Profit', profitLossData.grossProfit],
      ['Net Profit', profitLossData.netProfit],
      ['Profit Margin (%)', profitLossData.profitMargin.toFixed(2)]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-loss-${selectedPeriod}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profit & Loss Report</h1>
          <p className="text-muted-foreground">Revenue and expense analysis</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                {getPeriodOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-600">₹{profitLossData.revenue.toLocaleString()}</CardTitle>
            <CardDescription>Total Revenue</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-600">₹{profitLossData.expenses.toLocaleString()}</CardTitle>
            <CardDescription>Total Expenses</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-blue-600">₹{profitLossData.grossProfit.toLocaleString()}</CardTitle>
            <CardDescription>Gross Profit</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-2xl flex items-center gap-2 ${profitLossData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitLossData.netProfit >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              ₹{Math.abs(profitLossData.netProfit).toLocaleString()}
            </CardTitle>
            <CardDescription>Net Profit</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-2xl ${profitLossData.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitLossData.profitMargin.toFixed(1)}%
            </CardTitle>
            <CardDescription>Profit Margin</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <BarChart
              data={chartData}
              dataKey="amount"
              xAxisDataKey="name"
              fill="#8b5cf6"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitLoss;
