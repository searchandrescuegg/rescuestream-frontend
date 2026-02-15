"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  IconPlayerPlay,
  IconLogin,
  IconLogout,
  IconKey,
  IconKeyOff,
  IconUserPlus,
  IconUserEdit,
  IconUserMinus,
  IconQuestionMark,
  IconCheck,
  IconX,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import type { AuditLogEntry } from "@/types"

// Event type to icon mapping
const EVENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  started_stream: IconPlayerPlay,
  login: IconLogin,
  logout: IconLogout,
  create: IconKey,
  update: IconKey,
  delete: IconKeyOff,
}

// Resource type specific icons for create/update/delete
function getEventIcon(action: string, resourceType: string | null) {
  if (action === 'started_stream') return IconPlayerPlay;
  if (action === 'login') return IconLogin;
  if (action === 'logout') return IconLogout;

  if (resourceType === 'broadcaster') {
    if (action === 'create') return IconUserPlus;
    if (action === 'update') return IconUserEdit;
    if (action === 'delete') return IconUserMinus;
  }

  if (resourceType === 'stream_key') {
    if (action === 'create') return IconKey;
    if (action === 'update') return IconKey;
    if (action === 'delete') return IconKeyOff;
  }

  return EVENT_ICONS[action] || IconQuestionMark;
}

// Get display label for event type
function getEventLabel(action: string, resourceType: string | null): string {
  if (action === 'started_stream') return 'Stream Started';
  if (action === 'login') return 'User Login';
  if (action === 'logout') return 'User Logout';

  const resourceLabel = resourceType === 'stream_key' ? 'Stream Key' :
                        resourceType === 'broadcaster' ? 'Broadcaster' :
                        resourceType || 'Resource';

  if (action === 'create') return `${resourceLabel} Created`;
  if (action === 'update') return `${resourceLabel} Updated`;
  if (action === 'delete') return `${resourceLabel} Deleted`;

  return action;
}

// Get summary from metadata
function getSummary(entry: AuditLogEntry): string {
  const { action, resource_type, resource_id, metadata } = entry;

  // For stream events, show stream ID
  if (action === 'started_stream' && resource_id) {
    return `Stream ${resource_id.slice(0, 8)}...`;
  }

  // For key events, show key info from metadata
  if (resource_type === 'stream_key' && metadata) {
    const keyName = metadata.key_name as string | undefined;
    if (keyName) return keyName;
    if (resource_id) return `Key ${resource_id.slice(0, 8)}...`;
  }

  // For broadcaster events
  if (resource_type === 'broadcaster' && metadata) {
    const displayName = metadata.display_name as string | undefined;
    if (displayName) return displayName;
    if (resource_id) return `Broadcaster ${resource_id.slice(0, 8)}...`;
  }

  // Fallback
  if (resource_id) return `${resource_id.slice(0, 8)}...`;
  return entry.request_path;
}

export function getAuditLogColumns(): ColumnDef<AuditLogEntry>[] {
  return [
    {
      accessorKey: "timestamp",
      header: "Time",
      cell: ({ row }) => {
        const timestamp = new Date(row.original.timestamp);
        return (
          <div className="text-sm">
            <div className="font-medium">
              {format(timestamp, "MMM d, yyyy")}
            </div>
            <div className="text-muted-foreground text-xs">
              {format(timestamp, "HH:mm:ss")}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Event Type",
      cell: ({ row }) => {
        const { action, resource_type } = row.original;
        const Icon = getEventIcon(action, resource_type);
        const label = getEventLabel(action, resource_type);

        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "actor",
      header: "User",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.actor || "System"}
        </div>
      ),
    },
    {
      id: "summary",
      header: "Details",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
          {getSummary(row.original)}
        </div>
      ),
    },
    {
      accessorKey: "outcome",
      header: "Status",
      cell: ({ row }) => {
        const isSuccess = row.original.outcome === 'success';
        return (
          <Badge variant={isSuccess ? "default" : "destructive"} className="gap-1">
            {isSuccess ? (
              <IconCheck className="h-3 w-3" />
            ) : (
              <IconX className="h-3 w-3" />
            )}
            {isSuccess ? 'Success' : 'Failed'}
          </Badge>
        );
      },
    },
  ];
}
