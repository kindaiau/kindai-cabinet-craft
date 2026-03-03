import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DemoBanner() {
  return (
    <div className="relative flex items-center justify-between gap-4 bg-gradient-to-r from-[hsl(var(--kindai-violet))] via-[hsl(var(--primary))] to-[hsl(var(--kindai-pink))] px-4 py-2.5 text-primary-foreground">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="h-4 w-4" />
        <span>You're exploring a demo with sample data</span>
      </div>
      <Link to="/auth?signup=true">
        <Button size="sm" variant="secondary" className="h-7 text-xs font-semibold gap-1">
          Start Free Trial <ArrowRight className="h-3 w-3" />
        </Button>
      </Link>
    </div>
  );
}
