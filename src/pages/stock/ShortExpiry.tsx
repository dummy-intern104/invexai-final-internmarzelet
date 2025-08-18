
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock, Package } from "lucide-react";
import useAppStore from "@/store/appStore";

const ShortExpiry = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expiryThreshold, setExpiryThreshold] = useState("30"); // days
  const products = useAppStore((state) => state.products);

  // For demo purposes, we'll simulate expiry dates for some products
  // In a real application, this would come from the product data
  const getExpiryDate = (productId: number) => {
    const baseDate = new Date();
    const randomDays = Math.floor(Math.random() * 60) + 1; // 1-60 days
    baseDate.setDate(baseDate.getDate() + randomDays);
    return baseDate;
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter products with short expiry (simulated for demo)
  const shortExpiryProducts = products
    .filter((product) => {
      const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
      const units = parseInt(product.units as string, 10);
      return matchesSearch && units > 0;
    })
    .map((product) => ({
      ...product,
      expiryDate: getExpiryDate(product.product_id),
    }))
    .filter((product) => {
      const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
      return daysUntilExpiry <= parseInt(expiryThreshold);
    })
    .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());

  const getUrgencyLevel = (days: number) => {
    if (days <= 7) return "critical";
    if (days <= 14) return "high";
    return "medium";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8 text-orange-500" />
            Short Expiry
          </h1>
          <p className="text-muted-foreground">
            Products expiring within the selected threshold
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {shortExpiryProducts.length} Items
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={expiryThreshold} onValueChange={setExpiryThreshold}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Expiry threshold" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Next 7 days</SelectItem>
            <SelectItem value="14">Next 14 days</SelectItem>
            <SelectItem value="30">Next 30 days</SelectItem>
            <SelectItem value="60">Next 60 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortExpiryProducts.map((product) => {
          const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
          const urgency = getUrgencyLevel(daysUntilExpiry);
          
          return (
            <Card key={product.product_id} className="hover:shadow-md transition-shadow border-l-4 border-l-orange-400">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-lg">{product.product_name}</CardTitle>
                  </div>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expires:</span>
                    <span className="text-sm font-medium">
                      {product.expiryDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Days Left:</span>
                    <Badge className={getUrgencyColor(urgency)}>
                      {daysUntilExpiry} days
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Stock:</span>
                    <span className="text-sm">{product.units} units</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="font-semibold">₹{product.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {shortExpiryProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Items Expiring Soon</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? "No products match your search criteria." 
                : `No products are expiring within the next ${expiryThreshold} days.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShortExpiry;
