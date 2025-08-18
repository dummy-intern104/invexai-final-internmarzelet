
import { cn } from "@/lib/utils";
import { CardProps } from "@/types";

export const CardStat = ({ 
  title, 
  value, 
  icon, 
  className, 
  children,
  onClick 
}: CardProps) => {
  console.log(`CardStat: ${title} = ${value}`);
  
  return (
    <div 
      className={cn(
        "bg-card p-5 rounded-lg border shadow-sm hover:shadow-md transition-all", 
        onClick && "cursor-pointer hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {children}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
