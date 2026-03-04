import { describe, expect, it } from "vitest";
import { calculatePaintingEstimate } from "@/trades/painting/estimate-engine";

describe("painting estimate engine (AU)", () => {
  it("calculates area-based totals with prep, margin, and GST", () => {
    const result = calculatePaintingEstimate({
      lines: [
        { surfaceType: "interior_walls", areaSqm: 100 },
        { surfaceType: "trim_and_doors", areaSqm: 20 },
      ],
      hourlyRateAud: 100,
      marginPercent: 18,
      gstRate: 10,
    });

    expect(result.labourHours).toBe(21.8);
    expect(result.labourCost).toBe(2180);
    expect(result.materialsCost).toBe(946);
    expect(result.directCost).toBe(3126);
    expect(result.marginAmount).toBe(562.68);
    expect(result.preGstTotal).toBe(3688.68);
    expect(result.gst).toBe(368.87);
    expect(result.total).toBe(4057.55);
    expect(result.lines[1]?.prepHours).toBe(1);
  });

  it("sanitizes negative areas and only applies prep when area is billable", () => {
    const result = calculatePaintingEstimate({
      lines: [
        { surfaceType: "exterior_walls", areaSqm: -10 },
        { surfaceType: "feature_wall", areaSqm: 12.5 },
      ],
    });

    expect(result.lines[0]?.areaSqm).toBe(0);
    expect(result.lines[0]?.prepHours).toBe(0);
    expect(result.labourHours).toBe(3.5);
    expect(result.total).toBe(657.58);
  });
});
