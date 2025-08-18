
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SecurityBadgeProps {
  level: "high" | "medium" | "low";
  className?: string;
}

const SecurityBadge = ({ level, className }: SecurityBadgeProps) => {
  const getSecurityConfig = (level: string) => {
    switch (level) {
      case "high":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          text: "High Security"
        };
      case "medium":
        return {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          text: "Medium Security"
        };
      case "low":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          text: "Low Security"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
          text: "Unknown Security"
        };
    }
  };

  const config = getSecurityConfig(level);

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} border-current ${className || ""}`}
    >
      <Shield className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  );
};

export default SecurityBadge;
