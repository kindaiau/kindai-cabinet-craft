import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, Loader2, CheckCircle2, Sparkles, FileImage } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DEMO_PLAN, DEMO_CABINETS } from "@/contexts/DemoContext";
import { Link } from "react-router-dom";

type SimPhase = "idle" | "uploading" | "analyzing" | "complete";

export default function DemoUpload() {
  const [phase, setPhase] = useState<SimPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const simulateUpload = useCallback(() => {
    setPhase("uploading");
    setProgress(0);
    let p = 0;
    intervalRef.current = window.setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(intervalRef.current!);
        setProgress(100);
        // Start analysis phase
        setTimeout(() => {
          setPhase("analyzing");
          setAnalyzeProgress(0);
          let a = 0;
          intervalRef.current = window.setInterval(() => {
            a += Math.random() * 8 + 2;
            if (a >= 100) {
              a = 100;
              clearInterval(intervalRef.current!);
              setAnalyzeProgress(100);
              setTimeout(() => setPhase("complete"), 500);
            }
            setAnalyzeProgress(Math.min(a, 100));
          }, 200);
        }, 600);
      }
      setProgress(Math.min(p, 100));
    }, 150);
  }, []);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <h1 className="font-display text-3xl font-bold">Upload Plans</h1>
      <p className="mt-1 text-muted-foreground">Upload floor plans, elevations, or sketches for AI analysis</p>

      {/* Upload zone */}
      <div className="mt-8">
        <Card
          className="border-dashed border-2 transition-all cursor-pointer border-primary/30 bg-primary/5 hover:border-primary/50"
          onClick={phase === "idle" ? simulateUpload : undefined}
        >
          <CardContent className="flex flex-col items-center justify-center py-16">
            {phase === "idle" && (
              <>
                <div className="rounded-2xl bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">Click to simulate an upload</h3>
                <p className="mt-1 text-sm text-muted-foreground">Watch AI extract cabinets from a kitchen plan</p>
                <div className="mt-4 rounded-lg gradient-kindai px-6 py-2.5 text-sm font-semibold text-primary-foreground">
                  Try It Now
                </div>
              </>
            )}

            {phase === "uploading" && (
              <div className="w-full max-w-md">
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="font-medium text-sm">Uploading Kitchen-FloorPlan-42Oak.pdf…</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="mt-2 text-xs text-muted-foreground text-center">{Math.round(progress)}% · 2.4 MB</p>
              </div>
            )}

            {phase === "analyzing" && (
              <div className="w-full max-w-md">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="h-5 w-5 text-[hsl(var(--kindai-orange))] animate-pulse" />
                  <span className="font-medium text-sm">AI is analyzing your plan…</span>
                </div>
                <Progress value={analyzeProgress} className="h-2 [&>div]:bg-[hsl(var(--kindai-orange))]" />
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  Detecting cabinets, dimensions, and features…
                </p>
              </div>
            )}

            {phase === "complete" && (
              <div className="w-full max-w-md text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[hsl(var(--kindai-green))]" />
                <h3 className="mt-3 font-display text-lg font-semibold">Analysis Complete!</h3>
                <p className="mt-1 text-sm text-muted-foreground">{DEMO_PLAN.analysis.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Show results after simulation */}
      {phase === "complete" && (
        <div className="mt-6 animate-fade-in">
          <Card>
            <div className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{DEMO_PLAN.file_name}</span>
                  <Badge variant="secondary" className="bg-[hsl(var(--kindai-green)/0.1)] text-[hsl(var(--kindai-green))]">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  2.4 MB · {DEMO_PLAN.analysis.summary}
                </p>
              </div>
            </div>

            <div className="border-t border-border bg-muted/30 p-4">
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div><span className="text-muted-foreground">Room: </span><span className="font-medium capitalize">{DEMO_PLAN.analysis.room_type}</span></div>
                <div><span className="text-muted-foreground">Linear metres: </span><span className="font-medium">{DEMO_PLAN.analysis.total_linear_metres}m</span></div>
                <div><span className="text-muted-foreground">Est. carcass sheets: </span><span className="font-medium">{DEMO_PLAN.analysis.estimated_carcass_sheets}</span></div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {DEMO_CABINETS.map((cab, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-[hsl(var(--kindai-blue)/0.1)] text-[hsl(var(--kindai-blue))]">{cab.type}</Badge>
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
            </div>
          </Card>

          <div className="mt-6 flex gap-3">
            <Link to="/demo/takeoff">
              <Button className="gradient-kindai border-0 font-semibold">
                View Material Take-Off →
              </Button>
            </Link>
            <Button variant="outline" onClick={() => { setPhase("idle"); setProgress(0); setAnalyzeProgress(0); }}>
              Run Again
            </Button>
          </div>
        </div>
      )}

      {/* Pre-existing analyzed plan */}
      {phase === "idle" && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold">Uploaded Plans</h2>
          <div className="mt-4">
            <Card>
              <div className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{DEMO_PLAN.file_name}</span>
                    <Badge variant="secondary" className="bg-[hsl(var(--kindai-green)/0.1)] text-[hsl(var(--kindai-green))]">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    2.4 MB · {DEMO_PLAN.analysis.summary}
                  </p>
                </div>
                <Link to="/demo/takeoff">
                  <Button size="sm" variant="outline">View Take-Off →</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
