"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const pageTitles: Record<string, string> = {
  "/streams": "Live Streams",
  "/broadcasters": "Broadcasters",
  "/stream-keys": "Stream Keys",
  "/settings": "Settings",
  "/help": "Help",
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || "Dashboard"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 hidden data-[orientation=vertical]:h-4 md:block"
        />
        {/* Logo centered on mobile, title on desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
          <Image
            src="/logo.png"
            alt="RescueStream"
            width={36}
            height={36}
            className="block dark:hidden"
          />
          <Image
            src="/logo-dark.png"
            alt="RescueStream"
            width={36}
            height={36}
            className="hidden dark:block"
          />
        </div>
        <h1 className="hidden text-base font-medium md:block">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
