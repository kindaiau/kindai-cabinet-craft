import { Plus, Search, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-muted-foreground">Manage your cabinet estimates</p>
        </div>
        <Button className="gradient-kindai border-0 font-semibold">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Search */}
      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search projects..." className="pl-10" />
      </div>

      {/* Empty state */}
      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <div className="rounded-2xl bg-kindai-pink/5 p-6">
          <FolderOpen className="h-12 w-12 text-kindai-pink" />
        </div>
        <h2 className="mt-6 font-display text-xl font-semibold">No projects yet</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Create your first project to start estimating materials and pricing for your next job.
        </p>
        <Button className="mt-6 gradient-kindai border-0 font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Create Your First Project
        </Button>
      </div>
    </div>
  );
}
