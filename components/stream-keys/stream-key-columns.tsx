"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { IconDotsVertical, IconBan } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { StreamKey, Broadcaster } from "@/types"

interface StreamKeyWithBroadcaster extends StreamKey {
  broadcaster?: Broadcaster | null
}

interface ColumnActions {
  onRevoke: (streamKey: StreamKey) => void
}

function getStatusBadgeVariant(status: StreamKey["status"]) {
  switch (status) {
    case "active":
      return "default"
    case "revoked":
      return "destructive"
    case "expired":
      return "secondary"
    default:
      return "outline"
  }
}

export function getStreamKeyColumns(
  actions: ColumnActions,
  broadcasters: Broadcaster[]
): ColumnDef<StreamKeyWithBroadcaster>[] {
  const broadcasterMap = new Map(broadcasters.map((b) => [b.id, b]))

  return [
    {
      accessorKey: "id",
      header: "Key ID",
      cell: ({ row }) => (
        <div className="font-mono text-xs text-muted-foreground">
          {row.original.id.slice(0, 8)}...
        </div>
      ),
    },
    {
      accessorKey: "broadcaster_id",
      header: "Broadcaster",
      cell: ({ row }) => {
        const broadcaster = broadcasterMap.get(row.original.broadcaster_id)
        return (
          <div className="font-medium">
            {broadcaster?.display_name ?? "Unknown"}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusBadgeVariant(row.original.status)}>
          {row.original.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {format(new Date(row.original.created_at), "MMM d, yyyy")}
        </div>
      ),
    },
    {
      accessorKey: "expires_at",
      header: "Expires",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.expires_at
            ? format(new Date(row.original.expires_at), "MMM d, yyyy")
            : "Never"}
        </div>
      ),
    },
    {
      accessorKey: "last_used_at",
      header: "Last Used",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.last_used_at
            ? format(new Date(row.original.last_used_at), "MMM d, yyyy HH:mm")
            : "Never"}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        if (row.original.status !== "active") {
          return null
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => actions.onRevoke(row.original)}
              >
                <IconBan className="mr-2 h-4 w-4" />
                Revoke
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
