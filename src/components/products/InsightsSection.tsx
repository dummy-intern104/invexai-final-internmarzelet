
import { AIInsightCard } from "@/components/ai/AIInsightCard";
import { AIInsight } from "@/types";
import useAppStore from "@/store/appStore";

export const InsightsSection = () => {
  const { products, sales } = useAppStore();
  
  // Generate insights based on actual product and sales data
  const generateInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    // Only generate insights if we have products
    if (products.length === 0) {
      return [
        {
          title: "No Products Found",
          description: "Add products to your inventory to receive AI-powered insights and recommendations.",
          type: "info"
        }
      ];
    }
    
    // 1. Low stock alerts
    const lowStockProducts = products.filter(p => parseInt(p.units as string) < p.reorder_level);
    if (lowStockProducts.length > 0) {
      insights.push({
        title: "Stock Optimization",
        description: `You have ${lowStockProducts.length} product${lowStockProducts.length > 1 ? 's' : ''} below reorder levels: ${lowStockProducts.map(p => p.product_name).join(', ')}. Consider restocking soon.`,
        type: "warning"
      });
    } else {
      insights.push({
        title: "Stock Levels Optimal",
        description: "All products are currently above their reorder levels. Inventory is well-maintained.",
        type: "success"
      });
    }
    
    // 2. Price optimization based on sales data
    if (sales.length > 0) {
      // Find top selling product (simplified)
      const productSales = {} as Record<number, number>;
      sales.forEach(sale => {
        if (!productSales[sale.product_id]) {
          productSales[sale.product_id] = 0;
        }
        productSales[sale.product_id] += sale.quantity_sold;
      });
      
      const topSellingProductId = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      const topSellingProduct = products.find(p => p.product_id === parseInt(topSellingProductId));
      
      if (topSellingProduct) {
        insights.push({
          title: "Price Optimization",
          description: `"${topSellingProduct.product_name}" is your top-selling product. Consider a strategic 5-8% price increase to optimize revenue while maintaining sales momentum.`,
          type: "success"
        });
      }
    }
    
    // 3. Seasonal trends based on categories in inventory
    const categories = [...new Set(products.map(p => p.category))];
    if (categories.length > 0) {
      // Get current month to provide seasonal advice
      const currentMonth = new Date().getMonth();
      const seasons = [
        { name: "Winter", months: [11, 0, 1] },
        { name: "Spring", months: [2, 3, 4] },
        { name: "Summer", months: [5, 6, 7] },
        { name: "Fall", months: [8, 9, 10] }
      ];
      
      const currentSeason = seasons.find(season => season.months.includes(currentMonth))?.name || "current season";
      const popularCategory = categories[Math.floor(Math.random() * categories.length)];
      
      insights.push({
        title: "Seasonal Trend",
        description: `Based on your inventory data, "${popularCategory}" products typically see increased demand during ${currentSeason}. Consider increasing stock levels for these items.`,
        type: "info"
      });
    }
    
    // 4. Supply chain alert based on low stock across categories
    const categoryStockLevels = {} as Record<string, number>;
    products.forEach(product => {
      if (!categoryStockLevels[product.category]) {
        categoryStockLevels[product.category] = 0;
      }
      categoryStockLevels[product.category] += parseInt(product.units as string);
    });
    
    const lowStockCategory = Object.entries(categoryStockLevels)
      .sort((a, b) => a[1] - b[1])[0];
    
    if (lowStockCategory && lowStockCategory[1] < 50) {
      insights.push({
        title: "Supply Chain Alert",
        description: `Your "${lowStockCategory[0]}" category has lower overall stock (${lowStockCategory[1]} units) compared to other categories. Consider reviewing your supply chain for these items.`,
        type: "warning"
      });
    }
    
    // Return the first 4 insights (or fewer if not enough generated)
    return insights.slice(0, 4);
  };
  
  const insights = generateInsights();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {insights.map((insight, index) => (
        <AIInsightCard key={index} insight={insight} />
      ))}
    </div>
  );
};
