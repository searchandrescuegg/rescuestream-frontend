"use client"

import { useState } from "react"
import { IconLoader } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBroadcaster, updateBroadcaster } from "@/actions/broadcasters"
import type { Broadcaster } from "@/types"

interface BroadcasterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  broadcaster?: Broadcaster | null
  onSuccess: () => void
}

export function BroadcasterDialog({
  open,
  onOpenChange,
  broadcaster,
  onSuccess,
}: BroadcasterDialogProps) {
  const [displayName, setDisplayName] = useState(broadcaster?.display_name ?? "")
  const [isLoading, setIsLoading] = useState(false)

  const isEditing = !!broadcaster

  // Reset form when dialog opens with new broadcaster
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && broadcaster) {
      setDisplayName(broadcaster.display_name)
    } else if (newOpen && !broadcaster) {
      setDisplayName("")
    }
    onOpenChange(newOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName.trim()) {
      toast.error("Name is required")
      return
    }

    setIsLoading(true)

    try {
      if (isEditing && broadcaster) {
        const result = await updateBroadcaster(broadcaster.id, {
          display_name: displayName.trim(),
        })
        if (result.success) {
          toast.success("Broadcaster updated")
          onSuccess()
          onOpenChange(false)
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createBroadcaster({
          display_name: displayName.trim(),
        })
        if (result.success) {
          toast.success("Broadcaster created")
          onSuccess()
          onOpenChange(false)
        } else {
          toast.error(result.error)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Broadcaster" : "Add Broadcaster"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the broadcaster details."
                : "Create a new broadcaster for your streams."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="display_name">Name</Label>
              <Input
                id="display_name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Field Team Alpha"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
