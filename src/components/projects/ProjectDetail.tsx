import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, FileImage, MapPin, User, Mail, Phone, StickyNote, Unlink, Package, Sparkles, Loader2, Trash2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
}

interface Plan {
  id: string;
  file_name: string;
  status: string;
  project_id: string | null;
  analysis: any;
  created_at: string;
}

interface Cabinet {
  id: string;
  label: string;
  type: string;
  width_mm: number;
  height_mm: number;
  depth_mm: number;
  door_count: number;
  drawer_count: number;
  shelf_count: number;
  features: string[] | null;
}

const typeColors: Record<string, string> = {
  base: "bg-kindai-blue/10 text-kindai-blue",
  wall: "bg-kindai-aqua/10 text-kindai-aqua",
  tall: "bg-kindai-violet/10 text-kindai-violet",
  island: "bg-kindai-green/10 text-kindai-green",
  vanity: "bg-kindai-pink/10 text-kindai-pink",
  overhead: "bg-kindai-orange/10 text-kindai-orange",
};

interface Props {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetail({ project, onBack }: Props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch plans (all + linked to this project)
  const { data: allPlans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plans").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Plan[];
    },
  });

  const linkedPlans = allPlans.filter((p) => p.project_id === project.id);
  const unlinkedPlans = allPlans.filter((p) => !p.project_id);

  // Fetch cabinets for this project
  const { data: cabinets = [] } = useQuery({
    queryKey: ["cabinets", project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cabinets")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Cabinet[];
    },
  });

  const linkPlan = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase.from("plans").update({ project_id: project.id }).eq("id", planId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan linked to project");
    },
  });

  const unlinkPlan = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase.from("plans").update({ project_id: null }).eq("id", planId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan unlinked");
    },
  });

  // Save analyzed cabinets from linked plans into cabinets table
  const saveCabinetsMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in first");

      const analyzedPlans = linkedPlans.filter(
        (p) => p.status === "analyzed" && p.analysis?.cabinets?.length > 0
      );
      if (analyzedPlans.length === 0) throw new Error("No analyzed plans with cabinets found");

      const rows = analyzedPlans.flatMap((plan) =>
        (plan.analysis.cabinets as any[]).map((cab: any) => ({
          user_id: user.id,
          project_id: project.id,
          plan_id: plan.id,
          label: cab.label || "Untitled",
          type: cab.type || "base",
          width_mm: cab.width_mm || 600,
          height_mm: cab.height_mm || 720,
          depth_mm: cab.depth_mm || 560,
          door_count: cab.door_count || 0,
          drawer_count: cab.drawer_count || 0,
          shelf_count: cab.shelf_count || 1,
          features: cab.features || [],
        }))
      );

      const { error } = await supabase.from("cabinets").insert(rows);
      if (error) throw error;
      return rows.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["cabinets", project.id] });
      toast.success(`Saved ${count} cabinets to project`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to save cabinets"),
  });

  const deleteCabinetMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cabinets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cabinets", project.id] });
      toast.success("Cabinet deleted");
    },
  });

  const analyzedLinkedPlans = linkedPlans.filter(
    (p) => p.status === "analyzed" && p.analysis?.cabinets?.length > 0
  );
  const canSaveCabinets = analyzedLinkedPlans.length > 0;

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{project.name}</h1>
          <Badge variant="secondary" className="mt-2 capitalize">{project.status}</Badge>
        </div>
      </div>

      {/* Client details */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">Client Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          {project.client_name && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" /> {project.client_name}
            </div>
          )}
          {project.client_email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {project.client_email}
            </div>
          )}
          {project.client_phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" /> {project.client_phone}
            </div>
          )}
          {project.address && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {project.address}
            </div>
          )}
          {project.notes && (
            <div className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
              <StickyNote className="h-4 w-4 mt-0.5" /> {project.notes}
            </div>
          )}
          {!project.client_name && !project.address && !project.notes && (
            <p className="text-muted-foreground sm:col-span-2">No client details added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Linked plans */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <FileImage className="h-4 w-4 text-kindai-pink" /> Linked Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          {linkedPlans.length === 0 ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted-foreground">No plans linked to this project yet.</p>
              <Button size="sm" variant="outline" onClick={() => navigate("/upload")}>
                <Upload className="h-3.5 w-3.5 mr-1" /> Upload Plans
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {linkedPlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <span className="font-medium text-sm">{plan.file_name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs capitalize">{plan.status}</Badge>
                    {plan.status === "analyzed" && plan.analysis?.cabinets && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {plan.analysis.cabinets.length} cabinets detected
                      </span>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => unlinkPlan.mutate(plan.id)}>
                    <Unlink className="h-3.5 w-3.5 mr-1" /> Unlink
                  </Button>
                </div>
              ))}
            </div>
          )}

          {unlinkedPlans.length > 0 && (
            <div className="mt-4 flex items-end gap-3">
              <div className="flex-1 max-w-xs space-y-1.5">
                <Label className="text-xs">Assign a plan</Label>
                <Select onValueChange={(v) => linkPlan.mutate(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unassigned plan…" />
                  </SelectTrigger>
                  <SelectContent>
                    {unlinkedPlans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.file_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cabinets */}
      <Card className="mt-6">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-kindai-green" /> Cabinets ({cabinets.length})
          </CardTitle>
          {canSaveCabinets && (
            <Button
              size="sm"
              className="gradient-kindai border-0 font-semibold"
              onClick={() => saveCabinetsMutation.mutate()}
              disabled={saveCabinetsMutation.isPending}
            >
              {saveCabinetsMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 mr-1" />
              )}
              Save from Plans
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {cabinets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {canSaveCabinets
                ? 'Click "Save from Plans" above to import detected cabinets from your analyzed plans.'
                : "No cabinets saved yet. Link and analyze a plan first, then save the results."}
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {cabinets.map((cab) => (
                <div key={cab.id} className="rounded-lg border border-border bg-card p-3 group relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => deleteCabinetMutation.mutate(cab.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
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
                    {cab.shelf_count ? ` · ${cab.shelf_count} shelves` : ""}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
