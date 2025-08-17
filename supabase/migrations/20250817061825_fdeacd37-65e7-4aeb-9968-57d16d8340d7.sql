-- Enable extension for UUID generation
create extension if not exists pgcrypto;

-- Create booking status enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','in_progress','completed','cancelled');
  END IF;
END $$;

-- Timestamp update helper
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  address text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

create policy if not exists "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy if not exists "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy if not exists "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

create trigger if not exists update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- Vehicles table
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  make text not null,
  model text not null,
  year int,
  registration_number text,
  color text,
  mileage integer,
  is_default boolean default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.vehicles enable row level security;

create policy if not exists "Users can read own vehicles"
  on public.vehicles
  for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert own vehicles"
  on public.vehicles
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update own vehicles"
  on public.vehicles
  for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete own vehicles"
  on public.vehicles
  for delete
  using (auth.uid() = user_id);

create trigger if not exists update_vehicles_updated_at
before update on public.vehicles
for each row execute function public.update_updated_at_column();

-- Ensure only one default vehicle per user (optional but helpful)
create unique index if not exists unique_default_vehicle_per_user
on public.vehicles (user_id)
where is_default;

-- Bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  service_type text not null,
  status public.booking_status not null default 'pending',
  amount numeric,
  preferred_date date,
  preferred_time text,
  pickup_address text,
  special_instructions text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.bookings enable row level security;

create policy if not exists "Users can read own bookings"
  on public.bookings
  for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert own bookings"
  on public.bookings
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update own bookings"
  on public.bookings
  for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete own bookings"
  on public.bookings
  for delete
  using (auth.uid() = user_id);

create trigger if not exists update_bookings_updated_at
before update on public.bookings
for each row execute function public.update_updated_at_column();

-- Service photos table
create table if not exists public.service_photos (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  photo_url text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.service_photos enable row level security;

create policy if not exists "Users can read photos of own bookings"
  on public.service_photos
  for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = service_photos.booking_id
        and b.user_id = auth.uid()
    )
  );

create policy if not exists "Users can insert photos for own bookings"
  on public.service_photos
  for insert
  with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.user_id = auth.uid()
    )
  );

create policy if not exists "Users can delete photos of own bookings"
  on public.service_photos
  for delete
  using (
    exists (
      select 1 from public.bookings b
      where b.id = service_photos.booking_id
        and b.user_id = auth.uid()
    )
  );

-- Storage bucket for service photos
insert into storage.buckets (id, name, public)
values ('service-photos', 'service-photos', true)
on conflict (id) do nothing;

-- Storage policies for the 'service-photos' bucket
create policy if not exists "Public can view service photos"
  on storage.objects
  for select
  using (bucket_id = 'service-photos');

create policy if not exists "Users can upload service photos to own booking folder"
  on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'service-photos'
    and exists (
      select 1 from public.bookings b
      where b.id::text = (storage.foldername(name))[1]
        and b.user_id = auth.uid()
    )
  );

create policy if not exists "Users can update their service photos"
  on storage.objects
  for update to authenticated
  using (
    bucket_id = 'service-photos'
    and exists (
      select 1 from public.bookings b
      where b.id::text = (storage.foldername(name))[1]
        and b.user_id = auth.uid()
    )
  );

create policy if not exists "Users can delete their service photos"
  on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'service-photos'
    and exists (
      select 1 from public.bookings b
      where b.id::text = (storage.foldername(name))[1]
        and b.user_id = auth.uid()
    )
  );