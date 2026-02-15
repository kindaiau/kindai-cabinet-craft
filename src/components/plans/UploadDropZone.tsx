import { useState, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadDropZoneProps {
  onFiles: (files: File[]) => void;
  isUploading: boolean;
}

export function UploadDropZone({ onFiles, isUploading }: UploadDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }, [onFiles]);

  const openPicker = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = () => {
      if (input.files?.length) onFiles(Array.from(input.files));
    };
    input.click();
  }, [onFiles]);

  return (
    <Card
      className={cn(
        "border-dashed border-2 transition-all cursor-pointer",
        dragOver
          ? "border-primary bg-primary/10 scale-[1.01]"
          : "border-primary/30 bg-primary/5 hover:border-primary/50"
      )}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={openPicker}
    >
      <CardContent className="flex flex-col items-center justify-center py-16">
        {isUploading ? (
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        ) : (
          <div className="rounded-2xl bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
        )}
        <h3 className="mt-4 font-display text-lg font-semibold">
          {isUploading ? "Uploading…" : "Drop your files here"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Any file type · Up to 5 GB · Resumable uploads
        </p>
        {!isUploading && (
          <div className="mt-4 rounded-lg gradient-kindai px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            Browse Files
          </div>
        )}
      </CardContent>
    </Card>
  );
}
