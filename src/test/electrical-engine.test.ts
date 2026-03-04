import { describe, expect, it } from "vitest";
import { calculateElectricalEstimate } from "@/trades/electrical/estimate-engine";

describe("electrical estimate engine (AU)", () => {
  it("calculates line-level and total values with deterministic margin and GST", () => {
    const result = calculateElectricalEstimate({
      lines: [
        { workType: "lighting_point", quantity: 4 },
        { workType: "power_point", quantity: 6 },
        { workType: "switchboard_upgrade", quantity: 1 },
      ],
      hourlyRateAud: 160,
      marginPercent: 15,
      gstRate: 10,
    });

    expect(result.labourHours).toBe(19);
    expect(result.labourCost).toBe(3040);
    expect(result.materialsCost).toBe(2240);
    expect(result.directCost).toBe(5280);
    expect(result.marginAmount).toBe(792);
    expect(result.preGstTotal).toBe(6072);
    expect(result.gst).toBe(607.2);
    expect(result.total).toBe(6679.2);
    expect(result.lines[2]?.billableUnits).toBe(1);
  });

  it("sanitizes negative quantities and applies minimum charge units", () => {
    const result = calculateElectricalEstimate({
      lines: [
        { workType: "lighting_point", quantity: -2 },
        { workType: "switchboard_upgrade", quantity: 0 },
      ],
    });

    expect(result.lines[0]?.quantity).toBe(0);
    expect(result.lines[1]?.billableUnits).toBe(1);
    expect(result.labourHours).toBe(8);
    expect(result.total).toBe(3366);
  });
});
