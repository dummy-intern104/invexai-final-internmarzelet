
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { BarChart } from '@/components/charts/BarChart';
import { Download, Tags, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { expenseService, expenseCategoryService } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';

const ExpenseReports = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDataTo] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['expense-categories'],
    queryFn: expenseCategoryService.getAll,
  });

  useEffect(() => {
    let filtered = [...expenses];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category_id === selectedCategory);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(expense => new Date(expense.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(expense => new Date(expense.date) <= new Date(dateTo));
    }

    setFilteredExpenses(filtered);

    // Calculate category-wise expenses
    const categoryTotals = categories.map(category => {
      const categoryExpenses = filtered.filter(expense => expense.category_id === category.id);
      const total = categoryExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      return {
        category: category.name,
        total,
        count: categoryExpenses.length
      };
    }).filter(item => item.total > 0);

    setCategoryData(categoryTotals);

    // Calculate trend data based on selected period
    if (selectedPeriod === 'month') {
      const monthlyData = {};
      filtered.forEach(expense => {
        const month = format(new Date(expense.date), 'MMM yyyy');
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += Number(expense.amount);
      });
      
      const trendArray = Object.entries(monthlyData).map(([month, total]) => ({
        period: month,
        amount: total
      }));
      setTrendData(trendArray);
    } else if (selectedPeriod === 'quarter') {
      const quarterlyData = {};
      filtered.forEach(expense => {
        const date = new Date(expense.date);
        const quarter = `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
        if (!quarterlyData[quarter]) {
          quarterlyData[quarter] = 0;
        }
        quarterlyData[quarter] += Number(expense.amount);
      });
      
      const trendArray = Object.entries(quarterlyData).map(([quarter, total]) => ({
        period: quarter,
        amount: total
      }));
      setTrendData(trendArray);
    }
  }, [expenses, categories, selectedCategory, selectedPeriod, dateFrom, dateTo]);

  const columns = [
    {
      accessorKey: 'title',
      header: 'Description',
    },
    {
      accessorKey: 'expense_categories',
      header: 'Category',
      cell: ({ row }: any) => row.original.expense_categories?.name || 'Uncategorized',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }: any) => `₹${Number(row.getValue('amount')).toLocaleString()}`,
    },
    {
      accessorKey: 'payment_method',
      header: 'Payment Method',
      cell: ({ row }: any) => row.getValue('payment_method') || 'Cash',
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }: any) => format(new Date(row.getValue('date')), 'dd/MM/yyyy'),
    },
  ];

  const exportToCSV = () => {
    const csvContent = [
      ['Description', 'Category', 'Amount', 'Payment Method', 'Date'],
      ...filteredExpenses.map(expense => [
        expense.title,
        expense.expense_categories?.name || 'Uncategorized',
        expense.amount,
        expense.payment_method || 'Cash',
        format(new Date(expense.date), 'dd/MM/yyyy')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense-reports.csv';
    a.click();
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const averageExpense = filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading expense reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expense Reports</h1>
          <p className="text-muted-foreground">Expense trends and analysis by category</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="quarter">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                onChange={(e) => setDataTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSelectedCategory('all');
                setDateFrom('');
                setDataTo('');
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{filteredExpenses.length}</CardTitle>
            <CardDescription>Total Expenses</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{totalExpenses.toLocaleString()}</CardTitle>
            <CardDescription>Total Amount</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{averageExpense.toFixed(0)}</CardTitle>
            <CardDescription>Average Expense</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{categoryData.length}</CardTitle>
            <CardDescription>Active Categories</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {categoryData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="w-5 h-5" />
                Category-wise Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart
                  data={categoryData}
                  dataKey="total"
                  xAxisDataKey="category"
                  fill="#f59e0b"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Expense Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart
                  data={trendData}
                  dataKey="amount"
                  xAxisDataKey="period"
                  fill="#ef4444"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredExpenses} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseReports;
