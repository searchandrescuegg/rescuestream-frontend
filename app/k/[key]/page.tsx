"use client"

import { use, useState } from "react"
import { IconCopy, IconCheck } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ key: string }>
}

export default function StreamKeyPage({ params }: PageProps) {
  const { key } = use(params)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedRtmp, setCopiedRtmp] = useState(false)

  const rtmpIngestUrl = process.env.NEXT_PUBLIC_RTMP_INGEST_URL || "rtmp://localhost:1935"
  const fullRtmpUrl = `${rtmpIngestUrl}/${key}`

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(key)
    setCopiedKey(true)
    toast.success("Stream key copied")
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleCopyRtmp = async () => {
    await navigator.clipboard.writeText(fullRtmpUrl)
    setCopiedRtmp(true)
    toast.success("RTMP URL copied")
    setTimeout(() => setCopiedRtmp(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Stream Key</h1>
          <p className="text-sm text-muted-foreground">
            Use this key with your streaming software
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Stream Key</label>
            <div className="flex gap-2">
              <code className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm font-mono break-all">
                {key}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyKey}
              >
                {copiedKey ? (
                  <IconCheck className="h-4 w-4 text-green-600" />
                ) : (
                  <IconCopy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full RTMP URL</label>
            <div className="flex gap-2">
              <code className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm font-mono break-all">
                {fullRtmpUrl}
              </code>
              <Button
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
        </div>

        <p className="text-xs text-muted-foreground text-center">
          This page does not store any data. The stream key is encoded in the URL.
        </p>
      </div>
    </div>
  )
}
