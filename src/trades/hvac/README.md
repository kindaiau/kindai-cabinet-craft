# HVAC Trade Module (AU)

This module seeds the HVAC estimator with Australian-market defaults.

## Included
- `au-standards.ts`: system-level labour/material baseline assumptions in AUD.
- `estimate-engine.ts`: deterministic system-based estimate calculations (labour, margin, GST, total).

## Notes
- Values are baseline defaults for MVP estimating and should be calibrated against equipment supplier pricing, site conditions, and installer productivity by state.
- GST is modelled at 10% by default.
- Future steps: refrigerant line-set length allowances, electrical isolation upgrades, and zoning complexity multipliers.
