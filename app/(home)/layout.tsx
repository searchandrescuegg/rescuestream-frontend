import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "RescueStream - Live Stream Management for Search and Rescue",
  description:
    "RescueStream provides real-time live stream management for search and rescue operations. Monitor broadcasts, manage broadcasters, and stream with ultra-low latency.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/50">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="RescueStream"
              width={140}
              height={78}
              className="h-8 w-auto dark:hidden"
              priority
            />
            <Image
              src="/logo-dark.png"
              alt="RescueStream"
              width={140}
              height={78}
              className="hidden h-8 w-auto dark:block"
              priority
            />
          </Link>
          <Link
            href="/streams"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-background border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
