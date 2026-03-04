import { describe, expect, it } from "vitest";
import { calculateFlooringEstimate } from "@/trades/flooring/estimate-engine";

describe("flooring estimate engine (AU)", () => {
  it("calculates area-based flooring totals", () => {
    const result = calculateFlooringEstimate({
      lines: [
        { system: "hybrid_plank", areaM2: 60 },
        { system: "tile", areaM2: 20 },
      ],
      hourlyRateAud: 120,
      marginPercent: 15,
      gstRate: 10,
    });

    expect(result.labourHours).toBe(55);
    expect(result.labourCost).toBe(6600);
    expect(result.materialsCost).toBe(5480);
    expect(result.preGstTotal).toBe(13892);
    expect(result.total).toBe(15281.2);
  });
});
