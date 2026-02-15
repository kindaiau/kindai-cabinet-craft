import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResumableUpload } from "@/hooks/use-resumable-upload";
import { UploadDropZone } from "@/components/plans/UploadDropZone";
import { UploadProgressList } from "@/components/plans/UploadProgressList";
import { PlanCard, type Plan } from "@/components/plans/PlanCard";

export default function UploadPlans() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const { uploads, uploadFile, pauseUpload, resumeUpload, cancelUpload, isUploading } = useResumableUpload({
    bucket: "plans",
    onComplete: async (uploadedFile) => {
      // Insert plan record after successful upload
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !uploadedFile.filePath) return;

      const { error } = await supabase.from("plans").insert({
        user_id: user.id,
        file_name: uploadedFile.file.name,
        file_path: uploadedFile.filePath,
        file_type: uploadedFile.file.type || "application/octet-stream",
        file_size: uploadedFile.file.size,
        status: "uploaded",
      });

      if (error) {
        toast({ title: "Record failed", description: error.message, variant: "destructive" });
      } else {
        queryClient.invalidateQueries({ queryKey: ["plans"] });
        toast({ title: "Plan uploaded", description: "Ready for AI analysis" });
      }
    },
    onError: (_file, error) => {
      toast({ title: "Upload failed", description: error, variant: "destructive" });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const { data, error } = await supabase.functions.invoke("analyze-plan", { body: { planId } });
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

  const handleFiles = useCallback((files: File[]) => {
    files.forEach((file) => {
      uploadFile(file).catch(() => {/* handled by onError */});
    });
  }, [uploadFile]);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <h1 className="font-display text-3xl font-bold">Upload Plans</h1>
      <p className="mt-1 text-muted-foreground">Upload floor plans, elevations, or sketches for AI analysis</p>

      <div className="mt-8">
        <UploadDropZone onFiles={handleFiles} isUploading={isUploading} />
      </div>

      {/* Active uploads with progress */}
      {uploads.length > 0 && (
        <div className="mt-6">
          <UploadProgressList
            uploads={uploads}
            onPause={pauseUpload}
            onResume={resumeUpload}
            onCancel={cancelUpload}
          />
        </div>
      )}

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
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isExpanded={expandedPlan === plan.id}
                onToggleExpand={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                onAnalyze={() => analyzeMutation.mutate(plan.id)}
                onDelete={() => deleteMutation.mutate(plan)}
                isAnalyzing={analyzeMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
