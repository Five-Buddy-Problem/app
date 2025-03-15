"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ProfileAvatar from "./profile-avatar";
import Link from "next/link";

const navMain = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/",
      },
      {
        title: "Data & Reports",
        url: "/reports",
      },
    ],
  },
  {
    title: "Drone",
    items: [
      {
        title: "My drones",
        url: "/drones",
      },
      {
        title: "Flight logs",
        url: "/flights",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "General settings",
        url: "/settings",
      },
      {
        title: "Account settings",
        url: "/settings/account",
      },
      {
        title: "Billing",
        url: "/settings/billing",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  function isActive(url: string) {
    return pathname === url;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image src="/logo.jpg" alt="Logo" height="32" width="32" />
                <div className="flex flex-col gap-0.5 px-2 leading-none">
                  <span className="font-semibold">Yields of Tomorrow</span>
                  <span className="text-muted-foreground">
                    Agricultural Intelligence
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex h-full flex-col justify-between">
        <SidebarGroup>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive(item.url)}
                        >
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <div className="max-w-full truncate px-3 py-3">
          <ProfileAvatar />
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
