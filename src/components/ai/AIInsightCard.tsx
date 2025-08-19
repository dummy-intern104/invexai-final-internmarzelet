
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success';
  className?: string;
}

export const AIInsightCard = ({ title, description, type, className }: AIInsightCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-50';
      case 'warning':
        return 'bg-orange-50';
      case 'success':
        return 'bg-green-50';
      default:
        return 'bg-blue-50';
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
