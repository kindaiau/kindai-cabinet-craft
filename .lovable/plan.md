

# Kindai — AI Cabinet Estimator + Wholesaler Optimiser

A bold, branded web app for Australian cabinet makers, kitchen installers, and joinery workshops to upload plans, get AI-powered material take-offs, and find the best supplier pricing — all in one place.

---

## 🎨 Branding & Design

- **Kindai color palette** used throughout: Pink (#FF46C8), Orange (#FC6456), Yellow (#FFD75E), Green (#5DD7A7), Aqua (#56DFF4), Blue (#5667DF), Violet (#7B2CBF)
- Kindai logo in the header/sidebar
- Bold gradients, colorful accents, vibrant cards and buttons
- Dark mode support with the same vivid palette
- Modern dashboard layout with sidebar navigation

---

## 🔐 Authentication & Accounts

- **Sign up / Log in** via email (and optionally Google)
- **User profiles** with business name, location (Australian state/city), and trade type
- Location is used to tailor supplier recommendations
- All estimates are saved to the user's account for later access

---

## 📄 Project Dashboard

- List of all saved projects/estimates
- Each project shows: name, date, status, total cost summary
- Create new project, duplicate, or delete existing ones
- Search and filter projects

---

## 📤 Plan Upload & AI Analysis

- **Upload page** accepting images (PNG, JPG, WEBP) and PDFs of floor plans, elevations, sketches
- Files stored in cloud storage (not database)
- **AI Vision analysis** (via Lovable AI with Gemini) extracts:
  - Cabinet types (base, wall, tall, island, vanity, panels, fillers)
  - Dimensions (width, height, depth) per unit
  - Quantities
  - Scale detection — if scale is missing, prompt user to clarify
- User can **review and edit** AI-extracted data before proceeding
- Support for multiple plan uploads per project

---

## 📋 Material Take-Off

Once cabinets are identified, generate a full material breakdown:

- **Carcass materials**: sheets of plywood/MDF/melamine, edge banding (meters), backing board, toe kicks, fillers
- **Doors & fronts**: door count, drawer fronts, material type, finish
- **Hardware**: hinges, drawer runners, handles, legs, shelf pins, screws, confirmat fasteners
- **Benchtop/stone**: square metre area, thickness, cutouts for sink/cooktop
- **Plumbing accessories** (for bathrooms): vanity basins, tap holes, mounting kits

All displayed in organised, categorised tables with quantities.

---

## 📊 Quantity Calculator

- Uses **standard Australian sheet sizes** (2400×1200mm)
- **Configurable waste factor** (10–15%, user adjustable)
- Shows: raw calculated quantity → waste factor → final rounded order quantity
- Logical nesting/optimisation to minimise waste
- Summary totals per material category

---

## 💰 Live Pricing & Wholesaler Matching

- **Web search** (via Firecrawl) to find current pricing from Australian suppliers:
  - Bunnings, Bowens, Hume Doors, ITM, Polytec, Laminex, Hafele, etc.
- Results matched to user's **state/region** for relevance
- Display pricing comparison table: supplier, unit price, total, availability
- Highlight **best value** recommendation
- Users can override/adjust prices manually

---

## 📑 Estimate Summary & Export

- Full project summary page with:
  - All cabinets with dimensions
  - Complete material list with quantities
  - Cost breakdown by category
  - Total project cost
- **Export to PDF** for client quotes
- Option to **share via link**

---

## ⚙️ Settings

- User profile management (business name, location, trade)
- Default waste factor preference
- Preferred suppliers list
- Default material preferences (e.g., always use 18mm melamine)

---

## 🛠 Technical Approach

- **Lovable Cloud** backend with Supabase for auth, database, and storage
- **Lovable AI** (Gemini) for plan image analysis and material estimation
- **Firecrawl** connector for live Australian supplier price scraping
- All AI processing via edge functions (no client-side API keys)

