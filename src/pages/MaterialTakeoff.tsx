import { Calculator } from "lucide-react";

export default function MaterialTakeoff() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold">Material Take-Off</h1>
      <p className="mt-1 text-muted-foreground">Review and calculate materials from your plans</p>

      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <div className="rounded-2xl bg-kindai-aqua/10 p-6">
          <Calculator className="h-12 w-12 text-kindai-aqua" />
        </div>
        <h2 className="mt-6 font-display text-xl font-semibold">No take-off data yet</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Upload and analyse a plan first to generate your material take-off.
        </p>
      </div>
    </div>
  );
}
