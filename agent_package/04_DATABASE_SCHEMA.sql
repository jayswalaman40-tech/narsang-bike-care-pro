-- ============================================================
-- SHRI NARSANG BIKE CARE — DATABASE SCHEMA
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: garage_settings
-- Single row per garage. Insert one row on first setup.
-- ============================================================
create table if not exists garage_settings (
  id                uuid primary key default uuid_generate_v4(),
  garage_name       text not null default 'Shri Narsang Bike Care',
  mechanic_name     text not null default 'Mechanic',
  mechanic_whatsapp text not null,                    -- 10 digits, no +91
  upi_id            text,                             -- e.g. mechanic@okaxis
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ============================================================
-- TABLE: vehicles
-- One row per vehicle job. Core table of the app.
-- ============================================================
create table if not exists vehicles (
  id                  uuid primary key default uuid_generate_v4(),
  customer_name       text not null,
  customer_whatsapp   text not null,                  -- 10 digits, no +91
  vehicle_type        text not null check (vehicle_type in ('Scooter', 'Bike')),
  number_plate        text not null,                  -- always stored UPPERCASE
  owner_name          text,                           -- null if same as customer
  owner_whatsapp      text,                           -- null if same as customer
  problem             text not null,
  estimate            integer not null,               -- in rupees (whole number)
  delivery_by         text,                           -- free text, e.g. "Kal tak"
  status              text not null default 'in_repair'
                        check (status in ('in_repair', 'done', 'paid')),
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- Index for common queries
create index if not exists vehicles_status_idx on vehicles(status);
create index if not exists vehicles_created_at_idx on vehicles(created_at desc);
create index if not exists vehicles_number_plate_idx on vehicles(number_plate);

-- ============================================================
-- TABLE: payments
-- One row per payment transaction (could be multiple per vehicle for partial)
-- ============================================================
create table if not exists payments (
  id              uuid primary key default uuid_generate_v4(),
  vehicle_id      uuid not null references vehicles(id) on delete cascade,
  amount_paid     integer not null,                   -- rupees paid this transaction
  total_amount    integer not null,                   -- copy of vehicle.estimate
  payment_type    text not null check (payment_type in ('full', 'partial')),
  payment_method  text not null default 'cash'
                    check (payment_method in ('upi', 'cash', 'bank')),
  note            text,                               -- optional note from mechanic
  paid_at         timestamptz default now()
);

create index if not exists payments_vehicle_id_idx on payments(vehicle_id);
create index if not exists payments_paid_at_idx on payments(paid_at desc);

-- ============================================================
-- TABLE: wa_log
-- Track every WhatsApp message that was triggered (not guaranteed delivered)
-- ============================================================
create table if not exists wa_log (
  id            uuid primary key default uuid_generate_v4(),
  vehicle_id    uuid not null references vehicles(id) on delete cascade,
  recipient     text not null check (recipient in ('customer', 'owner', 'mechanic')),
  phone         text not null,                        -- 10-digit number
  message_type  text not null,                        -- 'vehicle_ready' | 'partial_payment' | 'full_payment' | 'followup'
  sent_at       timestamptz default now()
);

create index if not exists wa_log_vehicle_id_idx on wa_log(vehicle_id);

-- ============================================================
-- VIEWS
-- ============================================================

-- View: vehicles with total amount paid and remaining balance
create or replace view vehicle_payment_summary as
select
  v.id,
  v.customer_name,
  v.customer_whatsapp,
  v.vehicle_type,
  v.number_plate,
  v.owner_name,
  v.owner_whatsapp,
  v.problem,
  v.estimate,
  v.delivery_by,
  v.status,
  v.created_at,
  v.updated_at,
  coalesce(sum(p.amount_paid), 0) as total_paid,
  v.estimate - coalesce(sum(p.amount_paid), 0) as remaining,
  case
    when coalesce(sum(p.amount_paid), 0) = 0 then 'unpaid'
    when coalesce(sum(p.amount_paid), 0) >= v.estimate then 'paid_full'
    else 'paid_partial'
  end as payment_status
from vehicles v
left join payments p on p.vehicle_id = v.id
group by v.id;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable after setting up Auth. For now, keep disabled for development.
-- ============================================================

-- Uncomment after Auth is set up:
-- alter table vehicles enable row level security;
-- alter table payments enable row level security;
-- alter table wa_log enable row level security;
-- alter table garage_settings enable row level security;

-- Policy: authenticated users can do everything (single-user app)
-- create policy "Authenticated full access - vehicles"
--   on vehicles for all using (auth.role() = 'authenticated');
-- create policy "Authenticated full access - payments"
--   on payments for all using (auth.role() = 'authenticated');
-- create policy "Authenticated full access - wa_log"
--   on wa_log for all using (auth.role() = 'authenticated');
-- create policy "Authenticated full access - garage_settings"
--   on garage_settings for all using (auth.role() = 'authenticated');

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger vehicles_updated_at
  before update on vehicles
  for each row execute function update_updated_at();

create trigger garage_settings_updated_at
  before update on garage_settings
  for each row execute function update_updated_at();

-- ============================================================
-- SEED DATA (for development/testing — DELETE before production)
-- ============================================================

-- insert into garage_settings (mechanic_whatsapp, upi_id)
-- values ('9876543210', 'mechanic@okaxis');

-- insert into vehicles (customer_name, customer_whatsapp, vehicle_type, number_plate, problem, estimate, status)
-- values
--   ('Ramesh Kumar', '9876543210', 'Bike', 'MH-12-AB-1234', 'Front brake se awaaz aati hai', 2500, 'in_repair'),
--   ('Suresh Mehta', '9123456789', 'Scooter', 'DL-01-XY-9999', 'Engine se awaaz startup pe', 4000, 'in_repair'),
--   ('Priya Shah', '9988776655', 'Bike', 'GJ-05-CD-3210', 'AC nahi chalta', 5500, 'in_repair'),
--   ('Anil Joshi', '9876540001', 'Scooter', 'MH-14-PQ-7777', 'Tyre change saare 4', 3200, 'done'),
--   ('Mohan Lal', '9876540002', 'Bike', 'RJ-14-GH-5555', 'Oil change + filter', 1800, 'done');
