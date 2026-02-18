import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

interface AssumptionBlockProps {
  title?: string;
  items: string[];
  className?: string;
}

export function AssumptionBlock({ title = "Assumptions", items, className }: AssumptionBlockProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-assumption/40 bg-assumption/10 p-4",
        className,
      )}
      aria-label={title}
    >
      <div className="mb-2 flex items-center gap-2 text-assumption">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/90">
        {items.map((item, idx) => (
          <li key={`${item}-${idx}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
