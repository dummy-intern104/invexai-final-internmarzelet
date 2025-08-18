
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Tags, 
  Edit,
  Trash2,
  FolderOpen
} from "lucide-react";
import { toast } from "sonner";

// Mock data for categories
const mockCategories = [
  {
    id: "1",
    name: "Office Supplies",
    description: "Stationery, equipment, and general office materials",
    color: "#3b82f6",
    expenseCount: 15,
    totalAmount: 2450.50,
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    name: "Utilities",
    description: "Electricity, water, internet, and other utility bills",
    color: "#ef4444",
    expenseCount: 8,
    totalAmount: 3600.00,
    createdAt: "2024-01-01"
  },
  {
    id: "3",
    name: "Marketing",
    description: "Advertising, promotions, and marketing campaigns",
    color: "#10b981",
    expenseCount: 12,
    totalAmount: 5200.00,
    createdAt: "2024-01-01"
  },
  {
    id: "4",
    name: "Travel",
    description: "Business travel, accommodation, and transportation",
    color: "#f59e0b",
    expenseCount: 6,
    totalAmount: 1800.00,
    createdAt: "2024-01-01"
  },
  {
    id: "5",
    name: "Equipment",
    description: "Computer hardware, machinery, and tools",
    color: "#8b5cf6",
    expenseCount: 4,
    totalAmount: 8500.00,
    createdAt: "2024-01-01"
  }
];

const CategoryList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = mockCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCategories = filteredCategories.length;
  const totalExpenses = filteredCategories.reduce((sum, cat) => sum + cat.expenseCount, 0);
  const totalAmount = filteredCategories.reduce((sum, cat) => sum + cat.totalAmount, 0);

  const handleEdit = (categoryId: string) => {
    toast.info(`Edit category ${categoryId} - Feature coming soon`);
  };

  const handleDelete = (categoryId: string) => {
    toast.error(`Delete category ${categoryId} - Feature coming soon`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Category List</h1>
            <p className="text-muted-foreground">Manage and edit expense categories</p>
          </div>
        </div>
        <Button onClick={() => navigate("/expense/category")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Categories</p>
                <p className="text-2xl font-bold">{totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">{totalExpenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-600 rounded" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{category.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expenses:</span>
                    <Badge variant="outline">{category.expenseCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Amount:</span>
                    <span className="font-semibold">₹{category.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="text-sm">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Tags className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Categories Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No categories match your search criteria." : "No expense categories have been created yet."}
            </p>
            <Button onClick={() => navigate("/expense/category")}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CategoryList;
