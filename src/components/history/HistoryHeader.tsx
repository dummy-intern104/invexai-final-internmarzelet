
import { TrendingUp } from "lucide-react";

export const HistoryHeader = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        Transaction History
      </h1>
      <p className="text-muted-foreground mt-1">
        View and analyze your complete sales transaction history
      </p>
    </div>
  );
};
