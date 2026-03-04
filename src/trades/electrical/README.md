# Electrical Trade Module (AU)

Australian baseline assumptions and deterministic estimating for common electrical work packages.

## Included
- `au-standards.ts`: work-type labour/material baseline assumptions in AUD.
- `estimate-engine.ts`: deterministic estimate calculations with typed line-level outputs and job totals.

## Model Notes
- Line quantities are sanitized (`quantity < 0` becomes `0`).
- Optional `minimumChargeUnits` in standards supports fixed minimum charge work (for example, switchboard upgrades).
- Margin is applied to direct cost (`labour + materials`) before GST.
- GST defaults to 10% and is calculated on the pre-GST subtotal.

## Future Enhancements
- Add state-level multipliers and switchboard complexity classes.
- Add AS/NZS compliance metadata and certificate-of-compliance fee options.
