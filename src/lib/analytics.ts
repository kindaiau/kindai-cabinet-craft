export type KindaiEventName =
  | "signup_started"
  | "trial_started"
  | "first_estimate"
  | "pricing_viewed"
  | "upgrade_clicked"
  | "checkout_completed";

export function trackEvent(event: KindaiEventName, payload: Record<string, unknown> = {}) {
  // Hook point for GA/PostHog/Segment. Keeping console fallback for now.
  console.info("[analytics]", event, payload);
}
