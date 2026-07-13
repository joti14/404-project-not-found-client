import type { Metadata } from "next";

import { AppHeader } from "@/components/app-header";
import { AuthGuard } from "@/features/auth/auth-guard";
import { AnnotateView } from "@/features/annotations/annotate-view";

export const metadata: Metadata = {
  title: "Annotate",
};

export default function AnnotatePage() {
  return (
    <AuthGuard>
      <AppHeader />
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <AnnotateView />
      </main>
    </AuthGuard>
  );
}
