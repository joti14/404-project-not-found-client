import { ArrowRight, KanbanSquare, PenTool } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-background to-muted/60 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          404 Project Not Found
        </h1>
        <p className="mt-2 text-muted-foreground">
          Task management &amp; image annotation — two apps, one codebase.
        </p>
      </div>

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KanbanSquare className="size-4" aria-hidden />
              Tasks
            </CardTitle>
            <CardDescription>
              Plan your day on a Kanban board with drag and drop.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tasks" className={cn(buttonVariants(), "w-full")}>
              Open the board
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="size-4" aria-hidden />
              Annotate
            </CardTitle>
            <CardDescription>
              Upload images and draw polygon annotations on them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/annotate"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Start annotating
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        You&apos;ll be asked to log in first —{" "}
        <Link href="/login" className="underline underline-offset-4">
          go to login
        </Link>
      </p>
    </main>
  );
}
