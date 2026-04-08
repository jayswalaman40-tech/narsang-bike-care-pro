# DESIGN SYSTEM — Shri Narsang Bike Care

---

## Color Tokens (exact from prototype)

```css
/* src/index.css */
:root {
  /* Brand */
  --orange:    #E8590C;
  --orange-lt: #FFF4EE;   /* light orange bg */
  --orange-md: #FFE0CC;   /* medium orange */

  /* Neutrals */
  --dark:      #0F172A;   /* primary text */
  --dark-2:    #1E293B;   /* secondary dark */
  --slate:     #64748B;   /* muted text */
  --lgray:     #E2E8F0;   /* borders */
  --offwhite:  #F8FAFC;   /* card backgrounds */
  --white:     #FFFFFF;

  /* Status - Green */
  --green:     #10B981;
  --green-bg:  #D1FAE5;
  --green-txt: #065F46;

  /* Status - Red */
  --red:       #EF4444;
  --red-bg:    #FEE2E2;
  --red-txt:   #7F1D1D;

  /* Status - Yellow */
  --yellow:    #F59E0B;
  --yellow-bg: #FEF3C7;
  --yellow-txt:#92400E;

  /* Status - Blue */
  --blue:      #3B82F6;
  --blue-bg:   #EFF6FF;
  --blue-txt:  #1E40AF;

  /* WhatsApp */
  --wa-green:  #25D366;

  /* Splash background */
  --splash-bg: #0a0a0a;
}
```

---

## Typography

| Usage | Font | Size | Weight | Letter Spacing |
|---|---|---|---|---|
| App name (splash) | Bebas Neue | 34px | 400 | 3px |
| Dashboard title | Bebas Neue | 26px | 400 | 2px |
| Section headers (form) | Bebas Neue | 14px | 400 | 2px |
| Stat numbers | Bebas Neue | 24px | 400 | 1px |
| Screen headers | Rajdhani | 18px | 700 | 0.5px |
| Body text | Rajdhani | 14px | 400-500 | — |
| Buttons (primary) | Rajdhani | 16px | 700 | 0.5px |
| Labels (form) | Rajdhani | 12px | 700 | 0.8px uppercase |
| Bottom nav labels | Rajdhani | 10px | 600 | 0.4px |
| Badges | Rajdhani | 10px | 700 | 0.8px uppercase |
| Number plates | Share Tech Mono | 14-22px | 600-700 | 0.5-2px |
| WA message body | Share Tech Mono | 12px | 400 | — |

Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
```

---

## Component Specs

### BottomNav
- Height: 80px
- Background: white, border-top: 1px solid var(--lgray)
- 4 tabs: Intake (chat icon) | Jobs (grid icon) | Report (chart icon) | Follow-up (chat with lines)
- Active tab: --orange color on icon + label
- z-index: 100
- Always visible on all screens except Splash

### Header
- Padding: 10px 18px 12px
- Border-bottom: 1px solid var(--lgray)
- Back button: 36×36px circle, background var(--offwhite)
- Title: Rajdhani 18px bold
- Optional right slot: any small button

### LangPill (Language Switcher)
- Position: fixed inside phone at `top: 9px, left: 72px`
- Size: auto width × 26px height, border-radius: 20px
- Background: rgba(232,89,12,0.92)
- Content: "🌐 EN" / "🌐 हि" / "🌐 ગુ"
- On click: show popup with 3 language options
- Popup: white card, opens downward at top:40px left:10px
- z-index: 998 (above all screens)
- Visible on ALL screens EXCEPT Splash

### VehicleCard
- Border-radius: 14px
- Border: 1.5px solid var(--lgray)
- Left accent border (3px):
  - In Repair + overdue: var(--red)
  - In Repair normal: var(--lgray)
  - Done/unpaid: var(--yellow)
  - Partial payment: var(--yellow)
  - Paid: var(--green)
- Card header: plate (Share Tech Mono 14px bold) + customer name + status badge
- Card body: problem text (truncate 2 lines) + meta (time, amount, overdue badge)
- Card actions: buttons below a top border

### StatusBadge
```
In Repair: bg #FFF4EE, text --orange, uppercase "IN REPAIR"
Done:      bg --green-bg, text --green-txt, "READY ✅"
Partial:   bg --yellow-bg, text --yellow-txt, "⚡ PARTIAL"
Paid:      bg #F0FDF4, text #166534, "PAID ✅"
Overdue:   bg --red-bg, text --red-txt, "⚠️ OVERDUE"
```

### ProgressBar
- Track: var(--lgray), height 8px, border-radius 4px
- Fill: var(--green) (payment progress), linear-gradient(90deg, #10B981, #34D399)
- Tracker version: height 10px
- Transition: width 0.5s ease

### BottomSheet (Dialog Overlay)
- Backdrop: rgba(15,23,42,0.55) with backdrop-filter: blur(4px)
- Sheet: white, border-radius 24px 24px 0 0
- Handle: 40×4px gray pill at top
- Animation: slides up (translateY 60px → 0)
- z-index: 200

### FormSection
- Section title: Bebas Neue 14px, --orange, letter-spacing 2px
- After title: gradient line (orange → transparent)
- Padding: 14px 16px 0

### InputField
- Border: 1.5px solid var(--lgray), border-radius 8px
- Padding: 12px 14px
- Font: Rajdhani 14px
- Focus: border-color var(--orange), background #fffaf8

### PrimaryButton
- Full width, padding 14px, border-radius 12px
- Background: var(--orange), color white
- Font: Rajdhani 16px 700, letter-spacing 0.5px
- Active: opacity 0.85

### WhatsApp Button
- Same as primary but background: #25D366
- Includes WA icon (SVG)

### WaMessageCard
- Background: #E8F5E9, border-left: 3px solid #4CAF50
- Header: 10px bold dark green
- Body: Share Tech Mono 12px, line-height 1.7
- Mechanic record variant: background var(--orange-lt), border var(--orange)

---

## Splash Screen Background (SVG Pattern)
The splash has a decorative SVG overlay with:
- 2 gears (top-right: r=52, bottom-left: r=42) in --orange, opacity 0.13
- 2 wrenches (diagonal, left and right sides) in white, opacity 0.13
- 1 screwdriver at bottom in white, opacity 0.13
- Diagonal stripe lines in white/orange, opacity 0.2-0.4
- Corner bolt circles (r=6) in white at 4 corners
- Center dashed ring (r=140) in --orange
- Orange radial glow at top: rgba(232,89,12,0.35)
See `PROTOTYPE_REFERENCE.html` for exact SVG code.

---

## Screen Dimensions
- Mobile (primary): 100vw × 100vh, no border-radius
- Desktop fallback: 390×844px centered, border-radius 44px, dark frame box-shadow

```css
.phone {
  width: 100vw;
  height: 100vh;
  max-width: 430px;
  max-height: 932px;
  border-radius: 0;
  overflow: hidden;
  position: relative;
}
@media (min-width: 500px) {
  .phone {
    width: 390px;
    height: 844px;
    border-radius: 44px;
    box-shadow: 0 0 0 8px #1c1c1c, 0 0 0 11px #2a2a2a, 0 32px 80px rgba(0,0,0,0.9);
  }
}
```

---

## Animations & Transitions
- Screen transition: opacity 0 → 1 (0.2s ease)
- Bottom sheet: translateY(60px) → translateY(0) (0.25s cubic-bezier(0.32, 1.1, 0.44, 1))
- Language popup: no animation (instant show/hide)
- Progress bar fill: width transition 0.5s ease
- Loading bar (splash): width 0 → 100% over 1.5s ease-forwards
- Toggle switch: transform 0.3s
- Button active: opacity 0.85 (instant)
- Card hover: scale(0.985) on tap (touch feedback)

---

## Info Row (Card Detail)
```
Label: 110px wide, 11px, uppercase, letter-spacing 0.3px, --slate
Value: flex:1, 14px, --dark
Highlighted rows (owner info): background var(--orange-lt), label color var(--orange)
Border-bottom: 1px solid var(--lgray) on each row except last
```

---

## Payment Progress Display
```
Received label + amount (green)
Progress bar (green fill, % = amount_paid / estimate × 100)
Percentage text + total amount
Remaining amount in red badge
Payment method icons: 📱 UPI | 💵 Cash | 🏦 Bank
```
