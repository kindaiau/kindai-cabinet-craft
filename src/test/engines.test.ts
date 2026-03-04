import { describe, expect, it } from "vitest";
import {
  calculateLabour,
  DEFAULT_LABOUR_CONFIG,
  type CabinetInput,
  type LabourConfig,
} from "@/lib/labour-engine";
import { calculateTakeoff } from "@/lib/takeoff-engine";

describe("labour engine", () => {
  const cabinets: CabinetInput[] = [
    { type: "base", width_mm: 600, quantity: 2 },
    { type: "wall", width_mm: 900, quantity: 1 },
  ];

  it("calculates hourly labour totals", () => {
    const result = calculateLabour(cabinets, DEFAULT_LABOUR_CONFIG);

    expect(result.fabHours).toBe(5.5);
    expect(result.installHours).toBe(2);
    expect(result.fabTotal).toBe(357.5);
    expect(result.installTotal).toBe(150);
  });

  it("calculates per-linear-metre labour totals", () => {
    const config: LabourConfig = { ...DEFAULT_LABOUR_CONFIG, method: "per_lm" };
    const result = calculateLabour(cabinets, config);

    expect(result.fabTotal).toBe(735);
    expect(result.installTotal).toBe(378);
    expect(result.fabHours).toBe(0);
    expect(result.installHours).toBe(0);
  });
});

describe("takeoff engine", () => {
  it("returns adjusted summary quantities with waste applied", () => {
    const result = calculateTakeoff([
      {
        label: "Base Cabinet",
        type: "base",
        width_mm: 600,
        height_mm: 720,
        depth_mm: 560,
        door_count: 2,
        drawer_count: 0,
        shelf_count: 1,
      },
    ]);

    expect(result.summary.totalCarcassSheets).toBeGreaterThan(0);
    expect(result.summary.totalDoorSheets).toBeGreaterThan(0);
    expect(result.summary.totalEdgeBanding_m).toBeGreaterThan(0);
    expect(result.lineItems.length).toBeGreaterThan(0);
  });

  it("increases sheet requirements for larger mixed-cabinet jobs", () => {
    const small = calculateTakeoff([
      {
        label: "Small Base",
        type: "base",
        width_mm: 600,
        height_mm: 720,
        depth_mm: 560,
      },
    ]);

    const mixedLarge = calculateTakeoff([
      {
        label: "Small Base",
        type: "base",
        width_mm: 600,
        height_mm: 720,
        depth_mm: 560,
      },
      {
        label: "Tall Pantry",
        type: "tall",
        width_mm: 1200,
        height_mm: 2400,
        depth_mm: 650,
      },
    ]);

    expect(mixedLarge.summary.totalCarcassSheets).toBeGreaterThan(small.summary.totalCarcassSheets);
    expect(mixedLarge.summary.totalDoorSheets).toBeGreaterThanOrEqual(small.summary.totalDoorSheets);
  });

  it("respects waste factor overrides", () => {
    const normal = calculateTakeoff([
      {
        label: "Base Cabinet",
        type: "base",
        width_mm: 600,
        height_mm: 720,
        depth_mm: 560,
      },
    ]);

    const highWaste = calculateTakeoff(
      [
        {
          label: "Base Cabinet",
          type: "base",
          width_mm: 600,
          height_mm: 720,
          depth_mm: 560,
        },
      ],
      { carcass: 30 }
    );

    expect(highWaste.summary.totalCarcassSheets).toBeGreaterThanOrEqual(normal.summary.totalCarcassSheets);
  });
});
