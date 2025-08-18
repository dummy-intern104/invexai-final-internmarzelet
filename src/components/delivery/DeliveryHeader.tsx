
import React from 'react';
import { Truck, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeliveryHeaderProps {
  onCreateChallan: () => void;
}

export function DeliveryHeader({ onCreateChallan }: DeliveryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Truck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">
          Delivery Management
        </h1>
      </div>
      <Button onClick={onCreateChallan}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Delivery Challan
      </Button>
    </div>
  );
}
