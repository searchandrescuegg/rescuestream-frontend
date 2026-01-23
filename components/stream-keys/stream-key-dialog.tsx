"use client"

import { useState } from "react"
import { IconCopy, IconLoader, IconCheck } from "@tabler/icons-react"
import { QRCodeSVG } from "qrcode.react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createStreamKey } from "@/actions/stream-keys"
import type { Broadcaster, StreamKey } from "@/types"

interface StreamKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  broadcasters: Broadcaster[]
  onSuccess: () => void
}

export function StreamKeyDialog({
  open,
  onOpenChange,
  broadcasters,
  onSuccess,
}: StreamKeyDialogProps) {
  const [broadcasterId, setBroadcasterId] = useState("")
  const [expiresInDays, setExpiresInDays] = useState("30")
  const [isLoading, setIsLoading] = useState(false)
  const [createdKey, setCreatedKey] = useState<StreamKey | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedRtmp, setCopiedRtmp] = useState(false)

  // Get RTMP ingest URL from environment, defaulting to localhost for development
  const rtmpIngestUrl = process.env.NEXT_PUBLIC_RTMP_INGEST_URL || "rtmp://localhost:1935"

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setBroadcasterId("")
      setExpiresInDays("30")
      setCreatedKey(null)
      setCopied(false)
    }
    onOpenChange(newOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!broadcasterId) {
      toast.error("Please select a broadcaster")
      return
    }

    setIsLoading(true)

    try {
      const expiresAt = expiresInDays !== "never"
        ? new Date(Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000).toISOString()
        : undefined

      const result = await createStreamKey({
        broadcaster_id: broadcasterId,
        expires_at: expiresAt,
      })

      if (result.success) {
        setCreatedKey(result.streamKey)
        onSuccess()
      } else {
        toast.error(result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!createdKey?.key_value) return

    await navigator.clipboard.writeText(createdKey.key_value)
    setCopied(true)
    toast.success("Stream key copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyRtmp = async () => {
    if (!createdKey?.key_value) return

    const fullRtmpUrl = `${rtmpIngestUrl}/${createdKey.key_value}`
    await navigator.clipboard.writeText(fullRtmpUrl)
    setCopiedRtmp(true)
    toast.success("RTMP URL copied to clipboard")
    setTimeout(() => setCopiedRtmp(false), 2000)
  }

  // Show created key view
  if (createdKey?.key_value) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Stream Key Created</DialogTitle>
            <DialogDescription>
              Copy this stream key now. It will not be shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Stream Key</Label>
              <div className="flex gap-2">
                <Input
                  value={createdKey.key_value}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <IconCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <IconCopy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Full RTMP URL</Label>
              <div className="flex gap-2">
                <Input
                  value={`${rtmpIngestUrl}/${createdKey.key_value}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyRtmp}
                >
                  {copiedRtmp ? (
                    <IconCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <IconCopy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>QR Code</Label>
              <div className="flex justify-center rounded-lg border bg-white p-4">
                <QRCodeSVG
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/k/${createdKey.key_value}`}
                  size={160}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Scan to open a page with the stream key
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Use the stream key or full RTMP URL with your streaming software
              (OBS, FFmpeg, etc.) to authenticate your stream.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => handleOpenChange(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Show create form
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Generate Stream Key</DialogTitle>
            <DialogDescription>
              Create a new stream key for a broadcaster.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="broadcaster">Broadcaster</Label>
              <Select value={broadcasterId} onValueChange={setBroadcasterId}>
                <SelectTrigger id="broadcaster">
                  <SelectValue placeholder="Select a broadcaster" />
                </SelectTrigger>
                <SelectContent>
                  {broadcasters.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expires">Expires In</Label>
              <Select value={expiresInDays} onValueChange={setExpiresInDays}>
                <SelectTrigger id="expires">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !broadcasterId}>
              {isLoading && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
              Generate Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
