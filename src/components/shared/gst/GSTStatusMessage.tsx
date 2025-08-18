
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface GSTStatusMessageProps {
  message: { type: 'success' | 'error'; text: string } | null;
  lastLookedUpGST: string;
}

export const GSTStatusMessage: React.FC<GSTStatusMessageProps> = ({
  message,
  lastLookedUpGST
}) => {
  return (
    <>
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {lastLookedUpGST && (
        <div className="text-sm text-muted-foreground">
          <p>Last lookup: {lastLookedUpGST}</p>
          <p className="mt-1">
            <span className="text-blue-600">Tip:</span> You can manually edit any auto-populated fields below if needed.
          </p>
        </div>
      )}
    </>
  );
};
