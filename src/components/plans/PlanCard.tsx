import { FileImage, Loader2, Trash2, Sparkles, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Cabinet {
  label: string;
  type: string;
  width_mm: number;
  height_mm: number;
  depth_mm: number;
  features?: string[];
  door_count?: number;
  drawer_count?: number;
  shelf_count?: number;
}

interface PlanAnalysis {
  summary: string;
  room_type: string;
  cabinets: Cabinet[];
  total_linear_metres?: number;
  estimated_carcass_sheets?: number;
  notes?: string;
  error?: string;
}

export interface Plan {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  status: string;
  analysis: PlanAnalysis | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  uploaded: { label: "Ready", color: "bg-[hsl(var(--kindai-blue))]/10 text-[hsl(var(--kindai-blue))]", icon: FileImage },
  analyzing: { label: "Analyzing…", color: "bg-[hsl(var(--kindai-orange))]/10 text-[hsl(var(--kindai-orange))]", icon: Loader2 },
  analyzed: { label: "Complete", color: "bg-[hsl(var(--kindai-green))]/10 text-[hsl(var(--kindai-green))]", icon: CheckCircle2 },
  error: { label: "Error", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
};

const typeColors: Record<string, string> = {
  base: "bg-[hsl(var(--kindai-blue))]/10 text-[hsl(var(--kindai-blue))]",
  wall: "bg-[hsl(var(--kindai-aqua))]/10 text-[hsl(var(--kindai-aqua))]",
  tall: "bg-[hsl(var(--kindai-violet))]/10 text-[hsl(var(--kindai-violet))]",
  island: "bg-[hsl(var(--kindai-green))]/10 text-[hsl(var(--kindai-green))]",
  vanity: "bg-[hsl(var(--kindai-pink))]/10 text-[hsl(var(--kindai-pink))]",
  overhead: "bg-[hsl(var(--kindai-orange))]/10 text-[hsl(var(--kindai-orange))]",
};

interface PlanCardProps {
  plan: Plan;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAnalyze: () => void;
  onDelete: () => void;
  isAnalyzing: boolean;
}

export function PlanCard({ plan, isExpanded, onToggleExpand, onAnalyze, onDelete, isAnalyzing }: PlanCardProps) {
  const config = statusConfig[plan.status] || statusConfig.uploaded;
  const StatusIcon = config.icon;
  const analysis = plan.analysis as PlanAnalysis | null;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{plan.file_name}</span>
            <Badge variant="secondary" className={config.color}>
              <StatusIcon className={cn("h-3 w-3 mr-1", plan.status === "analyzing" && "animate-spin")} />
              {config.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {(plan.file_size / 1024).toFixed(0)} KB · {new Date(plan.created_at).toLocaleDateString()}
            {analysis?.summary && ` · ${analysis.summary}`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {plan.status === "uploaded" && (
            <Button size="sm" className="gradient-kindai border-0 font-semibold" onClick={onAnalyze} disabled={isAnalyzing}>
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Analyze
            </Button>
          )}
          {plan.status === "error" && (
            <Button size="sm" variant="outline" onClick={onAnalyze} disabled={isAnalyzing}>Retry</Button>
          )}
          {plan.status === "analyzed" && analysis?.cabinets && (
            <Button size="sm" variant="ghost" onClick={onToggleExpand}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {analysis.cabinets.length} cabinets
            </Button>
          )}
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {isExpanded && analysis?.cabinets && (
        <div className="border-t border-border bg-muted/30 p-4">
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            {analysis.room_type && (
              <div><span className="text-muted-foreground">Room: </span><span className="font-medium capitalize">{analysis.room_type}</span></div>
            )}
            {analysis.total_linear_metres && (
              <div><span className="text-muted-foreground">Linear metres: </span><span className="font-medium">{analysis.total_linear_metres}m</span></div>
            )}
            {analysis.estimated_carcass_sheets && (
              <div><span className="text-muted-foreground">Est. carcass sheets: </span><span className="font-medium">{analysis.estimated_carcass_sheets}</span></div>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {analysis.cabinets.map((cab, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={typeColors[cab.type] || "bg-muted"}>{cab.type}</Badge>
                  <span className="font-medium text-sm">{cab.label}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {cab.width_mm} × {cab.height_mm} × {cab.depth_mm}mm
                  {cab.door_count ? ` · ${cab.door_count} doors` : ""}
                  {cab.drawer_count ? ` · ${cab.drawer_count} drawers` : ""}
                </div>
                {cab.features && cab.features.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {cab.features.map((f, j) => (
                      <Badge key={j} variant="outline" className="text-xs py-0">{f}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {analysis.notes && <p className="mt-3 text-xs text-muted-foreground italic">{analysis.notes}</p>}
        </div>
      )}
    </Card>
  );
}
