
import React from 'react';
import { Calculator, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EstimatesHeaderProps {
  onCreateEstimate: () => void;
}

export function EstimatesHeader({ onCreateEstimate }: EstimatesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Calculator className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">
          Estimates
        </h1>
      </div>
      <Button onClick={onCreateEstimate}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create New Estimate
      </Button>
    </div>
  );
}
