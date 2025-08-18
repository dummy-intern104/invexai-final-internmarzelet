
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  expenseCount: number;
}

const ExpenseCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Office Supplies",
      description: "Stationery, equipment, and office materials",
      color: "blue",
      expenseCount: 12
    },
    {
      id: "2",
      name: "Travel",
      description: "Business travel expenses and transportation",
      color: "green",
      expenseCount: 8
    },
    {
      id: "3",
      name: "Marketing",
      description: "Advertising and promotional expenses",
      color: "purple",
      expenseCount: 5
    }
  ]);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "blue"
  });

  const colors = [
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "red", label: "Red" },
    { value: "yellow", label: "Yellow" },
    { value: "pink", label: "Pink" }
  ];

  const getColorClass = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      purple: "bg-purple-100 text-purple-800",
      red: "bg-red-100 text-red-800",
      yellow: "bg-yellow-100 text-yellow-800",
      pink: "bg-pink-100 text-pink-800"
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color,
      expenseCount: 0
    };

    setCategories(prev => [...prev, category]);
    setNewCategory({ name: "", description: "", color: "blue" });
    setIsAddingCategory(false);
    toast.success("Category added successfully");
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success("Category deleted successfully");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/expense")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Expenses
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Expense Categories</h1>
          <p className="text-gray-600">Manage your expense categories</p>
        </div>
        <Button onClick={() => setIsAddingCategory(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isAddingCategory && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="categoryColor">Color</Label>
                <select
                  id="categoryColor"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {colors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="categoryDescription">Description</Label>
                <Input
                  id="categoryDescription"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter category description"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button onClick={handleAddCategory}>Add Category</Button>
              <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Badge className={getColorClass(category.color)}>
                    {category.expenseCount} expenses
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpenseCategory;
