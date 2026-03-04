import { describe, expect, it } from "vitest";
import { calculatePlumbingEstimate } from "@/trades/plumbing/estimate-engine";

describe("plumbing estimate engine (AU)", () => {
  it("calculates fixture-based totals with GST and margin", () => {
    const result = calculatePlumbingEstimate({
      lines: [
        { fixture: "toilet", quantity: 2 },
        { fixture: "vanity", quantity: 1 },
      ],
      hourlyRateAud: 150,
      marginPercent: 20,
      gstRate: 10,
    });

    expect(result.labourHours).toBe(8);
    expect(result.labourCost).toBe(1200);
    expect(result.materialsCost).toBe(420);
    expect(result.preGstTotal).toBe(1944);
    expect(result.total).toBe(2138.4);
  });
});
