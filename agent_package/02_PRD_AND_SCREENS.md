# PRD + SCREENS SPEC — Shri Narsang Bike Care

---

## Product Overview
Single-user PWA for a bike workshop mechanic. The mechanic adds vehicles, tracks repair jobs, records payments, and sends WhatsApp reminders. One mechanic, one garage.

## Users
- **Primary User:** The mechanic/shop owner (one person)
- **Recipients of WA messages:** Vehicle owners and customers (they never open the app)

---

## Screen Map (15 screens)

```
s-splash              → app launch
s-intake              → add new vehicle (9-field form)
s-dashboard           → job list (In Repair + Done tabs)
s-card-detail         → single vehicle full info
s-chatbot-edit        → edit vehicle details
s-confirm-done        → dialog: confirm mark as done + send WA
s-wa-sent             → success: WA sent, done marked
s-payment             → dialog: record payment amount
s-payment-wa-partial  → 3 WA messages for partial payment
s-partial-track       → partial payment tracker
s-payment-installment → add remaining payment installment
s-payment-wa-full     → 3 WA messages for full payment
s-paid-success        → payment complete success
s-report              → search + date filter all jobs
s-followup            → bulk follow-up WA to pending vehicles
```

---

## Screen Specs

### S1: Splash (`s-splash`)
**Purpose:** App launch screen, branding
**Background:** Dark #0a0a0a with SVG garage tools (gears, wrenches) decorative pattern
**Elements:**
- App icon 🛵 in orange rounded square
- App name "Shri Narsang Bike Care" in Bebas Neue 34px
- Tagline in Rajdhani (translatable)
- Orange loading bar animation (1.5s)
- Button: "Get Started →" → goes to `s-intake`
- Button: "View Dashboard First" → goes to `s-dashboard`
**Notes:** No bottom nav, no language pill on this screen

---

### S2: Intake Form (`s-intake`)
**Purpose:** Add a new vehicle to the system
**Data collected (9 fields):**

| Field ID | Label | Type | Required | Validation |
|---|---|---|---|---|
| f-cname | Customer Name | text | YES | min 2 chars |
| f-wa | Customer WhatsApp | tel | YES | exactly 10 digits |
| f-vtype | Vehicle Type | select (Scooter/Bike) | YES | must select one |
| f-plate | Number Plate | text, auto-uppercase | YES | plate format |
| f-oname | Owner Name | text | NO | — |
| f-onum | Owner WhatsApp | tel | NO | 10 digits if filled |
| f-problem | Problem Description | textarea | YES | min 5 chars |
| f-est | Estimate (₹) | number | YES | positive integer |
| f-del | Delivery By | text | NO | free text |

**Progress indicator:** 9 orange dots at top, fill as fields are completed
**On submit:**
1. Validate all required fields
2. Show error if invalid (translated error message)
3. Save vehicle to DB with status = 'in_repair'
4. Navigate to `s-dashboard`
5. Reset form fields

**On save, vehicle object created:**
```json
{
  "customer_name": "string",
  "customer_whatsapp": "10-digit string",
  "vehicle_type": "Scooter | Bike",
  "number_plate": "UPPERCASE string",
  "owner_name": "string | null",
  "owner_whatsapp": "10-digit string | null",
  "problem": "string",
  "estimate": "integer (rupees)",
  "delivery_by": "string | null",
  "status": "in_repair",
  "created_at": "ISO timestamp"
}
```

---

### S3: Dashboard (`s-dashboard`)
**Purpose:** Main job board — see all active vehicles

**Header stats (computed from DB):**
- Count of vehicles with status = 'in_repair'
- Count of vehicles with status = 'done' OR 'paid'
- Sum of estimates for all vehicles that have no completed payment

**Two tabs:**
- **In Repair tab:** vehicles with status = 'in_repair', sorted by created_at DESC (newest first)
- **Done tab:** vehicles with status = 'done' (ready but unpaid) OR status = 'paid', sorted by updated_at DESC

**Each "In Repair" card shows:**
- Number plate (Share Tech Mono)
- Customer name
- Problem description (truncated 50 chars)
- Time since created (e.g. "3 din se")
- Estimate amount
- "⚠️ Overdue" badge if delivery_by has passed
- Button: "Mark as Done ✅" → goes to `s-confirm-done`
- Tap card body → goes to `s-card-detail`

**Each "Done" card shows (payment pending):**
- Number plate, customer name
- Time since marked done
- Estimate amount
- Button: "💰 Payment Received" → goes to `s-payment`
- Button: "🔔 Remind" → goes to `s-followup`
- Tap card → goes to `s-card-detail`

**Each "Done" card (partial payment):**
- Progress bar showing % paid
- "₹X received / ₹Y remaining" labels
- Button: "📊 View Tracker" → goes to `s-partial-track`
- Button: "+ Add Payment" → goes to `s-payment-installment`

**Empty states:**
- In Repair empty: "Koi gaadi nahi 🎉 Sab repair complete!"
- Done empty: "Koi pending payment nahi ✅"

---

### S4: Card Detail (`s-card-detail`)
**Purpose:** See complete info for one vehicle
**Context:** Receives vehicle_id from navigation state
**Shows all 9 form fields** in info-row format
**Owner fields** highlighted in orange background (to distinguish from customer)
**Buttons:**
- "Mark as Done ✅" → `s-confirm-done`
- "✏️ Edit Details" → `s-chatbot-edit`
- "← Back to Dashboard" → `s-dashboard`

---

### S5: Edit Vehicle (`s-chatbot-edit`)
**Purpose:** Edit any field of an existing vehicle
**Note:** Prototype shows a chat UI but production should use a FORM (same as intake form, pre-filled with existing data)
**Fields:** Same 9 fields, all pre-filled
**On save:**
1. Update vehicle record in DB
2. Navigate to `s-card-detail`
3. Show brief success toast

---

### S6: Confirm Done Dialog (`s-confirm-done`)
**Purpose:** Confirmation before marking vehicle as done + WA preview
**Context:** Receives vehicle_id
**Shows:**
- WA message preview (customer's message)
- Customer name + number
**Buttons:**
- "✅ Yes Send — Mark as Done" → updates status to 'done', opens wa.me link, goes to `s-wa-sent`
- "Cancel" → back to `s-dashboard`

**WA link format:**
```
https://wa.me/91{customer_whatsapp}?text={encoded vehicle ready message}
```

---

### S7: WA Sent (`s-wa-sent`)
**Purpose:** Confirmation that vehicle is marked done
**Shows:**
- Big ✅ icon
- "Marked as Done"
- 8-second undo countdown timer
**Undo logic:**
- If mechanic taps "⏪ Undo" within 8 seconds → revert status back to 'in_repair'
- After 8 seconds → undo button disappears
**Buttons:**
- "View Dashboard →" → `s-dashboard`, opens Done tab
- "+ New Vehicle" → `s-intake`

---

### S8: Payment Dialog (`s-payment`)
**Purpose:** Record payment received for a done vehicle
**Context:** Receives vehicle_id
**Shows:**
- Total estimate amount
- Input: "How much received today?"
- Live calculation: received / remaining / progress bar
- Warning if partial: "₹X remaining — owner will get WA reminder"
**Buttons:**
- "✅ Full Payment Confirm" → records full payment, goes to `s-payment-wa-full`
- "⚡ Save Partial + Send WA" → records partial payment, goes to `s-payment-wa-partial`
- "Cancel" → back to `s-dashboard`

**Payment object created:**
```json
{
  "vehicle_id": "uuid",
  "amount_paid": "integer",
  "total_amount": "integer",
  "payment_type": "full | partial",
  "payment_method": "upi | cash | bank",
  "paid_at": "ISO timestamp"
}
```

**On full payment:** update vehicle status to 'paid'
**On partial payment:** vehicle status stays 'done', create payment record with type='partial'

---

### S9: WA Partial Messages (`s-payment-wa-partial`)
**Purpose:** Show 3 WA messages for partial payment, provide send links
**Shows 3 message cards:**
1. To Owner — partial received, balance pending
2. To Customer — payment update with UPI link
3. To Mechanic (self) — record copy

Each card has a "Send" button that opens `wa.me` link
**Buttons:**
- "📊 View Tracker →" → `s-partial-track`
- "Back to Dashboard" → `s-dashboard`

---

### S10: Partial Tracker (`s-partial-track`)
**Purpose:** Track ongoing partial payment
**Context:** Receives vehicle_id
**Shows:**
- Vehicle plate + customer name
- Progress bar: (total_paid / estimate) × 100%
- "₹X received"
- "₹Y remaining" in red badge
- Payment history list (all installments)
**Buttons:**
- "💰 Baaki Liya" → `s-payment-installment`
- WA Remind button → `s-payment-wa-partial`

---

### S11: Add Installment (`s-payment-installment`)
**Purpose:** Record the remaining/next installment
**Context:** Receives vehicle_id + payment_id
**Shows:**
- Previously received amount
- Remaining amount
- Input: amount for this installment
- Payment method selector (UPI / Cash / Bank)
- Note field (optional)
- Green confirmation: "Full payment will be complete!" if amount = remaining
**Buttons:**
- "Confirm — Send WhatsApp 📱" → saves installment, goes to `s-payment-wa-full`
- "← Back to Tracker" → `s-partial-track`

---

### S12: WA Full Payment Messages (`s-payment-wa-full`)
**Purpose:** Show 3 WA messages for full/final payment
**Same structure as S9 but full payment messages**
**Header:** Green "Full Payment Complete!" banner
**Buttons:**
- "🎉 View Success" → `s-paid-success`
- "Back to Dashboard" → `s-dashboard`

---

### S13: Paid Success (`s-paid-success`)
**Purpose:** Celebration screen — payment complete
**Shows:**
- Big 💚 icon
- Customer name + amount
- 3 green checkmarks: Owner WA ✓, Customer WA ✓, Mechanic record ✓
- Vehicle card with PAID badge
**Button:**
- "Back to Dashboard" → `s-dashboard`

---

### S14: Report (`s-report`)
**Purpose:** Search and filter all jobs by date
**Features:**
- Search bar (search by plate or customer name — live filter)
- Date range picker (From / To)
- "🔍 Search" button — filter DB results
- Summary: Total Earned (sum of all payments), Total Jobs (count)
- List of all vehicles with status badge + amount
- Tap row → `s-card-detail`
- Partial rows → `s-partial-track`

---

### S15: Follow-up (`s-followup`)
**Purpose:** Bulk send WA reminders to done-but-unpaid vehicles
**Shows:**
- List of vehicles with status = 'done' (no payment yet)
- Each has a toggle switch (default ON)
- Info banner explaining toggle behavior
**Buttons:**
- "Send WhatsApp to X Selected" → generates wa.me links for all selected, opens them sequentially
- Top-right "Bulk WA" button → same

**WA message for follow-up:**
"Namaste {customer_name} ji! 🙏 Aapki {vehicle_type} ({plate}) tayyaar hai. Kabhi bhi pickup kar sakte hain. — Shri Narsang Bike Care 🛵"

---

## Data Flow Summary

```
Add Vehicle → DB (status: in_repair)
    ↓
Mark Done → DB (status: done) + WA to customer
    ↓
Record Payment →
    Full: DB (status: paid, payment record) + 3 WA links
    Partial: DB (payment record, partial) + 3 WA links
        ↓
    Add Installment → DB (new payment record)
        ↓
    All paid: DB (status: paid) + 3 WA links
```

---

## Edge Cases to Handle

1. **Vehicle marked done by accident** → 8-second undo window
2. **Partial payment that exactly equals remaining** → auto-treat as full payment
3. **Delivery date in the past** → show "⚠️ Overdue" badge in red
4. **Search returns nothing** → empty state "No results found"
5. **Customer and owner are same person** → owner fields optional; if blank, use customer details for WA
6. **Network offline when saving** → show error toast "No internet. Try again."
7. **Number plate already exists** → show warning "Plate already in system. Continue?" (allow duplicates with warning)
8. **Report with no date range** → show ALL vehicles
9. **Follow-up with all toggles OFF** → disable "Send" button
