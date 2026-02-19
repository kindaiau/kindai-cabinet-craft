
# Mobile Optimization Plan

## Problem
The app is nearly unusable on mobile because the 256px-wide sidebar is always visible, leaving barely any room for content. Additionally, page content needs tighter spacing on small screens.

## What Changes

### 1. Collapsible Mobile Navigation
- On screens smaller than 768px, the sidebar will be **hidden by default**
- A **hamburger menu button** will appear in a slim top header bar showing the Kindai logo
- Tapping it opens the sidebar as a **slide-over Sheet** (overlay) from the left
- Tapping any nav link automatically closes the sheet
- On desktop (768px+), the sidebar stays exactly as it is today -- no changes

### 2. AppLayout Update
- Add a **mobile top bar** (visible only on small screens) with the logo and a menu toggle button
- The main content area gets proper mobile padding

### 3. Dashboard Touch-Friendly Tweaks
- Project cards stack in a **single column** on mobile instead of a 2-3 column grid
- Search bar goes **full width** on mobile
- Slightly larger tap targets for the delete button

### 4. Other Pages
- QuoteBuilder, Settings, Upload Plans, and ProjectDetail already use reasonable layouts but will benefit from the sidebar fix since they'll now get the full screen width on mobile

---

## Technical Details

**Files to modify:**

1. **`src/components/layout/AppLayout.tsx`**
   - Import `useIsMobile`, `Sheet`/`SheetContent` components, and state for open/close
   - On mobile: render a top bar with hamburger + logo, wrap `AppSidebar` inside a `Sheet` (side="left")
   - On desktop: render sidebar inline as before

2. **`src/components/layout/AppSidebar.tsx`**
   - Accept an optional `onNavClick` callback prop
   - Call `onNavClick` when any nav link is clicked (so the sheet closes on mobile)
   - No visual changes to the sidebar itself

3. **`src/pages/Dashboard.tsx`**
   - Change project grid from `sm:grid-cols-2 lg:grid-cols-3` to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
   - Make search input full width on mobile (`max-w-full md:max-w-md`)

No new dependencies required. Uses the existing `Sheet` component and `useIsMobile` hook already in the project.
