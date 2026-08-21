import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, X, RefreshCw, Sparkles, ShieldCheck, Server } from 'lucide-react';
import { isSupabaseConfigured, fetchSupabaseProducts, saveSupabaseProduct, saveSupabaseProject } from '../lib/supabase';
import { Product, Project } from '../types';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  projects: Project[];
  onReloadData?: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  products,
  projects,
  onReloadData,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const isConnected = isSupabaseConfigured();

  const env = (import.meta as any).env || {};
  const supabaseUrl = env.VITE_SUPABASE_URL || '';

  const sqlSchema = `-- INCEPTION STORE SUPABASE DATABASE SETUP SCHEMA
-- Copy & paste into Supabase Dashboard -> SQL Editor -> Run

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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public access on projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow public access on orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public access on community_posts" ON public.community_posts FOR ALL USING (true);
CREATE POLICY "Allow public access on user_profiles" ON public.user_profiles FOR ALL USING (true);`;

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handlePushLocalDataToSupabase = async () => {
    if (!isConnected) {
      setSyncStatus('Please set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in Vercel environment variables first.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Syncing products and projects to Supabase...');

    let pCount = 0;
    for (const prod of products) {
      const ok = await saveSupabaseProduct(prod);
      if (ok) pCount++;
    }

    let projCount = 0;
    for (const proj of projects) {
      const ok = await saveSupabaseProject(proj);
      if (ok) projCount++;
    }

    setIsSyncing(false);
    setSyncStatus(`Successfully uploaded ${pCount}/${products.length} products and ${projCount}/${projects.length} project kits to Supabase!`);
    if (onReloadData) onReloadData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center space-x-2">
                <span>Supabase Database Connection Guide</span>
                {isConnected ? (
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-[10px] uppercase font-extrabold">
                    Connected
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-[10px] uppercase font-extrabold">
                    Needs Credentials
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                How to integrate your hosted Vercel / Netlify website with Supabase PostgreSQL
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300">

          {/* Connection Status Card */}
          <div className={`p-4 rounded-2xl border ${
            isConnected
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex items-start space-x-3">
              {isConnected ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Server className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm">
                  {isConnected ? 'Supabase Client Connected Successfully!' : 'Supabase Environment Variables Pending'}
                </h4>
                <p className="text-xs opacity-90 leading-relaxed">
                  {isConnected
                    ? `Connected to Supabase endpoint: ${supabaseUrl}. Your catalog data automatically syncs with Supabase database tables.`
                    : 'To connect Supabase on Vercel or locally, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel Project Environment Variables.'}
                </p>
              </div>
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>3 Easy Steps to Connect Supabase</span>
            </h3>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-400">Step 1: Set Environment Variables in Vercel</span>
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-bold"
                  >
                    <span>Vercel Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-400">
                  In your Vercel Project Settings &gt; Environment Variables, add:
                </p>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-300 space-y-1">
                  <div>VITE_SUPABASE_URL = https://your-project.supabase.co</div>
                  <div>VITE_SUPABASE_ANON_KEY = your-anon-key-here</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-400">Step 2: Run Database Schema SQL in Supabase</span>
                  <button
                    onClick={handleCopySql}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl flex items-center space-x-1 transition-all"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'SQL Schema Copied!' : 'Copy SQL Setup Script'}</span>
                  </button>
                </div>
                <p className="text-slate-400">
                  Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-blue-400 underline">Supabase Dashboard</a> &gt; SQL Editor, paste the SQL script, and click "Run" to create <code className="text-amber-300">products</code>, <code className="text-amber-300">projects</code>, and <code className="text-amber-300">orders</code> tables.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-400">Step 3: Sync Local Store Catalog to Supabase</span>
                  <button
                    onClick={handlePushLocalDataToSupabase}
                    disabled={isSyncing || !isConnected}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl flex items-center space-x-1.5 transition-all shadow-md"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Upload Catalog to Supabase</span>
                  </button>
                </div>
                {syncStatus && (
                  <p className="text-amber-300 font-mono text-[11px] bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    {syncStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-400">
            Fallback active: If Supabase keys are not set, local browser storage is automatically used.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
