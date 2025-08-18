
import { AIInsight } from "@/types";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  insight: AIInsight;
  className?: string;
}

export const AIInsightCard = ({ insight, className }: AIInsightCardProps) => {
  const { title, description, type } = insight;
  
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-info" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      default:
        return <Info className="w-5 h-5 text-info" />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'info':
        return 'bg-info/10';
      case 'warning':
        return 'bg-warning/10';
      case 'success':
        return 'bg-success/10';
      default:
        return 'bg-info/10';
    }
  };
  
  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all", 
      getBgColor(),
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {getIcon()}
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};
