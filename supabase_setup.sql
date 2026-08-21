-- =========================================================
-- INCEPTION STORE FULL SUPABASE DATABASE SETUP SCHEMA
-- Copy and paste this script into your Supabase SQL Editor
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- =========================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  description TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 15,
  specs JSONB DEFAULT '{}'::jsonb,
  pinout JSONB DEFAULT '[]'::jsonb,
  detail_guide JSONB DEFAULT '{}'::jsonb,
  is_popular BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 4.5,
  review_count INTEGER DEFAULT 10,
  reviews JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Projects Table (Contains Project Kits & Microcontroller Firmware Code Snippets)
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
  code_snippet JSONB DEFAULT '{}'::jsonb, -- Firmware / Arduino / Python / ESP32 code
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

-- 4. Create Community Posts Table (Student Built Projects & Showcases)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  student_name TEXT NOT NULL,
  student_college TEXT,
  student_avatar TEXT,
  title TEXT NOT NULL,
  description TEXT,
  budget_spent NUMERIC DEFAULT 0,
  time_taken TEXT,
  photo_url TEXT,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  verified_built BOOLEAN DEFAULT true,
  posted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  college_name TEXT,
  department TEXT,
  year_or_roll_no TEXT,
  hostel_address TEXT,
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create Policies allowing public read and write access for anon & auth users
CREATE POLICY "Allow public access on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public access on projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow public access on orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public access on community_posts" ON public.community_posts FOR ALL USING (true);
CREATE POLICY "Allow public access on user_profiles" ON public.user_profiles FOR ALL USING (true);
