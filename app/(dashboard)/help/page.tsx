import {
  IconBroadcast,
  IconKey,
  IconPlayerPlay,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react"

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Get Help</h1>
        <p className="text-muted-foreground">
          Learn how to set up and use RescueStream for your broadcasts.
        </p>
      </div>

      <div className="grid gap-6">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Getting Started</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <StepCard
              step={1}
              icon={<IconUsers className="size-5" />}
              title="Create a Broadcaster"
              description="Go to the Broadcasters page and create a new broadcaster profile. This represents a person or device that will be streaming."
            />
            <StepCard
              step={2}
              icon={<IconKey className="size-5" />}
              title="Generate a Stream Key"
              description="Navigate to Stream Keys and create a new key for your broadcaster. This key authenticates your streaming software."
            />
            <StepCard
              step={3}
              icon={<IconBroadcast className="size-5" />}
              title="Configure Your Encoder"
              description="Use the RTMP URL and stream key in your broadcasting software (OBS, vMix, etc.) to connect to RescueStream."
            />
            <StepCard
              step={4}
              icon={<IconPlayerPlay className="size-5" />}
              title="Start Streaming"
              description="Begin your broadcast from your encoder. Your stream will appear on the Live Streams page within seconds."
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Viewing Streams</h2>
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-start gap-3">
              <IconVideo className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Live Streams Dashboard</p>
                <p className="text-sm text-muted-foreground">
                  The Live Streams page shows all active broadcasts in a grid layout. Click any stream to view it fullscreen. Streams auto-refresh every few seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Supported Protocols</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-medium">RTMP Ingest</p>
              <p className="text-sm text-muted-foreground">
                Push streams using RTMP from OBS, vMix, Wirecast, or any RTMP-compatible encoder.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-medium">HLS & WebRTC Playback</p>
              <p className="text-sm text-muted-foreground">
                Streams are available via HLS for compatibility or WebRTC (WHEP) for ultra-low latency viewing.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
          {step}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="font-medium text-foreground">{title}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground pl-11">{description}</p>
    </div>
  )
}
