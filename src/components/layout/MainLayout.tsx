import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import DesktopSidebar from "./DesktopSidebar";
import MobileNavigation from "./MobileNavigation";
import { DataSyncStatus } from "./DataSyncStatus";
import NotificationCenter from "./NotificationCenter";
import { SidebarItemType } from "./types";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  CreditCard,
  Users,
  BarChart3,
  FileText,
  Truck,
  Calendar,
  ShoppingBag,
  Plus,
  List,
  RotateCcw,
  UsersIcon,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle,
  Receipt,
  FolderOpen,
  Tags,
  FileBarChart,
  TrendingUp,
  DollarSign,
  Building,
  MessageSquare,
  Keyboard
} from "lucide-react";
import useAppStore from "@/store/appStore";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const clearLocalData = useAppStore(state => state.clearLocalData);

  // Initialize global keyboard shortcuts with proper cleanup
  useKeyboardShortcuts();


  // Memoize sidebar items to prevent recreation on every render - Only Dashboard and Keywords remain
  const sidebarItems: SidebarItemType[] = useMemo(() => [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/dashboard" }, // 1
    { icon: <Keyboard className="w-5 h-5" />, label: "Keywords", href: "/keywords" }, // 15
  ], []);

  // Memoize dropdown items to prevent recreation on every render - All sections in exact order
  const dropdownItems = useMemo(() => [
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Sales", // 2
      items: [
        { icon: <Plus className="w-4 h-4" />, label: "New Invoice", href: "/sales/invoices/new" },
        { icon: <List className="w-4 h-4" />, label: "Invoice List", href: "/sales/invoices" },
        { icon: <RotateCcw className="w-4 h-4" />, label: "Sales Returns", href: "/sales/returns" },
        { icon: <UsersIcon className="w-4 h-4" />, label: "Customers", href: "/clients" },
      ]
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Products", // 3
      items: [
        { icon: <Package className="w-4 h-4" />, label: "View Products", href: "/products" },
        { icon: <Plus className="w-4 h-4" />, label: "Add Product", href: "/add-product" },
        { icon: <List className="w-4 h-4" />, label: "Product List", href: "/products" },
        { icon: <BarChart3 className="w-4 h-4" />, label: "Product Reports", href: "/reports/stock" },
      ]
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Purchases", // 4
      items: [
        { icon: <Plus className="w-4 h-4" />, label: "New Purchase", href: "/purchases/orders" },
        { icon: <List className="w-4 h-4" />, label: "Purchase List", href: "/purchases/list" },
        { icon: <RotateCcw className="w-4 h-4" />, label: "Purchase Returns", href: "/purchases/returns" },
        { icon: <UsersIcon className="w-4 h-4" />, label: "Supplier Management", href: "/purchases/suppliers" },
      ]
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Expiry", // 5
      items: [
        { icon: <Calendar className="w-4 h-4" />, label: "View Expiry", href: "/expiry" },
        { icon: <Plus className="w-4 h-4" />, label: "Add Expiry", href: "/add-expiry" },
        { icon: <List className="w-4 h-4" />, label: "Expiry List", href: "/expiry" },
        { icon: <AlertTriangle className="w-4 h-4" />, label: "Expiry Alerts", href: "/expiry" },
      ]
    },
    {
      icon: <History className="w-5 h-5" />,
      label: "History", // 6
      items: [
        { icon: <History className="w-4 h-4" />, label: "Transaction History", href: "/history" },
        { icon: <List className="w-4 h-4" />, label: "Activity Log", href: "/history" },
        { icon: <BarChart3 className="w-4 h-4" />, label: "History Reports", href: "/history" },
        { icon: <Clock className="w-4 h-4" />, label: "Recent Activity", href: "/history" },
      ]
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: "Payments", // 7
      items: [
        { icon: <CreditCard className="w-4 h-4" />, label: "View Payments", href: "/payments" },
        { icon: <Plus className="w-4 h-4" />, label: "Add Payment", href: "/add-payment" },
        { icon: <List className="w-4 h-4" />, label: "Payment List", href: "/payments" },
        { icon: <Receipt className="w-4 h-4" />, label: "Payment Reports", href: "/payments" },
      ]
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Clients", // 8
      items: [
        { icon: <Users className="w-4 h-4" />, label: "View Clients", href: "/clients" },
        { icon: <Plus className="w-4 h-4" />, label: "Add Client", href: "/add-client" },
        { icon: <List className="w-4 h-4" />, label: "Client List", href: "/clients" },
        { icon: <BarChart3 className="w-4 h-4" />, label: "Client Reports", href: "/clients" },
      ]
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      label: "Expense", // 9
      items: [
        { icon: <Plus className="w-4 h-4" />, label: "Expense New", href: "/expense/new" },
        { icon: <List className="w-4 h-4" />, label: "Expense List", href: "/expense/list" },
        { icon: <Tags className="w-4 h-4" />, label: "Expense Category", href: "/expense/category" },
        { icon: <FolderOpen className="w-4 h-4" />, label: "Category List", href: "/expense/category-list" },
      ]
    },
    {
      icon: <FileBarChart className="w-5 h-5" />,
      label: "Reports", // 10
      items: [
        { icon: <TrendingUp className="w-4 h-4" />, label: "Daily Sales", href: "/reports/daily-sales" },
        { icon: <BarChart3 className="w-4 h-4" />, label: "Monthly Sales", href: "/reports/monthly-sales" },
        { icon: <FileText className="w-4 h-4" />, label: "Yearly Sales", href: "/reports/yearly-sales" },
        { icon: <RotateCcw className="w-4 h-4" />, label: "Sales Returns", href: "/reports/sales-returns" },
        { icon: <ShoppingBag className="w-4 h-4" />, label: "Purchase Returns", href: "/reports/purchase-returns" },
        { icon: <Package className="w-4 h-4" />, label: "Stock Reports", href: "/reports/stock" },
        { icon: <DollarSign className="w-4 h-4" />, label: "Profit & Loss", href: "/reports/profit-loss" },
        { icon: <Receipt className="w-4 h-4" />, label: "GST Reports", href: "/reports/gst" },
        { icon: <Building className="w-4 h-4" />, label: "Supplier Reports", href: "/reports/suppliers" },
        { icon: <Tags className="w-4 h-4" />, label: "Expense Reports", href: "/reports/expenses" },
      ]
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Estimates", // 11
      items: [
        { icon: <FileText className="w-4 h-4" />, label: "View Estimates", href: "/estimates/view" },
        { icon: <Plus className="w-4 h-4" />, label: "Create Estimate", href: "/create-estimate" },
        { icon: <List className="w-4 h-4" />, label: "Estimate List", href: "/estimates" },
        { icon: <BarChart3 className="w-4 h-4" />, label: "Estimate Reports", href: "/estimates" },
      ]
    },
    {
      icon: <Truck className="w-5 h-5" />,
      label: "Delivery", // 12
      items: [
        { icon: <Truck className="w-4 h-4" />, label: "View Delivery", href: "/delivery" },
        { icon: <Plus className="w-4 h-4" />, label: "Create Challan", href: "/create-challan" },
        { icon: <List className="w-4 h-4" />, label: "Delivery List", href: "/delivery" },
        { icon: <BarChart3 className="w-4 h-4" />, label: "Delivery Reports", href: "/delivery" },
      ]
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Stock", // 13
      items: [
        { icon: <CheckCircle className="w-4 h-4" />, label: "In Stock", href: "/stock/in-stock" },
        { icon: <AlertTriangle className="w-4 h-4" />, label: "Low Stock", href: "/stock/low-stock" },
        { icon: <AlertCircle className="w-4 h-4" />, label: "Stock Out", href: "/stock/stock-out" },
        { icon: <Clock className="w-4 h-4" />, label: "Short Expiry", href: "/stock/short-expiry" },
        { icon: <AlertTriangle className="w-4 h-4" />, label: "Expiry", href: "/stock/expiry" },
      ]
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Support", // 14
      items: [
        { icon: <AlertCircle className="w-4 h-4" />, label: "Complaint Raise", href: "/support/complaint-raise" },
        { icon: <Clock className="w-4 h-4" />, label: "Complaint Status", href: "/support/complaint-status" },
        { icon: <MessageSquare className="w-4 h-4" />, label: "Feedback", href: "/support/feedback" },
        { icon: <Users className="w-4 h-4" />, label: "Customer Care", href: "/support/customer-care" },
      ]
    }
  ], []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      console.log("[LAYOUT] Logout triggered");
      await clearLocalData();
    } catch (error) {
      console.error("[LAYOUT] Error during logout:", error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* DataSyncStatus positioned at top of sidebar with proper z-index */}
      <div className="fixed top-3 left-4 z-40 hidden md:block">
        <DataSyncStatus />
      </div>
      
      <DesktopSidebar
        sidebarItems={sidebarItems}
        dropdownItems={dropdownItems}
        currentPath={location.pathname}
        theme={theme as 'light' | 'dark'}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
      
      <div className="md:ml-64">
        {/* NotificationCenter positioned in top right corner with proper z-index */}
        <div className="fixed top-2 right-4 z-40">
          <NotificationCenter />
        </div>
        
        {/* Main content area with proper spacing and no overlapping elements */}
        <main className="p-6 min-h-screen">
          {children}
        </main>
      </div>

      <MobileNavigation
        sidebarItems={sidebarItems}
        dropdownItems={dropdownItems}
        currentPath={location.pathname}
        theme={theme as 'light' | 'dark'}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default MainLayout;
