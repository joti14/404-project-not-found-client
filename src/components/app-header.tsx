"use client";

import { KanbanSquare, LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/use-logout";
import { useAuthStore } from "@/store/auth-store";

/** Top navigation shared by all authenticated pages. */
export function AppHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/tasks" className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <KanbanSquare className="size-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">404 Project Not Found</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="size-4" aria-hidden />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
