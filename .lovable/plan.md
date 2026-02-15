

## Landing Page Header Redesign

### Changes to `src/pages/Landing.tsx`

**1. Larger Logo**
- Increase the logo image from `h-9 w-9` to `h-12 w-12` (or similar).

**2. Remove "Kindai" Text**
- Delete the `<span>` element next to the logo that reads "Kindai".

**3. Add Section Navigation with Rainbow-Colored Letters**
- Add a horizontal nav bar below the logo row with links that scroll to each section (e.g., "Upload Plans", "Take-Off", "Pricing", "Estimates").
- Each nav link text will have individually colored letters using the Kindai brand palette (pink, orange, yellow, green, aqua, blue, violet), cycling through the colors per character via inline `<span>` elements.
- The "Log in" button will be placed inline within this nav row (centered with the nav items).

**4. Header Layout**
- Top row: Logo (left), "Get Started" button (right).
- Second row (centered): Navigation links with rainbow-letter styling + "Log in" button.

### Technical Details

- A helper function `rainbowText(text)` will map each character to a `<span>` with a color from the Kindai palette array, cycling through the colors.
- Navigation links will use anchor tags with `href="#section-id"` for smooth scrolling, with corresponding `id` attributes added to each feature section.
- Only `src/pages/Landing.tsx` needs to be modified.

