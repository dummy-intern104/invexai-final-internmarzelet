
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Calendar, User, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock data for now - in a real app this would come from a hook or API
const mockOrders = [
  {
    id: "1",
    orderNo: "PO-123456",
    supplierName: "ABC Suppliers",
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-25",
    totalAmount: 15000,
    status: "pending",
    paymentStatus: "pending",
    paymentMode: "pending",
    items: [
      { name: "Product 1", quantity: 10, price: 1000 },
      { name: "Product 2", quantity: 5, price: 1000 }
    ]
  },
  {
    id: "2", 
    orderNo: "PO-123457",
    supplierName: "XYZ Corp",
    orderDate: "2024-01-16",
    expectedDelivery: "2024-01-26",
    totalAmount: 25000,
    status: "completed",
    paymentStatus: "paid",
    paymentMode: "upi",
    items: [
      { name: "Product 3", quantity: 20, price: 1250 }
    ]
  }
];

export function PurchaseOrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(mockOrders);

  const handleMarkAsCompleted = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: "completed", paymentStatus: "paid" }
          : order
      )
    );
    toast.success("Purchase order marked as completed");
  };

  const handleCreateReturn = (order: any) => {
    navigate("/purchases/returns/create", {
      state: {
        returnData: {
          orderNo: order.orderNo,
          supplierName: order.supplierName,
          items: order.items,
          totalAmount: order.totalAmount
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Purchase Orders</h2>
          <p className="text-gray-600">Manage your purchase orders</p>
        </div>
        <Button onClick={() => navigate("/purchases/orders/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No purchase orders</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new purchase order.</p>
          <div className="mt-6">
            <Button onClick={() => navigate("/purchases/orders/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Purchase Order
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.orderNo}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant={order.status === "completed" ? "default" : "secondary"}
                      >
                        {order.status}
                      </Badge>
                      {order.status === "pending" && order.paymentMode === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsCompleted(order.id)}
                          className="ml-2"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{order.supplierName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Order: {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {order.expectedDelivery && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Expected: {new Date(order.expectedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    <strong>Payment Mode:</strong> {order.paymentMode}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Items:</strong> {order.items.length}
                  </div>
                  
                  <div className="text-lg font-semibold pt-2 border-t">
                    Total: ₹{order.totalAmount.toFixed(2)}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateReturn(order)}
                      className="flex-1"
                    >
                      Create Return
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
