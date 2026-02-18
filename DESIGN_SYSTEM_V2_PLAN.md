# KindAI Design System v2 Plan

## Goal
Keep the cyberpunk KindAI identity while making estimator workflows safer, clearer, and easier for long working sessions.

## Theme Modes

### 1) Brand mode (marketing)
- Strong glow and rainbow moments
- Hero gradients and expressive accents
- Used for landing pages, onboarding splash, promo sections

### 2) Operator mode (estimating workflow)
- Lower visual noise
- Higher readability and contrast
- Used for forms, pricing tables, assumptions, review + approval screens

## Non-negotiables
- Token-only styling (no direct hardcoded colors)
- WCAG AA contrast for critical text/actions
- Clear focus rings on keyboard navigation
- Reduced motion support (`prefers-reduced-motion`)
- No color-only status communication

## New semantic tokens (estimating trust layer)
- `--confidence-high`, `--confidence-medium`, `--confidence-low`
- `--assumption`
- `--requires-review`
- `--draft-do-not-order`
- `--locked-final`

## Components to standardize
1. ConfidenceChip
2. AssumptionBlock
3. ReviewGateBanner
4. AuditTimeline
5. EstimatingTable shell

## Rollout order
1. Add v2 tokens + themes in `src/index.css`
2. Extend Tailwind with semantic tokens
3. Add utility classes for glow/gradients/motion-safe behavior
4. Migrate pilot screens (quote form + estimate result + review screen)
5. Accessibility + performance pass

## Done definition (pilot)
- Existing look kept for brand sections
- Operator sections switched to stable readable mode
- New semantic trust states visible in UI
- No regressions in build/test
