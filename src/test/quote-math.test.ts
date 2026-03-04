import { describe, expect, it } from "vitest";
import { calculateQuoteTotals } from "@/lib/quote-math";

describe("quote math", () => {
  it("calculates totals with GST correctly", () => {
    const totals = calculateQuoteTotals({
      materialsSubtotal: 1250,
      labourFab: 350,
      labourInstall: 150,
      gstRate: 10,
    });

    expect(totals.labourTotal).toBe(500);
    expect(totals.preGstTotal).toBe(1750);
    expect(totals.gst).toBe(175);
    expect(totals.total).toBe(1925);
  });

  it("clamps negative inputs to zero", () => {
    const totals = calculateQuoteTotals({
      materialsSubtotal: -100,
      labourFab: -50,
      labourInstall: 30,
      gstRate: 10,
    });

    expect(totals.materialsSubtotal).toBe(0);
    expect(totals.labourFab).toBe(0);
    expect(totals.labourInstall).toBe(30);
    expect(totals.total).toBe(33);
  });
});
