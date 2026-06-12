-- Виконати в Supabase SQL Editor
-- https://app.supabase.com → ваш проект → SQL Editor

create table bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  dob date,
  consult_type text not null,
  price integer not null,
  notes text,
  appointment_at timestamptz not null,
  status text default 'pending' check (status in ('pending','paid','cancelled')),
  liqpay_order_id text,
  created_at timestamptz default now()
);

-- Дозволити читання/запис з API (Row Level Security вимкнено для простоти)
-- Для продакшену — налаштувати RLS правила
alter table bookings disable row level security;
