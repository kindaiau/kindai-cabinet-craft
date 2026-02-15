import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, FolderOpen, ChevronRight, Trash2, MapPin, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import ProjectDetail from "@/components/projects/ProjectDetail";

interface Project {
  id: string;
  name: string;
  status: string;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-[hsl(var(--kindai-green)/0.1)] text-[hsl(var(--kindai-green))]",
  quoted: "bg-[hsl(var(--kindai-blue)/0.1)] text-[hsl(var(--kindai-blue))]",
  completed: "bg-[hsl(var(--kindai-aqua)/0.1)] text-[hsl(var(--kindai-aqua))]",
  archived: "bg-muted text-muted-foreground",
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
  });

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProjectId(null)}
      />
    );
  }

  return (
    <div className="relative p-6 md:p-8">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full blur-[150px] bg-[hsl(var(--primary)/0.05)]" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-muted-foreground">Manage your cabinet estimates</p>
        </div>
        <Button
          className="gradient-energy border-0 font-semibold shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.35)] transition-shadow duration-300"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-10 border-border/50 bg-card focus:border-primary/50 focus:shadow-[0_0_12px_hsl(var(--primary)/0.15)] transition-shadow duration-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="mt-16 text-center text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 && projects.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="rounded-2xl bg-[hsl(var(--kindai-pink)/0.08)] p-6 shadow-[0_0_30px_hsl(var(--kindai-pink)/0.1)]">
            <FolderOpen className="h-12 w-12 text-[hsl(var(--kindai-pink))]" />
          </div>
          <h2 className="mt-6 font-display text-xl font-semibold">No projects yet</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Create your first project to start estimating materials and pricing for your next job.
          </p>
          <Button
            className="mt-6 gradient-energy border-0 font-semibold shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Your First Project
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">No projects match "{search}"</p>
      ) : (
        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Card
              key={project.id}
              className="group cursor-pointer border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_24px_hsl(var(--primary)/0.08)]"
              onClick={() => setSelectedProjectId(project.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold truncate group-hover:text-primary transition-colors duration-200">{project.name}</h3>
                      <Badge variant="secondary" className={statusColors[project.status] || statusColors.draft}>
                        {project.status}
                      </Badge>
                    </div>
                    {project.client_name && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" /> {project.client_name}
                      </p>
                    )}
                    {project.address && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate">
                        <MapPin className="h-3 w-3" /> {project.address}
                      </p>
                    )}
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {new Date(project.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(project.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
