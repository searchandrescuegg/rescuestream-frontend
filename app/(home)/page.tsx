import Link from "next/link";
import {
  IconBroadcast,
  IconKey,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/home/feature-card";

const features = [
  {
    icon: IconVideo,
    title: "Live Stream Monitoring",
    description:
      "Monitor all active broadcast streams in real-time with a responsive grid layout. View multiple feeds simultaneously.",
  },
  {
    icon: IconUsers,
    title: "Broadcaster Management",
    description:
      "Create and manage broadcaster profiles for your team members and devices. Organize your streaming infrastructure.",
  },
  {
    icon: IconKey,
    title: "Stream Key Authentication",
    description:
      "Generate secure stream keys to authenticate your broadcasting software. Control access to your streams.",
  },
  {
    icon: IconBroadcast,
    title: "Multi-Protocol Support",
    description:
      "Stream via RTMP and view via HLS or WebRTC (WHEP) for ultra-low latency. Choose the protocol that fits your needs.",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          Live Stream Management for Search and Rescue
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          RescueStream provides real-time video monitoring and broadcast
          management for search and rescue operations. Keep your team connected
          when it matters most.
        </p>
        <Button asChild size="lg">
          <Link href="/streams">Get Started</Link>
        </Button>
      </section>

      {/* Features Grid */}
      <section className="max-w-4xl mx-auto">
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={<feature.icon className="size-5" />}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
