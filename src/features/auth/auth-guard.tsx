"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/store/auth-store";

/**
 * UX-level route protection: unauthenticated visitors are sent to /login.
 * (The actual security boundary is the API - every endpoint 401s without
 * a valid JWT regardless of what the browser renders.)
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2
          className="size-6 animate-spin text-muted-foreground"
          aria-label="Loading"
        />
      </div>
    );
  }

  return <>{children}</>;
}
