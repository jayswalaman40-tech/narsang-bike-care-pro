# WHATSAPP MESSAGE TEMPLATES

## Integration Method: wa.me links (Phase 1)
Format: `https://wa.me/91{10-digit-number}?text={URL-encoded message}`

The app generates 3 wa.me links per action:
1. **Customer link** — person who brought the vehicle
2. **Owner link** — vehicle owner (use customer if owner_whatsapp is null)
3. **Mechanic link** — mechanic's own number (from garage_settings.mechanic_whatsapp) — record copy

---

## Template Variables
```
{customer_name}     = vehicle.customer_name
{owner_name}        = vehicle.owner_name OR vehicle.customer_name (if null)
{vehicle_type}      = vehicle.vehicle_type  ("Scooter" or "Bike")
{number_plate}      = vehicle.number_plate
{estimate}          = vehicle.estimate (format as ₹X,XXX)
{amount_paid}       = payment amount (format as ₹X,XXX)
{remaining}         = estimate - total_paid (format as ₹X,XXX)
{upi_id}            = garage_settings.upi_id (may be null — omit line if null)
{garage_name}       = garage_settings.garage_name
{mechanic_name}     = garage_settings.mechanic_name
{date_time}         = current date + time in IST (DD MMM, HH:MM)
```

---

## MESSAGE TYPE 1: Vehicle Ready (sent when marked Done)

### English
```
To Customer:
✅ *Vehicle Ready!*
Namaste {customer_name} ji! 🙏
Your {vehicle_type} ({number_plate}) is ready for pickup.
💰 Total: ₹{estimate}
{if upi_id: 💳 Pay via UPI: {upi_id}}
Please visit us at your convenience.
— {garage_name} 🛵

To Mechanic (self-copy):
📋 *Done Marked*
{number_plate} — {customer_name}
Estimate: ₹{estimate}
Marked done: {date_time}
```

### Hindi
```
To Customer:
✅ *गाड़ी तैयार है!*
नमस्ते {customer_name} जी! 🙏
आपकी {vehicle_type} ({number_plate}) तैयार है।
💰 कुल: ₹{estimate}
{if upi_id: 💳 UPI से पेमेंट: {upi_id}}
कृपया जल्द आकर ले जाएं।
— {garage_name} 🛵

To Mechanic:
📋 *Done Mark हुआ*
{number_plate} — {customer_name}
अनुमान: ₹{estimate}
{date_time}
```

### Gujarati
```
To Customer:
✅ *વાહન તૈયાર છે!*
નમસ્તે {customer_name} જી! 🙏
તમારી {vehicle_type} ({number_plate}) તૈયાર છે।
💰 કુલ: ₹{estimate}
{if upi_id: 💳 UPI: {upi_id}}
કૃપા કરી જલ્દી લઈ જાઓ।
— {garage_name} 🛵

To Mechanic:
📋 *Done Mark*
{number_plate} — {customer_name}
₹{estimate} | {date_time}
```

---

## MESSAGE TYPE 2: Partial Payment Received

### English
```
To Owner:
💰 *Partial Payment Received*
{owner_name} ji — ₹{amount_paid} received.
Remaining balance: ₹{remaining}
Please pay the balance soon. 🙏
— {garage_name} 🛵

To Customer:
🛵 *Payment Update*
{customer_name} ji — {number_plate}:
✅ Received: ₹{amount_paid}
⚠️ Balance: ₹{remaining}
{if upi_id: 💳 UPI: {upi_id}}
— {garage_name} 🛵

To Mechanic:
📊 *Partial Payment Record*
{number_plate} — {customer_name}
Received: ₹{amount_paid} ✅
Remaining: ₹{remaining} ⚠️
{date_time}
```

### Hindi
```
To Owner:
💰 *आंशिक भुगतान मिला*
{owner_name} जी — ₹{amount_paid} मिला।
बाकी: ₹{remaining}
कृपया जल्दी दें 🙏
— {garage_name} 🛵

To Customer:
🛵 *Payment Update*
{customer_name} जी — {number_plate}:
✅ मिला: ₹{amount_paid}
⚠️ बाकी: ₹{remaining}
{if upi_id: 💳 UPI: {upi_id}}
— {garage_name} 🛵

To Mechanic:
📊 *Partial Record*
{number_plate} — ₹{amount_paid} ✅ | ₹{remaining} ⚠️
{date_time}
```

### Gujarati
```
To Owner:
💰 *આંશિક ચૂકવણી મળી*
{owner_name} જી — ₹{amount_paid} મળ્યા।
બાકી: ₹{remaining}
— {garage_name} 🛵

To Customer:
🛵 *Payment Update*
{customer_name} જી — {number_plate}:
✅ મળ્યું: ₹{amount_paid} | ⚠️ બાકી: ₹{remaining}
{if upi_id: 💳 UPI: {upi_id}}
— {garage_name} 🛵

To Mechanic:
📊 {number_plate} — ₹{amount_paid} ✅ | ₹{remaining} ⚠️ | {date_time}
```

---

## MESSAGE TYPE 3: Full Payment Complete

### English
```
To Owner:
💚 *Full Payment Cleared!*
{owner_name} ji — ₹{estimate} fully received.
Thank you so much! 🙏
{number_plate} — {vehicle_type}
— {garage_name} 🛵

To Customer:
✅ *Payment Complete!*
{customer_name} ji — {number_plate}:
₹{estimate} — Full payment cleared!
Thank you for your trust. 😊
— {garage_name} 🛵

To Mechanic:
✅ *Full Payment Record*
{number_plate} — {customer_name}
₹{estimate} PAID IN FULL ✅
{date_time}
```

### Hindi
```
To Owner:
💚 *पूरा भुगतान मिल गया!*
{owner_name} जी — ₹{estimate} पूरा मिल गया।
बहुत धन्यवाद! 🙏
— {garage_name} 🛵

To Customer:
✅ *Payment Complete!*
{customer_name} जी — {number_plate}:
₹{estimate} — पूरा payment clear!
धन्यवाद! 😊
— {garage_name} 🛵

To Mechanic:
✅ {number_plate} — ₹{estimate} FULL PAID ✅ | {date_time}
```

### Gujarati
```
To Owner:
💚 *સંપૂર્ણ ચૂકવણી!*
{owner_name} જી — ₹{estimate} સંપૂર્ણ મળ્યા।
ખૂબ ખૂબ આભાર! 🙏
— {garage_name} 🛵

To Customer:
✅ *Payment Complete!*
{customer_name} જી — {number_plate}:
₹{estimate} — Full payment clear! 😊
— {garage_name} 🛵

To Mechanic:
✅ {number_plate} — ₹{estimate} FULL PAID ✅ | {date_time}
```

---

## MESSAGE TYPE 4: Follow-up Reminder

### English
```
Namaste {customer_name} ji! 🙏
Your {vehicle_type} ({number_plate}) is ready at our garage.
Please come for pickup when convenient.
{if upi_id: 💳 Pay via UPI: {upi_id} | Amount: ₹{estimate}}
— {garage_name} 🛵
```

### Hindi
```
नमस्ते {customer_name} जी! 🙏
आपकी {vehicle_type} ({number_plate}) हमारे garage में तैयार है।
कृपया जल्द लेने आएं।
{if upi_id: 💳 UPI: {upi_id} | राशि: ₹{estimate}}
— {garage_name} 🛵
```

### Gujarati
```
નમસ્તે {customer_name} જી! 🙏
તમારી {vehicle_type} ({number_plate}) અમારી ગૅરેજ માં તૈયાર છે.
— {garage_name} 🛵
```

---

## buildWaMessages() Function (src/services/whatsappService.ts)

```typescript
import type { Vehicle, Payment, GarageSettings } from '../types'
import { format } from 'date-fns'
import { enIN } from 'date-fns/locale'

export function buildVehicleReadyMessages(
  vehicle: Vehicle,
  settings: GarageSettings,
  lang: 'en' | 'hi' | 'gu'
): Array<{ phone: string; message: string; recipient: string }> {
  const owner_phone = vehicle.owner_whatsapp || vehicle.customer_whatsapp
  const owner_name  = vehicle.owner_name     || vehicle.customer_name
  const dateTime    = format(new Date(), "dd MMM, HH:mm", { locale: enIN })
  const upiLine     = settings.upi_id ? `💳 UPI: ${settings.upi_id}` : ''

  const templates = {
    en: {
      customer: `✅ *Vehicle Ready!*\nNamaste ${vehicle.customer_name} ji! 🙏\nYour ${vehicle.vehicle_type} (${vehicle.number_plate}) is ready.\n💰 Total: ₹${vehicle.estimate}${upiLine ? '\n'+upiLine : ''}\n— ${settings.garage_name} 🛵`,
      owner:    `💰 *Vehicle Ready - Payment Due*\n${owner_name} ji — ${vehicle.number_plate} is ready.\n💰 Amount: ₹${vehicle.estimate}${upiLine ? '\n'+upiLine : ''}\n— ${settings.garage_name} 🛵`,
      mechanic: `📋 *Done Marked*\n${vehicle.number_plate} — ${vehicle.customer_name}\n₹${vehicle.estimate} | ${dateTime}`,
    },
    hi: {
      customer: `✅ *गाड़ी तैयार है!*\nनमस्ते ${vehicle.customer_name} जी! 🙏\nआपकी ${vehicle.vehicle_type} (${vehicle.number_plate}) तैयार है।\n💰 कुल: ₹${vehicle.estimate}${upiLine ? '\n'+upiLine : ''}\n— ${settings.garage_name} 🛵`,
      owner:    `💰 *गाड़ी तैयार - Payment बाकी*\n${owner_name} जी — ${vehicle.number_plate} तैयार है।\n💰 राशि: ₹${vehicle.estimate}\n— ${settings.garage_name} 🛵`,
      mechanic: `📋 *Done Mark हुआ* ${vehicle.number_plate} — ₹${vehicle.estimate} | ${dateTime}`,
    },
    gu: {
      customer: `✅ *વાહન તૈયાર છે!*\nનમસ્તે ${vehicle.customer_name} જી! 🙏\nતમારી ${vehicle.vehicle_type} (${vehicle.number_plate}) તૈયાર છે.\n💰 ₹${vehicle.estimate}${upiLine ? '\n'+upiLine : ''}\n— ${settings.garage_name} 🛵`,
      owner:    `💰 *Payment બાકી*\n${owner_name} જી — ${vehicle.number_plate} — ₹${vehicle.estimate}\n— ${settings.garage_name} 🛵`,
      mechanic: `📋 Done: ${vehicle.number_plate} — ₹${vehicle.estimate} | ${dateTime}`,
    }
  }

  const t = templates[lang]
  return [
    { phone: vehicle.customer_whatsapp, message: t.customer, recipient: 'customer' },
    { phone: owner_phone,               message: t.owner,    recipient: 'owner' },
    { phone: settings.mechanic_whatsapp, message: t.mechanic, recipient: 'mechanic' }
  ]
}

// Similarly build buildPartialPaymentMessages() and buildFullPaymentMessages()
// following the templates above. Same pattern, different text.
```
