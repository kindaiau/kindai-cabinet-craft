# Painting Trade Module (AU)

Australian baseline assumptions and deterministic estimating for painting work packages.

## Included
- `au-standards.ts`: surface-type labour/material baseline assumptions in AUD.
- `estimate-engine.ts`: deterministic estimate calculations with line-level area and prep/labour breakdown.

## Model Notes
- Areas are sanitized (`areaSqm < 0` becomes `0`).
- Some surfaces include fixed prep time (`prepHoursFixed`) when area is greater than zero.
- Margin is applied to direct cost (`labour + materials`) before GST.
- GST defaults to 10% and is calculated on the pre-GST subtotal.

## Future Enhancements
- Add paint-system tiers (2-coat vs 3-coat, premium systems).
- Add regional labour multipliers and access/height complexity loading.
