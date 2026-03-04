import { describe, expect, it } from "vitest";
import { calculateHvacEstimate } from "@/trades/hvac/estimate-engine";

describe("hvac estimate engine (AU)", () => {
  it("calculates system-based hvac totals", () => {
    const result = calculateHvacEstimate({
      lines: [
        { system: "split_5kw", quantity: 2 },
        { system: "ventilation_fan", quantity: 3 },
      ],
      hourlyRateAud: 165,
      marginPercent: 18,
      gstRate: 10,
    });

    expect(result.labourHours).toBe(22.5);
    expect(result.labourCost).toBe(3712.5);
    expect(result.materialsCost).toBe(3480);
    expect(result.preGstTotal).toBe(8487.15);
    expect(result.total).toBe(9335.87);
  });
});
