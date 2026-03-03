import { useEffect } from "react";
import { FileText } from "lucide-react";

import { AssumptionBlock } from "@/components/trust/AssumptionBlock";
import { ConfidenceChip } from "@/components/trust/ConfidenceChip";
import { ReviewGateBanner } from "@/components/trust/ReviewGateBanner";
import { trackEvent } from "@/lib/analytics";

export default function Estimates() {
  useEffect(() => {
    trackEvent("first_estimate", { source: "estimates_page" });
  }, []);
  return (
    <div className="p-6 md:p-8" data-theme="operator">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Estimates</h1>
          <p className="mt-1 text-muted-foreground">View and export your project estimates</p>
        </div>
        <ConfidenceChip level="medium" label="Awaiting first reviewed estimate" />
      </div>

      <div className="mt-6">
        <ReviewGateBanner description="All generated estimates remain in Draft — Do Not Order until reviewed and approved." />
      </div>

      <div className="mt-6">
        <AssumptionBlock
          items={[
            "Pricing can change if supplier rate cards are outdated.",
            "Missing dimensions must be confirmed before final approval.",
            "Exports should only be sent after manual review is complete.",
          ]}
        />
      </div>

      <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-border bg-card/60 py-14 text-center">
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
