
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, TrendingUp, DollarSign, FileText, Building } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabaseService } from '@/services/supabaseService';
import { format, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';

const ExpenseReports = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.expenses.getAll();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // Calculate summary metrics
  const filteredExpenses = Array.isArray(expenses) ? expenses.filter((expense) => {
    const expenseDate = parseISO(expense.expense_date);
    const matchesDateRange = !dateRange || 
      (!dateRange.from || expenseDate >= dateRange.from) &&
      (!dateRange.to || expenseDate <= dateRange.to);
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesDateRange && matchesCategory;
  }) : [];

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const totalTransactions = filteredExpenses.length;
  const uniqueCategories = [...new Set(filteredExpenses.map(expense => expense.category))];
  const averageExpense = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

  // Group expenses by category
  const categoryBreakdown = uniqueCategories.map(category => {
    const categoryExpenses = filteredExpenses.filter(expense => expense.category === category);
    const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    return {
      category,
      total: categoryTotal,
      count: categoryExpenses.length,
      percentage: totalAmount > 0 ? (categoryTotal / totalAmount) * 100 : 0
    };
  }).sort((a, b) => b.total - a.total);

  const handleExportData = () => {
    const csvData = filteredExpenses.map(expense => ({
      Date: format(parseISO(expense.expense_date), 'yyyy-MM-dd'),
      Category: expense.category,
      Description: expense.description,
      Amount: expense.amount,
      'Payment Method': expense.payment_method || 'N/A'
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Expense report exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Expense Reports</h1>
          <p className="text-muted-foreground">
            Analyze your business expenses and spending patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportData} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCategories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round(averageExpense).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown by Category</CardTitle>
          <CardDescription>
            View your expenses organized by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryBreakdown.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{category.category}</div>
                  <Badge variant="secondary">{category.count} transactions</Badge>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{category.total.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {category.percentage.toFixed(1)}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>
            Latest expense transactions matching your filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No expenses found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No expenses match your current filters.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {filteredExpenses.slice(0, 10).map((expense, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {format(parseISO(expense.expense_date), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">{expense.category}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ₹{expense.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseReports;
