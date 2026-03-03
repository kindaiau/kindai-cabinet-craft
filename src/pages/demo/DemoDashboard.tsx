import { DEMO_PROJECT, DEMO_PLAN } from "@/contexts/DemoContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, User, MapPin, Clock, FileText, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-[hsl(var(--kindai-green)/0.1)] text-[hsl(var(--kindai-green))]",
};

export default function DemoDashboard() {
  const project = DEMO_PROJECT;

  return (
    <div className="relative p-6 md:p-8">
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full blur-[150px] bg-[hsl(var(--primary)/0.05)]" />

      <div className="relative">
        <h1 className="font-display text-3xl font-bold">Projects</h1>
        <p className="mt-1 text-muted-foreground">Manage your cabinet estimates</p>
      </div>

      {/* Summary stats */}
      <div className="relative mt-6 grid gap-3 grid-cols-2 md:grid-cols-4">
        <StatCard label="Active Projects" value="1" icon={FolderOpen} color="kindai-green" />
        <StatCard label="Plans Uploaded" value="1" icon={FileText} color="kindai-blue" />
        <StatCard label="Cabinets Detected" value="8" icon={CheckCircle2} color="kindai-aqua" />
        <StatCard label="Quotes Sent" value="0" icon={FileText} color="kindai-orange" />
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold">Your Projects</h2>

      <div className="relative mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="group cursor-pointer border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_24px_hsl(var(--primary)/0.08)]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold truncate group-hover:text-primary transition-colors duration-200">{project.name}</h3>
                  <Badge variant="secondary" className={statusColors[project.status]}>
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
            </div>

            {/* Quick plan info */}
            <div className="mt-3 rounded-lg border border-border/50 bg-muted/30 p-2.5">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--kindai-green))]" />
                <span className="font-medium">{DEMO_PLAN.file_name}</span>
                <Badge variant="secondary" className="bg-[hsl(var(--kindai-green)/0.1)] text-[hsl(var(--kindai-green))] text-[10px]">Analyzed</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{DEMO_PLAN.analysis.summary}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          This is a demo with sample data. 
          <Link to="/auth?signup=true" className="ml-1 font-semibold text-primary hover:underline">
            Sign up to create your own projects →
          </Link>
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg bg-${color}/10 p-2`}>
            <Icon className={`h-4 w-4 text-${color}`} />
          </div>
          <div>
            <p className={`font-display text-2xl font-bold text-${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
