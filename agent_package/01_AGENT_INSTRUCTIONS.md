# AGENT INSTRUCTIONS — Shri Narsang Bike Care
## Read this file FIRST before touching any code.

---

## What You Are Building
A **production-ready PWA** (Progressive Web App) for a bike garage/workshop in India.
App name: **Shri Narsang Bike Care**
The owner (mechanic) uses this app to manage vehicles, track jobs, record payments, and send WhatsApp notifications to customers.

## Reference Files (read all of them)
1. `01_AGENT_INSTRUCTIONS.md` — this file (start here)
2. `02_PRD_AND_SCREENS.md` — all 15 screens, every button, every state
3. `03_TECH_STACK_AND_STRUCTURE.md` — tech decisions + folder structure
4. `04_DATABASE_SCHEMA.sql` — run this in Supabase to create all tables
5. `05_API_SPEC.md` — all API calls the frontend needs
6. `06_DESIGN_SYSTEM.md` — exact colors, fonts, component specs
7. `07_WHATSAPP_TEMPLATES.md` — exact WA message formats (3 languages)
8. `translations/en.json` — English strings (120 keys)
9. `translations/hi.json` — Hindi strings (120 keys)
10. `translations/gu.json` — Gujarati strings (120 keys)
11. `PROTOTYPE_REFERENCE.html` — visual reference (open in browser)

---

## Build Order (follow this exactly)

### Phase 1 — Foundation (do this before any UI)
1. Create Vite + React + TypeScript project
2. Install dependencies (see `03_TECH_STACK`)
3. Set up Supabase project → run `04_DATABASE_SCHEMA.sql`
4. Create `.env` with Supabase URL + anon key
5. Set up i18next with 3 translation files
6. Set up Zustand store (vehicleStore, paymentStore, langStore)
7. Set up Supabase client + all service functions from `05_API_SPEC.md`

### Phase 2 — Core Screens
8. Implement design tokens (CSS vars from `06_DESIGN_SYSTEM.md`)
9. Build reusable components: BottomNav, Header, Card, Badge, Button, ProgressBar
10. Build screens in this order:
    - Splash (static)
    - Dashboard (needs vehicle list from DB)
    - Intake Form (needs vehicle create)
    - Card Detail (needs single vehicle fetch)
    - Edit Vehicle (needs vehicle update)
    - Confirm Done dialog (needs status update)
    - WA Sent screen (static + wa.me link)

### Phase 3 — Payment Flow
11. Payment dialog (needs payment create)
12. WA Partial screen (static + wa.me)
13. Partial Tracker (needs payment history fetch)
14. Add Installment (needs payment update)
15. WA Full screen (static + wa.me)
16. Paid Success screen (static)

### Phase 4 — Report & Follow-up
17. Report screen (needs filtered vehicle list)
18. Follow-up screen (needs done-but-unpaid list)

### Phase 5 — Production Polish
19. Auth screen (mechanic login via Supabase Auth)
20. Settings screen (garage config)
21. Empty states (no vehicles, no payments)
22. Error states (offline, failed save)
23. Loading skeletons
24. PWA manifest + service worker (Vite PWA plugin)
25. Test on actual Android phone

---

## Critical Rules

### Data Rules
- ALL vehicle plates must be stored and displayed in UPPERCASE
- Phone numbers stored WITHOUT +91 prefix, displayed WITH +91
- Amounts stored as integers in paise (₹2500 = 250000) OR as integer rupees — pick one and be consistent. **Recommended: store as integer rupees.**
- Dates stored as ISO strings in UTC, displayed in IST (India/Kolkata timezone)
- Vehicle status must be one of: `'in_repair' | 'done' | 'paid'`
- Payment type must be one of: `'full' | 'partial'`
- Payment method must be one of: `'upi' | 'cash' | 'bank'`

### UI Rules
- Default language: English
- Language preference saved to localStorage key: `snbc_lang`
- Bottom nav always visible (z-index: 100) on all screens EXCEPT splash
- Language pill always visible (z-index: 998) on all screens EXCEPT splash
- Orange color: `#E8590C` (never deviate)
- Heading font: Bebas Neue (app name, section titles, stat numbers)
- Body font: Rajdhani (all other text)
- Plate/code font: Share Tech Mono (number plates, amounts in mono)

### WhatsApp Rules
- Use `wa.me` links (NOT WhatsApp Business API) — Phase 1
- Format: `https://wa.me/91{10-digit-number}?text={encoded message}`
- Always send to 3 people: owner, customer, mechanic (mechanic's own number from Settings)
- Message language should match the app's current language setting
- See `07_WHATSAPP_TEMPLATES.md` for exact message formats

### Validation Rules (intake form)
Required fields: customer_name, customer_whatsapp, vehicle_type, number_plate, problem, estimate
Optional fields: owner_name, owner_whatsapp, delivery_by
Number plate regex: `/^[A-Z]{2}[-\s]?\d{1,2}[-\s]?[A-Z]{1,3}[-\s]?\d{4}$/` (validate but don't block)
WhatsApp: exactly 10 digits, no spaces

---

## What is NOT in scope (do NOT build)
- Multiple garage support (single garage only)
- Customer-facing app (only mechanic uses this)
- Online payment processing (just track received cash/UPI)
- Automated WhatsApp (only wa.me links — mechanic manually sends)
- Push notifications (not in Phase 1)
- Analytics / charts
- Cloud image upload

---

## Deployment
- Host on **Vercel** (free tier is fine)
- Supabase free tier: 500MB DB, 2GB bandwidth — sufficient for single garage
- Domain: can use vercel.app subdomain initially
- HTTPS required for PWA (Vercel provides this automatically)

---

## Definition of Done
The app is complete when:
- [ ] Mechanic can log in
- [ ] Mechanic can add a new vehicle (all 9 fields)
- [ ] Vehicle appears on Dashboard in "In Repair" tab
- [ ] Mechanic can tap a vehicle card to see full details
- [ ] Mechanic can mark vehicle as Done → WA link opens with pre-filled message
- [ ] Mechanic can record full payment → 3 WA links generated
- [ ] Mechanic can record partial payment → tracker shows progress
- [ ] Mechanic can add second installment → marked as fully paid
- [ ] Report screen shows all vehicles filterable by date
- [ ] Follow-up screen shows done-but-unpaid vehicles with bulk WA
- [ ] App works offline for viewing (new entries need internet)
- [ ] App installable on Android home screen (PWA)
- [ ] All 3 languages switch correctly
- [ ] No hardcoded dummy data anywhere
