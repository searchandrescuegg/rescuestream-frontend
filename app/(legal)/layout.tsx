import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function LegalLayout({
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
            <IconArrowLeft className="h-4 w-4" />
            Dashboard/Login
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6 md:p-8 lg:p-10">
            {children}
          </CardContent>
        </Card>
      </main>

      <footer className="bg-background border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
