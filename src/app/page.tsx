import { KanbanSquare, PenTool } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6">
      <div className="text-center">
        <p className="font-mono text-sm text-muted-foreground">
          frontend: running
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
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
              Date-based Kanban board with drag and drop.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming in a later slice
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="size-4" aria-hidden />
              Annotate
            </CardTitle>
            <CardDescription>
              Draw and manage polygons on uploaded images.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>
              Coming in a later slice
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-2xl">
        <Input placeholder="Reusable Input component — wired to forms later" />
      </div>
    </main>
  );
}
