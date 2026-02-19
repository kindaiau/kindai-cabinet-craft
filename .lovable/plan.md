

# 5-Minute Registered Trial with Waiting List

## Overview
Every user must sign up with their email to access the app. After registration, they get a **5-minute trial** to explore the full platform. When the trial expires, they're placed on a **waiting list** and shown a "you're on the list" screen until their account is activated.

## How It Works

1. **User signs up** with email and password (existing auth flow, unchanged)
2. **On first login**, a 5-minute countdown starts
3. **During the trial**, a countdown banner shows remaining time with a "You're on the free trial" indicator
4. **When time expires**, a blocking screen appears: "Your trial has ended -- you're on the waiting list! We'll notify you when your account is activated."
5. **Admin activates** users by updating their profile status (via the database)

## Database Changes

A new `trial_started_at` and `account_status` column will be added to the `profiles` table:
- `trial_started_at` (timestamptz, nullable) -- set on first protected page visit
- `account_status` (text, default `'trial'`) -- values: `trial`, `waitlisted`, `active`

The `handle_new_user` trigger already creates a profile row on signup, so new users will default to `trial` status.

## New Files

### 1. `src/contexts/TrialContext.tsx`
- React context wrapping the authenticated app
- On mount, reads the user's `profiles` row for `trial_started_at` and `account_status`
- If `trial_started_at` is null, sets it to `now()` via an update query
- Runs a 1-second interval countdown from the 5-minute mark
- Exposes: `timeRemaining`, `isTrialExpired`, `accountStatus` (`trial` | `waitlisted` | `active`)
- When countdown hits zero, updates `account_status` to `waitlisted`
- If `accountStatus === 'active'`, all trial logic is bypassed

### 2. `src/components/trial/TrialBanner.tsx`
- Slim banner at the top of the app layout
- Shows: "Trial: 3:42 remaining" with a gradient accent
- Includes a small "Upgrade" or contact CTA
- Only visible when `accountStatus === 'trial'` and trial is running

### 3. `src/components/trial/WaitlistScreen.tsx`
- Full-page blocking screen (not dismissable)
- Message: "You're on the waiting list!"
- Subtext: "Thanks for trying Kindai. We'll email you at [user email] when your full account is ready."
- Sign-out button so they can leave cleanly
- Shown when `accountStatus === 'waitlisted'`

## Modified Files

### 4. `src/components/auth/ProtectedRoute.tsx`
- After confirming the user has a session, wrap `<Outlet />` with the `TrialProvider`
- No changes to the auth redirect logic -- unauthenticated users still go to `/auth`

### 5. `src/components/layout/AppLayout.tsx`
- Import `useTrialContext`
- If `accountStatus === 'waitlisted'`, render `<WaitlistScreen />` instead of the normal layout
- If `accountStatus === 'trial'`, show `<TrialBanner />` above the main content area

### 6. `src/pages/Landing.tsx`
- Add a "Join the Waiting List" secondary CTA alongside the existing "Start Estimating" button
- Both link to `/auth?signup=true` (same signup flow -- the trial/waitlist logic handles the rest)

## Technical Details

### Database migration SQL
```sql
ALTER TABLE public.profiles
  ADD COLUMN trial_started_at timestamptz,
  ADD COLUMN account_status text NOT NULL DEFAULT 'trial';
```

### Trial logic (TrialContext)
- Trial duration: 300 seconds (5 minutes)
- Elapsed = `now() - trial_started_at`
- Remaining = `max(0, 300 - elapsed)`
- When remaining hits 0, fire `UPDATE profiles SET account_status = 'waitlisted' WHERE user_id = auth.uid()`
- Active users (`account_status = 'active'`) skip all trial checks

### Admin activation
- To activate a user, update their profile: `UPDATE profiles SET account_status = 'active' WHERE user_id = '<id>'`
- This can be done from the Cloud database view. A future admin dashboard could automate this.

### Security
- RLS already ensures users can only read/update their own profile
- The `account_status` column is controlled server-side; no client-side bypass can grant access since the blocking screen is rendered based on the DB value
- Trial countdown is validated against `trial_started_at` from the database, not localStorage (no cheating by clearing storage)

