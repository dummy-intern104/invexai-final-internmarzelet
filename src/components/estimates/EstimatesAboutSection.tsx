
import React from 'react';

export function EstimatesAboutSection() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">About Estimates</h2>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li>Create detailed price quotes for potential customers</li>
        <li>Track estimate status (pending, accepted, rejected)</li>
        <li>Convert accepted estimates to invoices</li>
        <li>Set validity periods for your estimates</li>
        <li>Print professional estimate documents</li>
      </ul>
    </div>
  );
}
