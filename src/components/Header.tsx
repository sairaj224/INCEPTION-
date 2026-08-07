import React from 'react';
import { Sparkles, ShoppingBag, Compass, BookOpen, Users, ShieldCheck, CheckCircle2, Settings2, UserCheck, ShieldAlert, User, HelpCircle, Heart, LogIn, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';
import { InceptionLogo } from './InceptionLogo';

interface HeaderProps {
  activeTab: 'projects' | 'marketplace';
  setActiveTab: (tab: 'projects' | 'marketplace') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenFinder: () => void;
  onOpenSubscription: () => void;
  isStudentVerified: boolean;
  userRole: 'student' | 'owner';
  setUserRole: (role: 'student' | 'owner') => void;
  onOpenAdminInventory: () => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenBuyerLogin?: (msg?: string) => void;
  isAdminAuthenticated?: boolean;
  onOpenAdminLogin?: (msg?: string) => void;
  onAdminLogout?: () => void;
  onOpenSupport?: () => void;
  watchlistCount?: number;
  onOpenWatchlist?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenFinder,
  onOpenSubscription,
  isStudentVerified,
  userRole,
  setUserRole,
  onOpenAdminInventory,
  userProfile,
  onOpenProfile,
  onOpenBuyerLogin,
  isAdminAuthenticated = false,
  onOpenAdminLogin,
  onAdminLogout,
  onOpenSupport,
  watchlistCount = 0,
  onOpenWatchlist,
  theme = 'dark',
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[76px] py-2">
          
          {/* Logo & Branding */}
          <div className="cursor-pointer py-1 group mr-auto md:mr-8 lg:mr-12" onClick={() => setActiveTab('projects')}>
            <InceptionLogo size="lg" />
          </div>

          {/* Core Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Store</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            
            {/* 1. STORE OWNER / ADMIN LOGGED IN VIEW */}
            {isAdminAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Store Owner Mode</span>
                </div>

                <button
                  onClick={onOpenAdminInventory}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95"
                  title="Edit Prices, Stock & View Orders"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>

                {onAdminLogout && (
                  <button
                    onClick={onAdminLogout}
                    className="flex items-center space-x-1 h-9 px-3 rounded-full bg-slate-800 hover:bg-rose-900/40 text-rose-300 border border-slate-700 text-xs font-medium transition-all"
                    title="Log Out of Admin Portal"
                  >
                    <LogIn className="w-3.5 h-3.5 rotate-180" />
                    <span className="hidden md:inline">Log Out</span>
                  </button>
                )}
              </div>
            ) : userProfile.isLoggedIn ? (
              /* 2. BUYER LOGGED IN VIEW */
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center space-x-1.5 h-9 px-3.5 rounded-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all"
                  title="Buyer Account & College Profile"
                >
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>{userProfile.name ? userProfile.name.split(' ')[0] : 'Buyer Profile'}</span>
                  <span className="px-1.5 py-0.2 bg-blue-500 text-white text-[9px] rounded-full font-black uppercase">Buyer</span>
                </button>
              </div>
            ) : (
              /* 3. GUEST / NOT LOGGED IN VIEW */
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onOpenBuyerLogin && onOpenBuyerLogin("Log in or create a student buyer account to view your orders, cart, and campus discounts.")}
                  className="flex items-center space-x-1.5 h-9 px-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all transform active:scale-95"
                  title="Sign In or Register as Student Buyer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Buyer Sign In</span>
                </button>

                <button
                  onClick={() => onOpenAdminLogin && onOpenAdminLogin("Please log in with Store Owner credentials to access Admin mode.")}
                  className="flex items-center space-x-1.5 h-9 px-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-all"
                  title="Store Owner & Admin Login"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Admin Login</span>
                </button>
              </div>
            )}

            {/* Student ID Verification / Subscription Pill */}
            <button
              onClick={onOpenSubscription}
              className={`flex items-center space-x-1 h-9 px-3 rounded-full text-xs font-semibold border transition-all ${
                isStudentVerified
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isStudentVerified ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden lg:inline">.EDU</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden lg:inline">Student</span>
                </>
              )}
            </button>

            {/* Customer Support Button */}
            {onOpenSupport && (
              <button
                onClick={onOpenSupport}
                className="flex items-center space-x-1.5 h-9 px-3.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
                title="Customer Support & Help"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Support</span>
              </button>
            )}

            {/* Watchlist / Saved Items Button */}
            {onOpenWatchlist && (
              <button
                onClick={onOpenWatchlist}
                className="relative h-9 px-3.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center space-x-1"
                title="Saved Watchlist"
                aria-label="View Watchlist"
              >
                <Heart className={`w-4 h-4 ${watchlistCount > 0 ? 'text-rose-400 fill-rose-500/30' : 'text-slate-400'}`} />
                <span className="hidden sm:inline text-xs font-bold">Watchlist</span>
                {watchlistCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md ml-1">
                    {watchlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative h-9 px-3.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center space-x-1"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md ml-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dark / White Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center justify-center shrink-0 active:scale-95 shadow-sm"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Dark or Light Mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-400" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex flex-col items-center py-1 px-2 ${activeTab === 'projects' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex flex-col items-center py-1 px-2 ${activeTab === 'marketplace' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            Store
          </button>
        </div>
      </div>
    </header>
  );
};
