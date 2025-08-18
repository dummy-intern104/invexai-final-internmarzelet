
import React from 'react';

export function DeliveryAboutSection() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">About Delivery Challans</h2>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li>Create delivery challans for customer orders</li>
        <li>Track products being shipped to customers</li>
        <li>Record delivery status and confirmation</li>
        <li>Convert challans to invoices whenever needed</li>
        <li>Print delivery receipts for your delivery team</li>
      </ul>
    </div>
  );
}
