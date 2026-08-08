-- =========================================================
-- INCEPTION STORE SUPABASE DATABASE SETUP SCHEMA
-- Copy and paste this script into your Supabase SQL Editor
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- =========================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  mrp NUMERIC NOT NULL,
  discount_percent NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 10,
  image TEXT,
  in_stock BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  description TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  datasheet_url TEXT,
  pinout_image_url TEXT,
  recommended_for_projects JSONB DEFAULT '[]'::jsonb,
  lab_rack_location TEXT,
  alternative_product_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  domain TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  estimated_hours NUMERIC DEFAULT 3,
  estimated_budget NUMERIC DEFAULT 800,
  hero_image TEXT,
  description TEXT,
  learning_objectives JSONB DEFAULT '[]'::jsonb,
  bom JSONB DEFAULT '[]'::jsonb,
  quiz JSONB DEFAULT '[]'::jsonb,
  pinout_table JSONB DEFAULT '[]'::jsonb,
  code_snippet JSONB DEFAULT '{}'::jsonb,
  simulation_config JSONB DEFAULT '{}'::jsonb,
  e_waste_score JSONB DEFAULT '{}'::jsonb,
  faculty_approved BOOLEAN DEFAULT true,
  instructor_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total_amount NUMERIC NOT NULL,
  delivery_method TEXT DEFAULT 'hostel',
  hostel_room TEXT,
  status TEXT DEFAULT 'placed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow Read and Write access
CREATE POLICY "Allow public read access on products"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow anon and auth insert/update on products"
  ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read access on projects"
  ON public.projects FOR SELECT USING (true);

CREATE POLICY "Allow anon and auth insert/update on projects"
  ON public.projects FOR ALL USING (true);

CREATE POLICY "Allow public read access on orders"
  ON public.orders FOR SELECT USING (true);

CREATE POLICY "Allow anon and auth insert/update on orders"
  ON public.orders FOR ALL USING (true);
