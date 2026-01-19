'use client';

import * as React from 'react';
import { IconCircleFilled } from '@tabler/icons-react';
import { checkApiHealth } from '@/actions/health';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type HealthStatus = 'checking' | 'healthy' | 'degraded' | 'offline';

export function HealthIndicator() {
  const [status, setStatus] = React.useState<HealthStatus>('checking');
  const [details, setDetails] = React.useState<string>('Checking API status...');

  React.useEffect(() => {
    const checkHealth = async () => {
      const result = await checkApiHealth();

      if (result.success) {
        if (result.health.status === 'ok' && result.health.database === 'ok') {
          setStatus('healthy');
          setDetails('API is healthy');
        } else {
          setStatus('degraded');
          setDetails(
            `API: ${result.health.status}, Database: ${result.health.database}`
          );
        }
      } else {
        setStatus('offline');
        setDetails(`API unreachable: ${result.error}`);
      }
    };

    // Check immediately
    checkHealth();

    // Poll every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusColors: Record<HealthStatus, string> = {
    checking: 'text-muted-foreground animate-pulse',
    healthy: 'text-green-500',
    degraded: 'text-yellow-500',
    offline: 'text-red-500',
  };

  const statusLabels: Record<HealthStatus, string> = {
    checking: 'Checking...',
    healthy: 'Connected',
    degraded: 'Degraded',
    offline: 'Offline',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
            <IconCircleFilled className={`h-2 w-2 ${statusColors[status]}`} />
            <span>API: {statusLabels[status]}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{details}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
