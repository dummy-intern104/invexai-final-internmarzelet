
import React from 'react';
import { Calculator, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EstimatesEmptyStateProps {
  onCreateEstimate: () => void;
}

export function EstimatesEmptyState({ onCreateEstimate }: EstimatesEmptyStateProps) {
  return (
    <Card className="p-6">
      <div className="text-center py-16">
        <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Estimates Yet</h2>
        <p className="text-muted-foreground mb-6">
          Create estimates to provide price quotes to your customers.
        </p>
        <Button onClick={onCreateEstimate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Estimate
        </Button>
      </div>
    </Card>
  );
}
