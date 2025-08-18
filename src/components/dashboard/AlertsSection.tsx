
import { Bell, AlertTriangle, Calendar, CreditCard } from "lucide-react";
import { CardStat } from "@/components/ui/card-stat";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Product, Payment, ProductExpiry } from "@/types";

interface AlertsSectionProps {
  products: Product[];
  payments: Payment[];
  inventory?: any[];
  productExpiries?: ProductExpiry[];
}

export const AlertsSection = ({ 
  products, 
  payments, 
  inventory = [], 
  productExpiries = [] 
}: AlertsSectionProps) => {
  const navigate = useNavigate();

  console.log("AlertsSection: Input data:", {
    productsCount: products.length,
    paymentsCount: payments.length,
    inventoryCount: inventory.length,
    expiryCount: productExpiries.length
  });

  // Calculate low stock items using inventory data
  const lowStockItems = inventory.filter(item => {
    const isLowStock = item.current_stock <= item.reorder_level && item.reorder_level > 0;
    console.log(`AlertsSection: ${item.product_name} - Stock: ${item.current_stock}, Reorder: ${item.reorder_level}, Low Stock: ${isLowStock}`);
    return isLowStock;
  }).length;

  // Calculate expiring soon items (next 7 days)
  const expiringSoonItems = productExpiries.filter(expiry => {
    if (expiry.status !== 'active') return false;
    
    const expiryDate = new Date(expiry.expiry_date);
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    const isExpiringSoon = expiryDate >= today && expiryDate <= sevenDaysFromNow;
    console.log(`AlertsSection: ${expiry.product_name} - Expiry: ${expiry.expiry_date}, Expiring Soon: ${isExpiringSoon}`);
    return isExpiringSoon;
  }).length;

  // Calculate expired items
  const expiredItems = productExpiries.filter(expiry => {
    if (expiry.status !== 'active') return false;
    
    const expiryDate = new Date(expiry.expiry_date);
    const today = new Date();
    
    const isExpired = expiryDate < today;
    console.log(`AlertsSection: ${expiry.product_name} - Expiry: ${expiry.expiry_date}, Expired: ${isExpired}`);
    return isExpired;
  }).length;

  // Calculate credit dues (pending payments)
  const creditDues = payments.filter(payment => payment.status === 'pending').length;

  console.log("AlertsSection: Calculated alerts:", {
    lowStockItems,
    expiringSoonItems,
    expiredItems,
    creditDues
  });

  const alertStats = [
    {
      title: "Low Stock Alert",
      value: lowStockItems,
      icon: <AlertTriangle className="h-5 w-5 text-warning" />,
      onClick: () => navigate("/products/low-stock"),
      urgent: lowStockItems > 0,
    },
    {
      title: "Expiring Soon",
      value: expiringSoonItems,
      icon: <Calendar className="h-5 w-5 text-orange-500" />,
      onClick: () => navigate("/expiry?filter=expiring"),
      urgent: expiringSoonItems > 0,
    },
    {
      title: "Expired Items",
      value: expiredItems,
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
      onClick: () => navigate("/expiry?filter=expired"),
      urgent: expiredItems > 0,
    },
    {
      title: "Credit Dues",
      value: creditDues,
      icon: <CreditCard className="h-5 w-5 text-red-500" />,
      onClick: () => navigate("/payments"),
      urgent: creditDues > 0,
    },
  ];

  const totalAlerts = lowStockItems + expiringSoonItems + expiredItems + creditDues;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-warning" />
        <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
        {totalAlerts > 0 && (
          <Badge variant="destructive" className="ml-2">
            {totalAlerts} alerts
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {alertStats.map((stat, index) => (
          <CardStat
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            onClick={stat.onClick}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              stat.urgent ? 'border-red-200 bg-red-50 dark:bg-red-950/20' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
};
