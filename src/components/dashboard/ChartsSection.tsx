
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiLineChart } from "@/components/charts/MultiLineChart";
import { BarChart } from "@/components/charts/BarChart";
import { Sale, Product } from "@/types";

interface ChartsSectionProps {
  sales: Sale[];
  products: Product[];
  todaysPurchases: number;
}

export const ChartsSection = ({ sales, products, todaysPurchases }: ChartsSectionProps) => {
  const prepareDailySalesData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayRevenue = sales
        .filter(sale => new Date(sale.sale_date).toDateString() === date.toDateString())
        .reduce((sum, sale) => sum + (sale.selling_price * sale.quantity_sold), 0);
      
      // Mock purchase data for visualization
      const dayPurchases = i === 0 ? todaysPurchases : Math.random() * 20000;
      
      last7Days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: dayRevenue,
        purchases: dayPurchases
      });
    }
    
    return last7Days;
  };

  const revenueByCategoryData = (() => {
    const categoryRevenue = new Map();
    
    sales.forEach(sale => {
      const product = products.find(p => p.product_id === sale.product_id);
      const category = product?.category || 'Unknown';
      const revenue = sale.selling_price * sale.quantity_sold;
      
      categoryRevenue.set(category, (categoryRevenue.get(category) || 0) + revenue);
    });
    
    return Array.from(categoryRevenue.entries())
      .filter(([name, sales]) => sales > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, sales]) => ({ name, sales }));
  })();

  const dailyData = prepareDailySalesData();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Real-time Data Visualization</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales vs Purchases Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <div className="h-[300px]">
              <MultiLineChart 
                data={dailyData} 
                xAxisDataKey="name" 
                lines={[
                  { dataKey: "sales", stroke: "#4f46e5", name: "Sales" },
                  { dataKey: "purchases", stroke: "#ef4444", name: "Purchases" }
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <div className="h-[300px]">
              <BarChart 
                data={revenueByCategoryData} 
                xAxisDataKey="name" 
                dataKey="sales"
                fill="#10b981"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
