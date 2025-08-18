
import React from 'react';
import { Truck, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DeliveryEmptyStateProps {
  onCreateChallan: () => void;
}

export function DeliveryEmptyState({ onCreateChallan }: DeliveryEmptyStateProps) {
  return (
    <Card className="p-6">
      <div className="text-center py-16">
        <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Delivery Challans Yet</h2>
        <p className="text-muted-foreground mb-6">
          Create delivery challans to track product shipments to your customers.
        </p>
        <Button onClick={onCreateChallan}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Delivery Challan
        </Button>
      </div>
    </Card>
  );
}
