
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart } from '@/components/charts/BarChart';
import { Download, Calendar, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import useAppStore from '@/store/appStore';
import { format, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';

const YearlySales = () => {
  const { sales } = useAppStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
  const [previousYearComparison, setPreviousYearComparison] = useState(null);

  useEffect(() => {
    const year = parseInt(selectedYear);
    const startDate = startOfYear(new Date(year, 0, 1));
    const endDate = endOfYear(startDate);

    // Filter sales by selected year using sale_date
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate >= startDate && saleDate <= endDate;
    });

    setYearlyData(filteredSales);

    // Calculate monthly breakdown
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    const monthlyBreakdown = months.map(month => {
      const monthSales = filteredSales.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        return saleDate.getMonth() === month.getMonth();
      });
      return {
        month: format(month, 'MMM'),
        sales: monthSales.reduce((sum, sale) => sum + (sale.selling_price * sale.quantity_sold), 0),
        count: monthSales.length
      };
    });
    setMonthlyBreakdown(monthlyBreakdown);

    // Compare with previous year
    const prevYearStart = startOfYear(new Date(year - 1, 0, 1));
    const prevYearEnd = endOfYear(prevYearStart);
    const prevYearSales = sales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate >= prevYearStart && saleDate <= prevYearEnd;
    });

    const currentYearTotal = filteredSales.reduce((sum, sale) => sum + (sale.selling_price * sale.quantity_sold), 0);
    const prevYearTotal = prevYearSales.reduce((sum, sale) => sum + (sale.selling_price * sale.quantity_sold), 0);
    const growthPercentage = prevYearTotal > 0 ? ((currentYearTotal - prevYearTotal) / prevYearTotal) * 100 : 0;

    setPreviousYearComparison({
      current: currentYearTotal,
      previous: prevYearTotal,
      growth: growthPercentage
    });
  }, [sales, selectedYear]);

  const totalSales = yearlyData.reduce((sum, sale) => sum + (sale.selling_price * sale.quantity_sold), 0);
  const totalInvoices = yearlyData.length;

  const exportToCSV = () => {
    const csvContent = [
      ['Month', 'Sales Amount', 'Sales Count'],
      ...monthlyBreakdown.map(month => [
        month.month,
        month.sales,
        month.count
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yearly-sales-${selectedYear}.csv`;
    a.click();
  };

  const availableYears = Array.from(new Set(sales.map(sale => new Date(sale.sale_date).getFullYear())))
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Yearly Sales Report</h1>
          <p className="text-muted-foreground">Annual sales overview and comparisons</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
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

        {previousYearComparison && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={`text-2xl flex items-center gap-2 ${previousYearComparison.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {previousYearComparison.growth >= 0 ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                {Math.abs(previousYearComparison.growth).toFixed(1)}%
              </CardTitle>
              <CardDescription>vs Previous Year</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Sales Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <BarChart
              data={monthlyBreakdown}
              dataKey="sales"
              xAxisDataKey="month"
              fill="#3b82f6"
            />
          </div>
        </CardContent>
      </Card>

      {previousYearComparison && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Year ({selectedYear})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                ₹{previousYearComparison.current.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Previous Year ({parseInt(selectedYear) - 1})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">
                ₹{previousYearComparison.previous.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default YearlySales;
