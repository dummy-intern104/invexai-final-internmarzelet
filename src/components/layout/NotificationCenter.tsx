
import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import useAppStore from "@/store/appStore";

interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  count?: number;
  action?: {
    label: string;
    href: string;
  };
  timestamp: Date;
}

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { 
    products, 
    getExpiringProducts, 
    getExpiredProducts, 
    payments 
  } = useAppStore();

  // Generate notifications based on current data
  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = [];
    
    // Low stock alerts
    const lowStockItems = products.filter(product => 
      parseInt(product.units as string) < product.reorder_level
    );
    
    if (lowStockItems.length > 0) {
      notifications.push({
        id: 'low-stock',
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${lowStockItems.length} products are running low on stock`,
        count: lowStockItems.length,
        action: {
          label: 'View Products',
          href: '/products'
        },
        timestamp: new Date()
      });
    }
    
    // Expiring products
    const expiringSoonItems = getExpiringProducts(7);
    if (expiringSoonItems.length > 0) {
      notifications.push({
        id: 'expiring-soon',
        type: 'warning',
        title: 'Products Expiring Soon',
        message: `${expiringSoonItems.length} products will expire within 7 days`,
        count: expiringSoonItems.length,
        action: {
          label: 'View Expiring',
          href: '/expiry?filter=expiring'
        },
        timestamp: new Date()
      });
    }
    
    // Expired products
    const expiredItems = getExpiredProducts();
    if (expiredItems.length > 0) {
      notifications.push({
        id: 'expired',
        type: 'error',
        title: 'Expired Products',
        message: `${expiredItems.length} products have already expired`,
        count: expiredItems.length,
        action: {
          label: 'View Expired',
          href: '/expiry?filter=expired'
        },
        timestamp: new Date()
      });
    }
    
    // Pending payments
    const pendingPayments = payments.filter(payment => payment.status === 'pending');
    if (pendingPayments.length > 0) {
      notifications.push({
        id: 'pending-payments',
        type: 'info',
        title: 'Pending Payments',
        message: `${pendingPayments.length} payments are pending collection`,
        count: pendingPayments.length,
        action: {
          label: 'View Payments',
          href: '/payments'
        },
        timestamp: new Date()
      });
    }
    
    return notifications.sort((a, b) => {
      // Sort by priority: error > warning > info > success
      const priorityOrder = { error: 0, warning: 1, info: 2, success: 3 };
      return priorityOrder[a.type] - priorityOrder[b.type];
    });
  };

  const notifications = generateNotifications();
  const totalNotifications = notifications.reduce((sum, notification) => sum + (notification.count || 1), 0);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.action) {
      navigate(notification.action.href);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      case 'success': return '🟢';
      default: return '📢';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {totalNotifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalNotifications > 99 ? '99+' : totalNotifications}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {notification.count && (
                            <Badge variant="outline" className="text-xs">
                              {notification.count}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        {notification.action && (
                          <Button variant="link" className="h-auto p-0 text-xs">
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
