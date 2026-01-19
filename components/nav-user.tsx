"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  IconBrandGoogle,
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session, status } = useSession()
  const [accountDialogOpen, setAccountDialogOpen] = useState(false)

  const isLoading = status === "loading"

  const user = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    avatar: session?.user?.image ?? undefined,
    provider: (session?.user as { provider?: string } | undefined)?.provider,
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="grid flex-1 text-left text-sm leading-tight gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="aspect-square h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <AvatarFallback className="rounded-lg">
                        {getInitials(user.name || "U")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </>
              )}
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="aspect-square h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => setAccountDialogOpen(true)}>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>

    <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 rounded-lg">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="aspect-square h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <AvatarFallback className="rounded-lg text-lg">
                {getInitials(user.name || "U")}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="grid gap-1">
            <p className="text-lg font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        {user.provider && (
          <div className="flex items-center gap-2 rounded-md border p-3 text-sm text-muted-foreground">
            {user.provider === "google" && <IconBrandGoogle className="size-4" />}
            <span>Signed in with {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
