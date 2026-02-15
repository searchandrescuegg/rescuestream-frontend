"use client"

import * as React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  IconFileText,
  IconHelp,
  IconHistory,
  IconKey,
  IconShieldLock,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { HealthIndicator } from "@/components/health-indicator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navMain = [
  {
    title: "Live Streams",
    url: "/streams",
    icon: IconVideo,
  },
  {
    title: "Broadcasters",
    url: "/broadcasters",
    icon: IconUsers,
  },
  {
    title: "Stream Keys",
    url: "/stream-keys",
    icon: IconKey,
  },
  {
    title: "Audit Log",
    url: "/audit-logs",
    icon: IconHistory,
  },
]

const navSecondary = [
  {
    title: "Get Help",
    url: "/help",
    icon: IconHelp,
  },
  {
    title: "Privacy Policy",
    url: "/privacy",
    icon: IconShieldLock,
  },
  {
    title: "Terms of Service",
    url: "/terms",
    icon: IconFileText,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  // Add isActive flag based on current pathname
  const navMainWithActive = navMain.map((item) => ({
    ...item,
    isActive: pathname === item.url || pathname.startsWith(item.url + '/'),
  }))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/streams">
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
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <HealthIndicator />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
