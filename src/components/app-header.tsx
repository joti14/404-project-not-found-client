"use client";

import { KanbanSquare, LogOut, PenTool } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/use-logout";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const NAV_LINKS = [
  { href: "/tasks", label: "Tasks", icon: KanbanSquare },
  { href: "/annotate", label: "Annotate", icon: PenTool },
] as const;

/** Top navigation shared by all authenticated pages. */
export function AppHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Link href="/tasks" className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <KanbanSquare className="size-4" aria-hidden />
            </span>
            <span className="hidden lg:inline">404 Project Not Found</span>
          </Link>

          <nav aria-label="Main" className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  pathname === href
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
        </div>

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
