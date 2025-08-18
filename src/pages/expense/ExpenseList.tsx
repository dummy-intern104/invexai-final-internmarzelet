
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Receipt, 
  Download, 
  Filter,
  Calendar,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

// Mock data for expenses
const mockExpenses = [
  {
    id: "1",
    expenseNo: "EXP-001",
    date: "2024-01-15",
    category: "Office Supplies",
    vendor: "Office Depot",
    amount: 150.50,
    description: "Printer paper and ink cartridges",
    paymentMethod: "Credit Card",
    status: "recorded"
  },
  {
    id: "2",
    expenseNo: "EXP-002",
    date: "2024-01-14",
    category: "Utilities",
    vendor: "Electric Company",
    amount: 450.00,
    description: "Monthly electricity bill",
    paymentMethod: "Bank Transfer",
    status: "recorded"
  },
  {
    id: "3",
    expenseNo: "EXP-003",
    date: "2024-01-13",
    category: "Marketing",
    vendor: "Google Ads",
    amount: 300.00,
    description: "Digital advertising campaign",
    paymentMethod: "Credit Card",
    status: "recorded"
  }
];

const ExpenseList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const categories = [...new Set(mockExpenses.map(expense => expense.category))];

  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.expenseNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    const matchesDate = !dateFilter || expense.date.includes(dateFilter);
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleExport = (format: 'excel' | 'pdf') => {
    toast.success(`Exporting to ${format.toUpperCase()}...`);
    // Export logic would go here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Expense List</h1>
            <p className="text-muted-foreground">View and manage all business expenses</p>
          </div>
        </div>
        <Button onClick={() => navigate("/expense/new")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Expense
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{filteredExpenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{mockExpenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="month"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-48"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Expense No</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Vendor</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Payment Method</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{expense.expenseNo}</td>
                    <td className="p-4">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Badge variant="secondary">{expense.category}</Badge>
                    </td>
                    <td className="p-4">{expense.vendor}</td>
                    <td className="p-4">{expense.description}</td>
                    <td className="p-4 font-medium">₹{expense.amount.toFixed(2)}</td>
                    <td className="p-4">{expense.paymentMethod}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {expense.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Expenses Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || categoryFilter !== "all" || dateFilter 
                  ? "No expenses match your search criteria." 
                  : "No expenses have been recorded yet."}
              </p>
              <Button onClick={() => navigate("/expense/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Record First Expense
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseList;
