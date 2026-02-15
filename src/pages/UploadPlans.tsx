import { Upload, FileImage } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function UploadPlans() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold">Upload Plans</h1>
      <p className="mt-1 text-muted-foreground">Upload floor plans, elevations, or sketches for AI analysis</p>

      <Card className="mt-8 border-dashed border-2 border-kindai-pink/30 bg-kindai-pink/5">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-2xl bg-kindai-pink/10 p-4">
            <Upload className="h-8 w-8 text-kindai-pink" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">Drop your files here</h3>
          <p className="mt-1 text-sm text-muted-foreground">PNG, JPG, WEBP, or PDF — up to 20MB</p>
          <button className="mt-4 rounded-lg gradient-kindai px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            Browse Files
          </button>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold">Uploaded Plans</h2>
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12 text-center">
          <FileImage className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">No plans uploaded yet</p>
        </div>
      </div>
    </div>
  );
}
