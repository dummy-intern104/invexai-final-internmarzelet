import { AIInsight, ChartData, Inventory, InventoryAnalysis, Product, Sale, Supplier } from "@/types";

// Mock Products - Updated to match new Product interface
export const mockProducts: Product[] = [
  { id: "1", product_id: 1, product_name: "Laptop", category: "Electronics", price: 999.99, units: "piece", reorder_level: 5, created_at: "2024-01-15T10:30:00Z", user_id: "mock-user" },
  { id: "2", product_id: 2, product_name: "Smartphone", category: "Electronics", price: 599.99, units: "piece", reorder_level: 10, created_at: "2024-01-20T11:45:00Z", user_id: "mock-user" },
  { id: "3", product_id: 3, product_name: "Desk Chair", category: "Furniture", price: 149.99, units: "piece", reorder_level: 8, created_at: "2024-01-25T09:15:00Z", user_id: "mock-user" },
  { id: "4", product_id: 4, product_name: "Coffee Maker", category: "Appliances", price: 79.99, units: "piece", reorder_level: 12, created_at: "2024-02-01T14:20:00Z", user_id: "mock-user" },
  { id: "5", product_id: 5, product_name: "Wireless Headphones", category: "Electronics", price: 129.99, units: "piece", reorder_level: 15, created_at: "2024-02-05T16:10:00Z", user_id: "mock-user" },
];

// Mock Suppliers
export const mockSuppliers: Supplier[] = [
  { supplier_id: 1, supplier_name: "Tech Solutions Inc.", contact_person: "John Smith", phone: "555-123-4567", email: "john@techsolutions.com", address: "123 Tech Blvd, Silicon Valley, CA", created_at: "2024-01-10T08:00:00Z" },
  { supplier_id: 2, supplier_name: "Furniture Depot", contact_person: "Emma Johnson", phone: "555-987-6543", email: "emma@furnituredepot.com", address: "456 Furniture Ave, Design District, NY", created_at: "2024-01-12T10:30:00Z" },
  { supplier_id: 3, supplier_name: "Appliance World", contact_person: "Michael Brown", phone: "555-456-7890", email: "michael@applianceworld.com", address: "789 Appliance St, Home Goods Plaza, IL", created_at: "2024-01-15T09:45:00Z" },
];

// Mock Inventory
export const mockInventory: Inventory[] = [
  { inventory_id: 1, product_id: 1, quantity_in_stock: 25, last_updated: "2024-02-15T14:30:00Z", product: mockProducts[0] },
  { inventory_id: 2, product_id: 2, quantity_in_stock: 50, last_updated: "2024-02-16T11:20:00Z", product: mockProducts[1] },
  { inventory_id: 3, product_id: 3, quantity_in_stock: 15, last_updated: "2024-02-17T09:45:00Z", product: mockProducts[2] },
  { inventory_id: 4, product_id: 4, quantity_in_stock: 30, last_updated: "2024-02-18T16:10:00Z", product: mockProducts[3] },
  { inventory_id: 5, product_id: 5, quantity_in_stock: 45, last_updated: "2024-02-19T10:30:00Z", product: mockProducts[4] },
];

// Mock Sales
export const mockSales: Sale[] = [
  { sale_id: 1, product_id: 1, quantity_sold: 2, selling_price: 999.99, sale_date: "2024-02-06T10:30:00Z", product: mockProducts[0] },
  { sale_id: 2, product_id: 2, quantity_sold: 3, selling_price: 599.99, sale_date: "2024-02-07T14:15:00Z", product: mockProducts[1] },
  { sale_id: 3, product_id: 3, quantity_sold: 1, selling_price: 149.99, sale_date: "2024-02-08T11:45:00Z", product: mockProducts[2] },
  { sale_id: 4, product_id: 4, quantity_sold: 5, selling_price: 79.99, sale_date: "2024-02-09T16:20:00Z", product: mockProducts[3] },
  { sale_id: 5, product_id: 5, quantity_sold: 2, selling_price: 129.99, sale_date: "2024-02-10T09:30:00Z", product: mockProducts[4] },
  { sale_id: 6, product_id: 1, quantity_sold: 1, selling_price: 999.99, sale_date: "2024-02-11T13:10:00Z", product: mockProducts[0] },
  { sale_id: 7, product_id: 2, quantity_sold: 2, selling_price: 599.99, sale_date: "2024-02-12T15:45:00Z", product: mockProducts[1] },
  { sale_id: 8, product_id: 3, quantity_sold: 3, selling_price: 149.99, sale_date: "2024-02-13T10:20:00Z", product: mockProducts[2] },
  { sale_id: 9, product_id: 4, quantity_sold: 2, selling_price: 79.99, sale_date: "2024-02-14T14:30:00Z", product: mockProducts[3] },
  { sale_id: 10, product_id: 5, quantity_sold: 4, selling_price: 129.99, sale_date: "2024-02-15T11:15:00Z", product: mockProducts[4] },
];

// Mock Inventory Analysis
export const mockInventoryAnalysis: InventoryAnalysis[] = [
  {
    analysis_id: 1,
    product_id: 1,
    seasonal_demand_prediction: "Expected 15% increase in Q4",
    weekly_sales_trend: "Steady growth, 3% week-over-week",
    festival_event_demand: "25% spike expected during Black Friday",
    expiry_based_recommendation: "N/A for electronics",
    supplier_price_trend: "Stable, no significant changes in the last quarter",
    stock_optimization_alert: "Consider ordering 10 more units by October 1st",
    competitor_price_monitoring: "Competitor X reduced prices by 5% last week",
    analysis_date: "2024-02-15T00:00:00Z",
    product: mockProducts[0]
  },
  {
    analysis_id: 2,
    product_id: 2,
    seasonal_demand_prediction: "Expected 20% increase during summer",
    weekly_sales_trend: "Increasing, 5% week-over-week",
    festival_event_demand: "30% spike expected during holiday season",
    expiry_based_recommendation: "N/A for electronics",
    supplier_price_trend: "Slight increase of 2% expected next month",
    stock_optimization_alert: "Current stock levels optimal",
    competitor_price_monitoring: "Competitor Y launched a similar product at 10% higher price point",
    analysis_date: "2024-02-15T00:00:00Z",
    product: mockProducts[1]
  },
];

// Mock Monthly Sales Data
export const mockMonthlySalesData: ChartData[] = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
  { name: "Jul", value: 7000 },
  { name: "Aug", value: 8000 },
  { name: "Sep", value: 7500 },
  { name: "Oct", value: 9000 },
  { name: "Nov", value: 10000 },
  { name: "Dec", value: 12000 },
];

// Mock Weekly Demand Data
export const mockWeeklyDemandData: ChartData[] = [
  { name: "Mon", value: 1200 },
  { name: "Tue", value: 1400 },
  { name: "Wed", value: 1100 },
  { name: "Thu", value: 1300 },
  { name: "Fri", value: 1700 },
  { name: "Sat", value: 1900 },
  { name: "Sun", value: 1000 },
];

// Mock AI Insights
export const mockAIInsights: AIInsight[] = [
  {
    title: "Low stock alert",
    description: "Laptop stock is approaching reorder level. Consider placing an order within the next 7 days.",
    type: "warning"
  },
  {
    title: "Price optimization",
    description: "Increase Smartphone price by 5% to optimize profit margin based on current market demand.",
    type: "info"
  },
  {
    title: "Sales trend detected",
    description: "Coffee Maker sales are up 15% this month, indicating growing demand in this category.",
    type: "success"
  },
  {
    title: "Seasonal pattern identified",
    description: "Prepare for increased Wireless Headphones demand approaching the holiday season.",
    type: "info"
  },
];
