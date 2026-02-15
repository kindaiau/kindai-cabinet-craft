

## Landing Page Changes

### 1. Remove Rainbow Navigation Row
Remove the second row of the header (the centered nav links with rainbow-colored letters and the "Log in" button) from `src/pages/Landing.tsx`. The top row with logo and "Get Started" button stays.

Specifically, remove:
- The `navItems` array
- The `rainbowText` helper function
- The entire `<nav>` element (second row with "Upload Plans", "Take-Off", "Pricing", "Estimates", "Log in")

### 2. Keep "How It Works" Section
The existing "How It Works" section stays as-is on the landing page.

### Technical Details

Only `src/pages/Landing.tsx` needs to be modified:
- Delete the `navItems` array (lines ~28-33)
- Delete the `rainbowText` helper function (lines ~20-26)
- Delete the `<nav>` block inside the header (the second row with centered links)
- The `safelist` in `tailwind.config.ts` stays since the How It Works section still uses dynamic classes

