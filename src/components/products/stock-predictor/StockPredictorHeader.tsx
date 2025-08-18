
import React from "react";
import { Atom } from "lucide-react";

export const StockPredictorHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Atom className="h-5 w-5 text-primary" />
      <h2 className="text-xl font-semibold">Stock Predictor</h2>
    </div>
  );
};
