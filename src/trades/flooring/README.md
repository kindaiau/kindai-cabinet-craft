# Flooring Trade Module (AU)

This module seeds the flooring estimator with Australian-market defaults.

## Included
- `au-standards.ts`: flooring-system labour/material baseline assumptions in AUD per m².
- `estimate-engine.ts`: deterministic area-based estimate calculations (labour, margin, GST, total).

## Notes
- Values are baseline defaults for MVP estimating and should be calibrated with installer productivity, substrate prep complexity, and supplier pricing by state.
- GST is modelled at 10% by default.
- Future steps: underlay/subfloor prep variants, room-access complexity factors, and regional price multipliers.
