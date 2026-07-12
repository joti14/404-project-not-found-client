import type { Metadata } from "next";

import { AppHeader } from "@/components/app-header";
import { AuthGuard } from "@/features/auth/auth-guard";
import { Board } from "@/features/tasks/board";

export const metadata: Metadata = {
  title: "Tasks",
};

export default function TasksPage() {
  return (
    <AuthGuard>
      <AppHeader />
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <Board />
      </main>
    </AuthGuard>
  );
}
