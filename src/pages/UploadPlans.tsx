import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileImage, Loader2, Trash2, Eye, Sparkles, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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

interface Plan {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  status: string;
  analysis: PlanAnalysis | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  uploaded: { label: "Ready", color: "bg-kindai-blue/10 text-kindai-blue", icon: FileImage },
  analyzing: { label: "Analyzing…", color: "bg-kindai-orange/10 text-kindai-orange", icon: Loader2 },
  analyzed: { label: "Complete", color: "bg-kindai-green/10 text-kindai-green", icon: CheckCircle2 },
  error: { label: "Error", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
};

const typeColors: Record<string, string> = {
  base: "bg-kindai-blue/10 text-kindai-blue",
  wall: "bg-kindai-aqua/10 text-kindai-aqua",
  tall: "bg-kindai-violet/10 text-kindai-violet",
  island: "bg-kindai-green/10 text-kindai-green",
  vanity: "bg-kindai-pink/10 text-kindai-pink",
  overhead: "bg-kindai-orange/10 text-kindai-orange",
};

export default function UploadPlans() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dragOver, setDragOver] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Plan[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to upload plans");

      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("plans")
        .upload(filePath, file, { contentType: file.type });
      if (uploadError) throw uploadError;

      const { data: plan, error: insertError } = await supabase
        .from("plans")
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          status: "uploaded",
        })
        .select()
        .single();
      if (insertError) throw insertError;

      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({ title: "Plan uploaded", description: "Ready for AI analysis" });
    },
    onError: (err: any) => {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const { data, error } = await supabase.functions.invoke("analyze-plan", {
        body: { planId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({ title: "Analysis complete", description: "Cabinets extracted from your plan" });
    },
    onError: (err: any) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      await supabase.storage.from("plans").remove([plan.file_path]);
      const { error } = await supabase.from("plans").delete().eq("id", plan.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({ title: "Plan deleted" });
    },
  });

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const allowed = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    Array.from(files).forEach((file) => {
      if (!allowed.includes(file.type)) {
        toast({ title: "Invalid file", description: `${file.name} is not a supported format`, variant: "destructive" });
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 20MB`, variant: "destructive" });
        return;
      }
      uploadMutation.mutate(file);
    });
  }, [uploadMutation, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <h1 className="font-display text-3xl font-bold">Upload Plans</h1>
      <p className="mt-1 text-muted-foreground">Upload floor plans, elevations, or sketches for AI analysis</p>

      {/* Drop zone */}
      <Card
        className={cn(
          "mt-8 border-dashed border-2 transition-all cursor-pointer",
          dragOver
            ? "border-kindai-pink bg-kindai-pink/10 scale-[1.01]"
            : "border-kindai-pink/30 bg-kindai-pink/5 hover:border-kindai-pink/50"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/png,image/jpeg,image/webp,application/pdf";
          input.multiple = true;
          input.onchange = () => handleFiles(input.files);
          input.click();
        }}
      >
        <CardContent className="flex flex-col items-center justify-center py-16">
          {uploadMutation.isPending ? (
            <Loader2 className="h-8 w-8 text-kindai-pink animate-spin" />
          ) : (
            <div className="rounded-2xl bg-kindai-pink/10 p-4">
              <Upload className="h-8 w-8 text-kindai-pink" />
            </div>
          )}
          <h3 className="mt-4 font-display text-lg font-semibold">
            {uploadMutation.isPending ? "Uploading…" : "Drop your files here"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">PNG, JPG, WEBP, or PDF — up to 20MB</p>
          {!uploadMutation.isPending && (
            <div className="mt-4 rounded-lg gradient-kindai px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Browse Files
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plans list */}
      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold">Uploaded Plans</h2>

        {isLoading ? (
          <div className="mt-6 text-center text-muted-foreground">Loading…</div>
        ) : plans.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12 text-center">
            <FileImage className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">No plans uploaded yet</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {plans.map((plan) => {
              const config = statusConfig[plan.status] || statusConfig.uploaded;
              const StatusIcon = config.icon;
              const isExpanded = expandedPlan === plan.id;
              const analysis = plan.analysis as PlanAnalysis | null;

              return (
                <Card key={plan.id} className="overflow-hidden">
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
                        <Button
                          size="sm"
                          className="gradient-kindai border-0 font-semibold"
                          onClick={() => analyzeMutation.mutate(plan.id)}
                          disabled={analyzeMutation.isPending}
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1" />
                          Analyze
                        </Button>
                      )}
                      {plan.status === "error" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => analyzeMutation.mutate(plan.id)}
                          disabled={analyzeMutation.isPending}
                        >
                          Retry
                        </Button>
                      )}
                      {plan.status === "analyzed" && analysis?.cabinets && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          {analysis.cabinets.length} cabinets
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMutation.mutate(plan)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded analysis */}
                  {isExpanded && analysis?.cabinets && (
                    <div className="border-t border-border bg-muted/30 p-4">
                      <div className="flex flex-wrap gap-4 mb-4 text-sm">
                        {analysis.room_type && (
                          <div>
                            <span className="text-muted-foreground">Room: </span>
                            <span className="font-medium capitalize">{analysis.room_type}</span>
                          </div>
                        )}
                        {analysis.total_linear_metres && (
                          <div>
                            <span className="text-muted-foreground">Linear metres: </span>
                            <span className="font-medium">{analysis.total_linear_metres}m</span>
                          </div>
                        )}
                        {analysis.estimated_carcass_sheets && (
                          <div>
                            <span className="text-muted-foreground">Est. carcass sheets: </span>
                            <span className="font-medium">{analysis.estimated_carcass_sheets}</span>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {analysis.cabinets.map((cab, i) => (
                          <div key={i} className="rounded-lg border border-border bg-card p-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={typeColors[cab.type] || "bg-muted"}>
                                {cab.type}
                              </Badge>
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

                      {analysis.notes && (
                        <p className="mt-3 text-xs text-muted-foreground italic">{analysis.notes}</p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
