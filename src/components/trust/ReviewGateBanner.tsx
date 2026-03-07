import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface ReviewGateBannerProps {
  title?: string;
  description: string;
  blockers?: string[];
  className?: string;
}

export function ReviewGateBanner({
  title = "Manual review required",
  description,
  blockers = [],
  className,
}: ReviewGateBannerProps) {
  return (
    <section className={cn("review-gate-banner", className)} role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 text-review" aria-hidden />
        <div>
          <h3 className="text-sm font-semibold text-review">{title}</h3>
          <p className="mt-1 text-sm text-foreground/90">{description}</p>
          {blockers.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-foreground/80">
              {blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
