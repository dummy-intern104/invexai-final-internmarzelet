
import { Sale } from "@/types";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoryChartsProps {
  sales: Sale[];
  showAllTime?: boolean;
}

export function HistoryCharts({ sales, showAllTime = false }: HistoryChartsProps) {
  // Format data for charts
  const prepareChartData = () => {
    const salesByDate = new Map();
    const productSales = new Map();
    
    // Process sales data
    sales.forEach((sale) => {
      const saleDate = new Date(sale.sale_date);
      const dateStr = saleDate.toISOString().split('T')[0];
      
      // Aggregate data by date
      const existingSale = salesByDate.get(dateStr) || 0;
      salesByDate.set(dateStr, existingSale + sale.quantity_sold * sale.selling_price);
      
      // Aggregate data by product
      const productName = sale.product?.product_name || "Unknown Product";
      const existingProductSale = productSales.get(productName) || 0;
      productSales.set(productName, existingProductSale + sale.quantity_sold * sale.selling_price);
    });
    
    // Sort dates and prepare line chart data
    let sortedDates = Array.from(salesByDate.keys()).sort();
    
    // If not showing all time, limit to last 7 dates with data 
    // (removed this limit to show all data based on the user's request)
    if (!showAllTime && sortedDates.length > 7) {
      sortedDates = sortedDates.slice(-7);
    }
    
    const lineChartData = sortedDates.map((date) => {
      return {
        name: date,
        sales: salesByDate.get(date),
      };
    });
    
    // Sort products by sales volume and prepare bar chart data
    const sortedProducts = Array.from(productSales.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const barChartData = sortedProducts.map(([name, sales]) => {
      return {
        name,
        sales,
      };
    });
    
    return {
      lineChartData,
      barChartData,
    };
  };
  
  const { lineChartData, barChartData } = prepareChartData();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sales Trend {showAllTime ? '(All Time)' : '(Last 7 Days)'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <LineChart 
            data={lineChartData} 
            xAxisDataKey="name" 
            dataKey="sales" 
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <BarChart 
            data={barChartData} 
            xAxisDataKey="name" 
            dataKey="sales" 
          />
        </CardContent>
      </Card>
    </div>
  );
}
