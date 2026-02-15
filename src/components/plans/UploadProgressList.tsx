import { X, Pause, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { type UploadingFile } from "@/hooks/use-resumable-upload";
import { cn } from "@/lib/utils";

interface UploadProgressListProps {
  uploads: UploadingFile[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function UploadProgressList({ uploads, onPause, onResume, onCancel }: UploadProgressListProps) {
  if (uploads.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Uploads</h3>
      {uploads.map((u) => (
        <div key={u.id} className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">{u.file.name}</span>
                <span className="text-xs text-muted-foreground">{formatSize(u.file.size)}</span>
              </div>
              <div className="mt-2">
                <Progress
                  value={u.progress}
                  className={cn(
                    "h-2",
                    u.status === "error" && "[&>div]:bg-destructive",
                    u.status === "complete" && "[&>div]:bg-[hsl(var(--kindai-green))]",
                    u.status === "paused" && "[&>div]:bg-[hsl(var(--kindai-orange))]"
                  )}
                />
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                {u.status === "uploading" && <span>{u.progress}%</span>}
                {u.status === "paused" && <span className="text-[hsl(var(--kindai-orange))]">Paused</span>}
                {u.status === "complete" && (
                  <span className="flex items-center gap-1 text-[hsl(var(--kindai-green))]">
                    <CheckCircle2 className="h-3 w-3" /> Complete
                  </span>
                )}
                {u.status === "error" && (
                  <span className="flex items-center gap-1 text-destructive">
                    <AlertCircle className="h-3 w-3" /> {u.error || "Failed"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {u.status === "uploading" && (
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onPause(u.id)}>
                  <Pause className="h-3.5 w-3.5" />
                </Button>
              )}
              {u.status === "paused" && (
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onResume(u.id)}>
                  <Play className="h-3.5 w-3.5" />
                </Button>
              )}
              {(u.status === "uploading" || u.status === "paused" || u.status === "error") && (
                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onCancel(u.id)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
