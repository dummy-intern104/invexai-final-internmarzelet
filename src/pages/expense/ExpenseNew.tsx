
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ExpenseNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    paymentMethod: ""
  });

  const categories = [
    "Office Supplies",
    "Travel",
    "Meals & Entertainment",
    "Utilities",
    "Marketing",
    "Software & Subscriptions",
    "Equipment",
    "Other"
  ];

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "UPI",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to create expenses');
        return;
      }

      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          title: formData.title,
          amount: parseFloat(formData.amount),
          date: formData.date,
          payment_method: formData.paymentMethod || 'cash',
          notes: formData.description,
        });

      if (error) throw error;

      console.log("Creating expense:", formData);
      toast.success("Expense created successfully");
      navigate("/expense/list");
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to create expense');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/expense/list")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Expenses
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Expense Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter expense title"
                required
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Add any additional details..."
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/expense/list")}>
                Cancel
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Expense
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseNew;
