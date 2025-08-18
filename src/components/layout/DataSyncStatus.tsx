import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Cloud, CloudOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import useAppStore from '@/store/appStore';
import { isAutoSyncEnabled } from '@/store/realtimeSync';
type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline' | 'disabled';
export const DataSyncStatus: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const {
    currentUser
  } = useAppStore();
  useEffect(() => {
    // Check sync status
    const checkSyncStatus = () => {
      if (!currentUser) {
        setSyncStatus('offline');
        return;
      }
      if (!isAutoSyncEnabled()) {
        setSyncStatus('disabled');
        return;
      }

      // Listen for data sync events from console logs
      const originalLog = console.log;
      console.log = (...args) => {
        const message = args.join(' ');
        if (message.includes('[DATA-SYNC') || message.includes('[AUTO-SAVE')) {
          if (message.includes('error') || message.includes('Error')) {
            setSyncStatus('error');
          } else if (message.includes('Triggering auto-save') || message.includes('Starting save')) {
            setSyncStatus('syncing');
          } else if (message.includes('successfully saved') || message.includes('Successfully')) {
            setSyncStatus('synced');
            setLastSyncTime(new Date());
          }
        }
        originalLog.apply(console, args);
      };
      return () => {
        console.log = originalLog;
      };
    };
    const cleanup = checkSyncStatus();

    // Check status every 30 seconds
    const interval = setInterval(checkSyncStatus, 30000);
    return () => {
      cleanup?.();
      clearInterval(interval);
    };
  }, [currentUser]);
  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'synced':
        return <CheckCircle className="h-3 w-3" />;
      case 'error':
        return <AlertCircle className="h-3 w-3" />;
      case 'offline':
        return <CloudOff className="h-3 w-3" />;
      case 'disabled':
        return <Cloud className="h-3 w-3 opacity-50" />;
      default:
        return <Cloud className="h-3 w-3" />;
    }
  };
  const getSyncVariant = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'secondary';
      case 'synced':
        return 'default';
      case 'error':
        return 'destructive';
      case 'offline':
        return 'outline';
      case 'disabled':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  const getSyncMessage = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Saving changes...';
      case 'synced':
        return lastSyncTime ? `Last synced: ${lastSyncTime.toLocaleTimeString()}` : 'Data synced';
      case 'error':
        return 'Sync error - data backed up locally';
      case 'offline':
        return 'Not signed in - data stored locally';
      case 'disabled':
        return 'Auto-sync disabled - changes saved locally';
      default:
        return 'Checking sync status...';
    }
  };
  if (!currentUser && syncStatus !== 'offline') {
    return null;
  }
  return <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getSyncVariant()} className="flex items-center gap-1 text-xs mx-[160px]">
            {getSyncIcon()}
            <span className="hidden sm:inline">
              {syncStatus === 'syncing' ? 'Syncing' : syncStatus === 'synced' ? 'Synced' : syncStatus === 'error' ? 'Error' : syncStatus === 'offline' ? 'Offline' : 'Disabled'}
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getSyncMessage()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;
};