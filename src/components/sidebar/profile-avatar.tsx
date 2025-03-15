"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTheme } from "next-themes";

export default function ProfileAvatar() {
  const router = useRouter();

  const { setTheme, theme } = useTheme();

  const [isPending, _] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(theme === "dark");

  if (isPending)
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted" />
        <div>
          <Skeleton className="h-4 w-24 bg-muted" />
          <Skeleton className="h-4 w-32 bg-muted" />
        </div>
      </div>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer rounded-md duration-150 hover:bg-accent"
        asChild
      >
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback>UT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 text-sm leading-none">
            <span className="truncate font-semibold">User Testing</span>
            <span className="max-w-40 truncate text-muted-foreground">
              user@yieldsoftomorrow.world
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuCheckboxItem
          checked={darkMode}
          onCheckedChange={() => {
            setDarkMode(!darkMode);
            setTheme(darkMode ? "light" : "dark");
          }}
        >
          Dark mode
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => router.push("/")}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
