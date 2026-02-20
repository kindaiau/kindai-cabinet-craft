import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfidenceChip } from "@/components/trust/ConfidenceChip";
import { ReviewGateBanner } from "@/components/trust/ReviewGateBanner";
import { AssumptionBlock } from "@/components/trust/AssumptionBlock";

// ─── ConfidenceChip ───────────────────────────────────────────────────────────
describe("ConfidenceChip", () => {
  it("renders default label for each level", () => {
    const { rerender } = render(<ConfidenceChip level="high" />);
    expect(screen.getByText("High confidence")).toBeTruthy();

    rerender(<ConfidenceChip level="medium" />);
    expect(screen.getByText("Medium confidence")).toBeTruthy();

    rerender(<ConfidenceChip level="low" />);
    expect(screen.getByText("Low confidence")).toBeTruthy();
  });

  it("renders a custom label when provided", () => {
    render(<ConfidenceChip level="high" label="All good" />);
    expect(screen.getByText("All good")).toBeTruthy();
  });

  it("has role=status and correct aria-label for accessibility", () => {
    render(<ConfidenceChip level="medium" />);
    const chip = screen.getByRole("status");
    expect(chip).toBeTruthy();
    expect(chip.getAttribute("aria-label")).toBe("Medium confidence");
  });

  it("applies the correct data-status attribute", () => {
    render(<ConfidenceChip level="low" />);
    const chip = screen.getByRole("status");
    expect(chip.getAttribute("data-status")).toBe("low");
  });
});

// ─── ReviewGateBanner ─────────────────────────────────────────────────────────
describe("ReviewGateBanner", () => {
  it("renders the description text", () => {
    render(<ReviewGateBanner description="Please review before sending." />);
    expect(screen.getByText("Please review before sending.")).toBeTruthy();
  });

  it("renders the default title", () => {
    render(<ReviewGateBanner description="Any description" />);
    expect(screen.getByText("Manual review required")).toBeTruthy();
  });

  it("renders a custom title when provided", () => {
    render(<ReviewGateBanner title="Stop — review needed" description="Details here." />);
    expect(screen.getByText("Stop — review needed")).toBeTruthy();
  });

  it("has role=alert for screen readers", () => {
    render(<ReviewGateBanner description="Review this" />);
    expect(screen.getByRole("alert")).toBeTruthy();
  });
});

// ─── AssumptionBlock ──────────────────────────────────────────────────────────
describe("AssumptionBlock", () => {
  it("renders all provided items", () => {
    render(
      <AssumptionBlock items={["First assumption", "Second assumption", "Third assumption"]} />
    );
    expect(screen.getByText("First assumption")).toBeTruthy();
    expect(screen.getByText("Second assumption")).toBeTruthy();
    expect(screen.getByText("Third assumption")).toBeTruthy();
  });

  it("renders the default title 'Assumptions'", () => {
    render(<AssumptionBlock items={["some item"]} />);
    expect(screen.getByText("Assumptions")).toBeTruthy();
  });

  it("renders a custom title when provided", () => {
    render(<AssumptionBlock title="Estimating notes" items={["note one"]} />);
    expect(screen.getByText("Estimating notes")).toBeTruthy();
  });

  it("has an aria-label matching the title", () => {
    render(<AssumptionBlock title="My title" items={["item"]} />);
    expect(screen.getByLabelText("My title")).toBeTruthy();
  });
});
