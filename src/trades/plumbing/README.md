# Plumbing Trade Module (AU)

This module seeds the plumbing estimator with Australian-market defaults.

## Included
- `au-standards.ts`: fixture-level labour/material baseline assumptions in AUD.
- `estimate-engine.ts`: deterministic fixture-based estimate calculations (labour, margin, GST, total).

## Notes
- Values are baseline defaults for MVP estimating and should be calibrated against supplier rates and installer productivity by state.
- GST is modelled at 10% by default.
- Future steps: compliance checks (NCC/AS-NZS references), water connection variants, and regional price multipliers.
