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
    notes: "Trade-scoped estimator with AS 4386 compliance review gate.",
  },
];
