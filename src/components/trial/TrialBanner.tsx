import { useTrialContext } from "@/contexts/TrialContext";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function TrialBanner() {
  const { accountStatus, timeRemaining } = useTrialContext();

  if (accountStatus !== "trial") return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isUrgent = timeRemaining < 60;

  return (
    <div
      className={`flex items-center justify-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${
        isUrgent
          ? "bg-destructive/10 text-destructive border-b border-destructive/20"
          : "bg-primary/10 text-primary border-b border-primary/20"
      }`}
    >
      <Clock className="h-4 w-4 shrink-0" />
      <span>
        Free trial: <strong>{timeStr}</strong> remaining
      </span>
      <Link
        to="mailto:hello@kindai.com.au"
        className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
      >
        Contact Us <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
