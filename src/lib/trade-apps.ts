export interface TradeApp {
  slug: string;
  name: string;
  trade: string;
  status: "live" | "in_progress" | "scoping";
  region: "AU";
  notes: string;
}

export const TRADE_APPS: TradeApp[] = [
  {
    slug: "cabinet-craft",
    name: "Kindai Cabinet Craft",
    trade: "Cabinet Making",
    status: "live",
    region: "AU",
    notes: "Core app and base theme for suite.",
  },
  {
    slug: "plumbing-estimator",
    name: "Kindai Plumbing Estimator",
    trade: "Plumbing",
    status: "in_progress",
    region: "AU",
    notes: "AU fixture standards + deterministic engine started.",
  },
  {
    slug: "electrical-estimator",
    name: "Kindai Electrical Estimator",
    trade: "Electrical",
    status: "in_progress",
    region: "AU",
    notes: "Trade module in build.",
  },
  {
    slug: "painting-estimator",
    name: "Kindai Painting Estimator",
    trade: "Painting",
    status: "in_progress",
    region: "AU",
    notes: "Trade module in build.",
  },
  {
    slug: "flooring-estimator",
    name: "Kindai Flooring Estimator",
    trade: "Flooring",
    status: "in_progress",
    region: "AU",
    notes: "Trade module in build.",
  },
];
