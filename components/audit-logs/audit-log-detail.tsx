"use client"

import { useState } from "react"
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
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import type { AuditLogEntry } from "@/types"

// Event icon component - defined outside render to avoid static component errors
function EventIcon({ action, resourceType, className }: { action: string; resourceType: string | null; className?: string }) {
  if (action === 'started_stream') return <IconPlayerPlay className={className} />;
  if (action === 'login') return <IconLogin className={className} />;
  if (action === 'logout') return <IconLogout className={className} />;

  if (resourceType === 'broadcaster') {
    if (action === 'create') return <IconUserPlus className={className} />;
    if (action === 'update') return <IconUserEdit className={className} />;
    if (action === 'delete') return <IconUserMinus className={className} />;
  }

  if (resourceType === 'stream_key') {
    if (action === 'create') return <IconKey className={className} />;
    if (action === 'update') return <IconKey className={className} />;
    if (action === 'delete') return <IconKeyOff className={className} />;
  }

  return <IconQuestionMark className={className} />;
}

// Get event label
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

// Mask stream key value
function maskKeyValue(keyValue: string): string {
  if (keyValue.length <= 4) return keyValue;
  return `••••${keyValue.slice(-4)}`;
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

interface AuditLogDetailProps {
  entry: AuditLogEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetail({ entry, open, onOpenChange }: AuditLogDetailProps) {
  const [showFullMetadata, setShowFullMetadata] = useState(false);

  if (!entry) return null;

  const eventLabel = getEventLabel(entry.action, entry.resource_type);
  const timestamp = new Date(entry.timestamp);
  const isSuccess = entry.outcome === 'success';

  // Extract useful info from metadata
  const metadata = entry.metadata || {};
  const keyValue = metadata.key_value as string | undefined;
  const keyName = metadata.key_name as string | undefined;
  const broadcasterName = metadata.broadcaster_name as string | undefined;
  const displayName = metadata.display_name as string | undefined;

  // Stringify metadata for display
  const metadataString = JSON.stringify(metadata, null, 2);
  const isMetadataLong = metadataString.length > 200;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <EventIcon action={entry.action} resourceType={entry.resource_type} className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>{eventLabel}</SheetTitle>
              <SheetDescription>
                {format(timestamp, "MMMM d, yyyy 'at' HH:mm:ss")}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge variant={isSuccess ? "default" : "destructive"} className="gap-1">
              {isSuccess ? (
                <IconCheck className="h-3 w-3" />
              ) : (
                <IconX className="h-3 w-3" />
              )}
              {isSuccess ? 'Success' : 'Failed'}
            </Badge>
            {!isSuccess && entry.failure_reason && (
              <span className="text-sm text-destructive">{entry.failure_reason}</span>
            )}
          </div>

          <Separator />

          {/* Basic Info */}
          <div className="grid gap-4">
            <DetailRow label="User / Actor" value={entry.actor || "System"} />
            <DetailRow label="IP Address" value={entry.ip_address} />
            <DetailRow
              label="Request"
              value={`${entry.request_method} ${entry.request_path}`}
            />
            {entry.request_id && (
              <DetailRow label="Request ID" value={entry.request_id} />
            )}
          </div>

          <Separator />

          {/* Resource Info */}
          {(entry.resource_type || entry.resource_id) && (
            <>
              <div className="grid gap-4">
                {entry.resource_type && (
                  <DetailRow label="Resource Type" value={entry.resource_type} />
                )}
                {entry.resource_id && (
                  <DetailRow
                    label={entry.resource_type === 'stream' ? 'Stream ID' : 'Resource ID'}
                    value={
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {entry.resource_id}
                      </code>
                    }
                  />
                )}
              </div>
              <Separator />
            </>
          )}

          {/* Stream Key Details */}
          {entry.resource_type === 'stream_key' && (
            <>
              <div className="grid gap-4">
                {keyName && <DetailRow label="Key Name" value={keyName} />}
                {keyValue && (
                  <DetailRow
                    label="Key Value (Masked)"
                    value={
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {maskKeyValue(keyValue)}
                      </code>
                    }
                  />
                )}
                {broadcasterName && (
                  <DetailRow label="Broadcaster" value={broadcasterName} />
                )}
              </div>
              <Separator />
            </>
          )}

          {/* Broadcaster Details */}
          {entry.resource_type === 'broadcaster' && displayName && (
            <>
              <div className="grid gap-4">
                <DetailRow label="Broadcaster Name" value={displayName} />
              </div>
              <Separator />
            </>
          )}

          {/* Metadata */}
          {Object.keys(metadata).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Metadata</span>
                {isMetadataLong && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullMetadata(!showFullMetadata)}
                  >
                    {showFullMetadata ? (
                      <>
                        <IconChevronUp className="mr-1 h-4 w-4" />
                        Show less
                      </>
                    ) : (
                      <>
                        <IconChevronDown className="mr-1 h-4 w-4" />
                        Show more
                      </>
                    )}
                  </Button>
                )}
              </div>
              <pre
                className={`text-xs bg-muted p-3 rounded-lg overflow-x-auto ${
                  isMetadataLong && !showFullMetadata ? 'max-h-32 overflow-hidden' : ''
                }`}
              >
                {metadataString}
              </pre>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
