# API SPEC — All Supabase Service Functions

## File: `src/services/vehicleService.ts`

```typescript
import { supabase } from '../lib/supabase'
import type { Vehicle, VehicleStatus } from '../types'

// ── FETCH ALL VEHICLES (for dashboard) ──────────────────────
// Returns vehicles with payment summary from the view
export async function fetchVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicle_payment_summary')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// ── FETCH VEHICLES BY STATUS (for dashboard tabs) ────────────
export async function fetchVehiclesByStatus(status: VehicleStatus | VehicleStatus[]) {
  const statuses = Array.isArray(status) ? status : [status]
  const { data, error } = await supabase
    .from('vehicle_payment_summary')
    .select('*')
    .in('status', statuses)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// ── FETCH SINGLE VEHICLE ─────────────────────────────────────
export async function fetchVehicle(id: string) {
  const { data, error } = await supabase
    .from('vehicle_payment_summary')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// ── CREATE VEHICLE ───────────────────────────────────────────
export async function createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      ...vehicle,
      number_plate: vehicle.number_plate.toUpperCase(),
      status: 'in_repair'
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// ── UPDATE VEHICLE ───────────────────────────────────────────
export async function updateVehicle(id: string, updates: Partial<Vehicle>) {
  const payload = { ...updates }
  if (payload.number_plate) payload.number_plate = payload.number_plate.toUpperCase()
  const { data, error } = await supabase
    .from('vehicles')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── MARK AS DONE ─────────────────────────────────────────────
export async function markAsDone(id: string) {
  return updateVehicle(id, { status: 'done' })
}

// ── UNDO DONE (revert to in_repair) ─────────────────────────
export async function undoDone(id: string) {
  return updateVehicle(id, { status: 'in_repair' })
}

// ── MARK AS PAID ─────────────────────────────────────────────
export async function markAsPaid(id: string) {
  return updateVehicle(id, { status: 'paid' })
}

// ── DELETE VEHICLE ───────────────────────────────────────────
// Also deletes related payments (CASCADE in DB)
export async function deleteVehicle(id: string) {
  const { error } = await supabase.from('vehicles').delete().eq('id', id)
  if (error) throw error
}

// ── SEARCH VEHICLES (for report) ────────────────────────────
export async function searchVehicles(query: string, fromDate?: string, toDate?: string) {
  let q = supabase
    .from('vehicle_payment_summary')
    .select('*')
    .order('created_at', { ascending: false })

  if (query) {
    q = q.or(`number_plate.ilike.%${query}%,customer_name.ilike.%${query}%`)
  }
  if (fromDate) {
    q = q.gte('created_at', fromDate)
  }
  if (toDate) {
    // Include full toDate day
    q = q.lte('created_at', toDate + 'T23:59:59Z')
  }

  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

// ── GET DONE BUT UNPAID (for followup screen) ────────────────
export async function fetchPendingFollowup() {
  const { data, error } = await supabase
    .from('vehicle_payment_summary')
    .select('*')
    .eq('status', 'done')
    .eq('payment_status', 'unpaid')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
```

---

## File: `src/services/paymentService.ts`

```typescript
import { supabase } from '../lib/supabase'
import type { Payment, PaymentMethod, PaymentType } from '../types'

// ── FETCH PAYMENTS FOR A VEHICLE ─────────────────────────────
export async function fetchPayments(vehicleId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('paid_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// ── RECORD PAYMENT ────────────────────────────────────────────
export async function recordPayment(
  vehicleId: string,
  amountPaid: number,
  totalAmount: number,
  type: PaymentType,
  method: PaymentMethod,
  note?: string
): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      vehicle_id: vehicleId,
      amount_paid: amountPaid,
      total_amount: totalAmount,
      payment_type: type,
      payment_method: method,
      note: note ?? null
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// ── GET TOTAL PAID FOR A VEHICLE ─────────────────────────────
export async function getTotalPaid(vehicleId: string): Promise<number> {
  const { data, error } = await supabase
    .from('payments')
    .select('amount_paid')
    .eq('vehicle_id', vehicleId)
  if (error) throw error
  return (data ?? []).reduce((sum, p) => sum + p.amount_paid, 0)
}

// ── LOG WA MESSAGE ────────────────────────────────────────────
export async function logWaMessage(
  vehicleId: string,
  recipient: 'customer' | 'owner' | 'mechanic',
  phone: string,
  messageType: string
) {
  const { error } = await supabase.from('wa_log').insert({
    vehicle_id: vehicleId,
    recipient,
    phone,
    message_type: messageType
  })
  if (error) console.warn('WA log failed (non-critical):', error)
  // Non-critical — don't throw
}
```

---

## File: `src/services/whatsappService.ts`

```typescript
// See 07_WHATSAPP_TEMPLATES.md for message content
// This file just builds wa.me URLs

export function buildWaUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/91${phone}?text=${encoded}`
}

export function openWa(phone: string, message: string): void {
  const url = buildWaUrl(phone, message)
  window.open(url, '_blank')
}

// Open multiple WA links sequentially with small delay
export async function openMultipleWa(
  messages: Array<{ phone: string; message: string }>,
  delayMs = 1500
): Promise<void> {
  for (const { phone, message } of messages) {
    openWa(phone, message)
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }
}
```

---

## Zustand Stores

### `src/store/vehicleStore.ts`
```typescript
import { create } from 'zustand'
import type { Vehicle } from '../types'

interface VehicleStore {
  vehicles: Vehicle[]
  currentVehicle: Vehicle | null
  loading: boolean
  error: string | null
  setVehicles: (v: Vehicle[]) => void
  setCurrentVehicle: (v: Vehicle | null) => void
  setLoading: (l: boolean) => void
  setError: (e: string | null) => void
  updateVehicleInList: (id: string, updates: Partial<Vehicle>) => void
}

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: [],
  currentVehicle: null,
  loading: false,
  error: null,
  setVehicles: (vehicles) => set({ vehicles }),
  setCurrentVehicle: (currentVehicle) => set({ currentVehicle }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  updateVehicleInList: (id, updates) =>
    set(state => ({
      vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...updates } : v)
    }))
}))
```

### `src/store/uiStore.ts`
```typescript
import { create } from 'zustand'
import type { Language } from '../types'

interface Toast { message: string; type: 'success' | 'error' | 'info' }

interface UiStore {
  lang: Language
  activeTab: 'r' | 'd'        // dashboard tab: repair or done
  toast: Toast | null
  setLang: (l: Language) => void
  setActiveTab: (t: 'r' | 'd') => void
  showToast: (toast: Toast) => void
  clearToast: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  lang: (localStorage.getItem('snbc_lang') as Language) ?? 'en',
  activeTab: 'r',
  toast: null,
  setLang: (lang) => {
    localStorage.setItem('snbc_lang', lang)
    set({ lang })
  },
  setActiveTab: (activeTab) => set({ activeTab }),
  showToast: (toast) => {
    set({ toast })
    setTimeout(() => set({ toast: null }), 3000)
  },
  clearToast: () => set({ toast: null })
}))
```
