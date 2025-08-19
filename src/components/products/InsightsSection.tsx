
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { TrendingUp } from 'lucide-react';

interface AIInsight {
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
}

interface InsightsSectionProps {
  insights?: AIInsight[];
}

const InsightsSection = ({ insights = [] }: InsightsSectionProps) => {
  const defaultInsights: AIInsight[] = [
    {
      title: "Stock Analysis",
      description: "Monitor your inventory levels and get alerts for low stock items.",
      type: "info"
    },
    {
      title: "Sales Trends", 
      description: "Track product performance and identify bestsellers.",
      type: "success"
    },
    {
      title: "Reorder Alerts",
      description: "Get notified when products need restocking.",
      type: "warning"
    }
  ];

  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          AI Insights
        </CardTitle>
        <CardDescription>
          Smart analytics and recommendations for your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayInsights.map((insight, index) => (
            <AIInsightCard
              key={index}
              title={insight.title}
              description={insight.description}
              type={insight.type}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsSection;
