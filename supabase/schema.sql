-- FitMirror AI MVP schema
-- Supabase SQL Editorに貼り付けて実行する想定

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  height_cm integer,
  weight_kg integer,
  body_type text,
  usual_top_size text,
  usual_bottom_size text,
  fit_preference text default 'normal',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  storage_path text not null,
  photo_type text check (photo_type in ('body', 'face_hidden_body')) default 'body',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.closet_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text,
  category text,
  color text,
  season text,
  storage_path text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  product_name text not null,
  brand_name text,
  price_text text,
  image_url text,
  normal_url text,
  affiliate_url text,
  size_info jsonb,
  created_at timestamptz default now()
);

create table if not exists public.tryon_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  user_photo_id uuid references public.user_photos(id) on delete set null,
  clothing_item_id uuid references public.closet_items(id) on delete set null,
  generated_image_path text,
  recommended_size text,
  relaxed_size text,
  fit_score integer,
  compatibility text,
  fit_comment text,
  purchase_score integer,
  created_at timestamptz default now()
);

create table if not exists public.affiliate_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  platform text not null,
  affiliate_id text,
  affiliate_tag text,
  api_key text,
  api_secret text,
  base_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  platform text,
  destination_url text,
  referrer text,
  user_agent text,
  clicked_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.user_photos enable row level security;
alter table public.closet_items enable row level security;
alter table public.tryon_results enable row level security;
alter table public.affiliate_clicks enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can manage own body photos" on public.user_photos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own closet items" on public.closet_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can read own tryon results" on public.tryon_results for select using (auth.uid() = user_id);
create policy "Users can insert own tryon results" on public.tryon_results for insert with check (auth.uid() = user_id);
