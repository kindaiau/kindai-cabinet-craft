import { FileText } from "lucide-react";

export default function Estimates() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold">Estimates</h1>
      <p className="mt-1 text-muted-foreground">View and export your project estimates</p>

      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <div className="rounded-2xl bg-kindai-orange/10 p-6">
          <FileText className="h-12 w-12 text-kindai-orange" />
        </div>
        <h2 className="mt-6 font-display text-xl font-semibold">No estimates yet</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Complete a project with pricing to generate exportable estimates.
        </p>
      </div>
    </div>
  );
}
