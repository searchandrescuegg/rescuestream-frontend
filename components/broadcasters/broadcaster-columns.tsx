"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Broadcaster } from "@/types"

interface ColumnActions {
  onEdit: (broadcaster: Broadcaster) => void
  onDelete: (broadcaster: Broadcaster) => void
}

export function getBroadcasterColumns(actions: ColumnActions): ColumnDef<Broadcaster>[] {
  return [
    {
      accessorKey: "display_name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.display_name}</div>
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
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {format(new Date(row.original.updated_at), "MMM d, yyyy")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
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
            <DropdownMenuItem onClick={() => actions.onEdit(row.original)}>
              <IconPencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => actions.onDelete(row.original)}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
