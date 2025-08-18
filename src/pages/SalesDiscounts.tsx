
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Percent, Plus, Edit, Trash2 } from "lucide-react";

interface Discount {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount: number;
  maxDiscount?: number;
  status: "active" | "inactive";
  validUntil: string;
}

const SalesDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Discounts & Offers</h1>
        <p className="text-muted-foreground">Manage discount schemes and promotional offers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {discounts.filter(d => d.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">This Month Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹0.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">-</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Discount Management
              </CardTitle>
              <CardDescription>
                Create and manage discount offers for your customers
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Discount
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {discounts.length === 0 ? (
            <div className="text-center py-12">
              <Percent className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No discounts found</h3>
              <p className="text-gray-500 mb-4">
                Create your first discount offer to get started
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Discount
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Discount Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Min Amount</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell className="font-medium">
                        {discount.name}
                      </TableCell>
                      <TableCell className="capitalize">{discount.type}</TableCell>
                      <TableCell>
                        {discount.type === "percentage" 
                          ? `${discount.value}%` 
                          : `₹${discount.value}`}
                      </TableCell>
                      <TableCell>₹{discount.minAmount}</TableCell>
                      <TableCell>
                        {new Date(discount.validUntil).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(discount.status)}>
                          {discount.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Discount Calculator</CardTitle>
          <CardDescription>Calculate discount amounts for sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="originalAmount">Original Amount (₹)</Label>
                <Input
                  id="originalAmount"
                  type="number"
                  placeholder="Enter original amount"
                />
              </div>
              <div>
                <Label htmlFor="discountPercent">Discount (%)</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  placeholder="Enter discount percentage"
                />
              </div>
              <Button className="w-full">Calculate Discount</Button>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Calculation Result</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Original Amount:</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount Amount:</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Final Amount:</span>
                  <span>₹0.00</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDiscounts;
