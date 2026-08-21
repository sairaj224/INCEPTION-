import React from 'react';
import { Sparkles, ShoppingBag, Compass, BookOpen, Users, ShieldCheck, CheckCircle2, Settings2, UserCheck, ShieldAlert, User, HelpCircle, Heart, LogIn, Sun, Moon, GraduationCap } from 'lucide-react';
import { UserProfile } from '../types';
import { InceptionLogo } from './InceptionLogo';

interface HeaderProps {
  activeTab: 'projects' | 'marketplace' | 'learn';
  setActiveTab: (tab: 'projects' | 'marketplace' | 'learn') => void;
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
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 py-1.5 gap-1 sm:gap-3">
          
          {/* Logo & Branding */}
          <div className="cursor-pointer py-1 group shrink-0 min-w-0" onClick={() => setActiveTab('projects')}>
            <InceptionLogo size="lg" />
          </div>

          {/* Core Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 shrink-0">
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

            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'learn'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold ring-1 ring-indigo-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Learning Hub</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                New
              </span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            
            {/* 1. STORE OWNER / ADMIN LOGGED IN VIEW */}
            {isAdminAuthenticated ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Store Owner Mode</span>
                </div>

                <button
                  onClick={onOpenAdminInventory}
                  className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95"
                  title="Edit Prices, Stock & View Orders"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  <span className="sm:hidden">Admin</span>
                </button>

                {onAdminLogout && (
                  <button
                    onClick={onAdminLogout}
                    className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-auto sm:px-3 rounded-full bg-slate-800 hover:bg-rose-900/40 text-rose-300 border border-slate-700 text-xs font-medium transition-all"
                    title="Log Out of Admin Portal"
                  >
                    <LogIn className="w-3.5 h-3.5 rotate-180" />
                    <span className="hidden md:inline ml-1">Log Out</span>
                  </button>
                )}
              </div>
            ) : userProfile.isLoggedIn ? (
              /* 2. BUYER LOGGED IN VIEW */
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center space-x-1 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all"
                  title="Buyer Account & College Profile"
                >
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span className="max-w-[70px] sm:max-w-none truncate">{userProfile.name ? userProfile.name.split(' ')[0] : 'Profile'}</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 bg-blue-500 text-white text-[9px] rounded-full font-black uppercase">Buyer</span>
                </button>
              </div>
            ) : (
              /* 3. GUEST / NOT LOGGED IN VIEW */
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onOpenBuyerLogin && onOpenBuyerLogin("Log in or create a student buyer account to view your orders, cart, and campus discounts.")}
                  className="flex items-center space-x-1 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all transform active:scale-95"
                  title="Sign In or Register as Student Buyer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buyer Sign In</span>
                  <span className="sm:hidden text-[11px]">Sign In</span>
                </button>

                <button
                  onClick={() => onOpenAdminLogin && onOpenAdminLogin("Please log in with Store Owner credentials to access Admin mode.")}
                  className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-auto sm:px-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-all"
                  title="Store Owner & Admin Login"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline ml-1">Admin</span>
                </button>
              </div>
            )}

            {/* Student ID Verification / Subscription Pill */}
            <button
              onClick={onOpenSubscription}
              className={`flex items-center justify-center h-8 w-8 sm:h-9 sm:w-auto sm:px-3 rounded-full text-xs font-semibold border transition-all ${
                isStudentVerified
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Student Discount Status"
            >
              {isStudentVerified ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden lg:inline ml-1">.EDU</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden lg:inline ml-1">Student</span>
                </>
              )}
            </button>

            {/* Customer Support Button */}
            {onOpenSupport && (
              <button
                onClick={onOpenSupport}
                className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-auto sm:px-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
                title="Customer Support & Help"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline ml-1">Support</span>
              </button>
            )}

            {/* Watchlist / Saved Items Button */}
            {onOpenWatchlist && (
              <button
                onClick={onOpenWatchlist}
                className="relative h-8 w-8 sm:h-9 sm:w-auto sm:px-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center justify-center space-x-1"
                title="Saved Watchlist"
                aria-label="View Watchlist"
              >
                <Heart className={`w-3.5 h-3.5 ${watchlistCount > 0 ? 'text-rose-400 fill-rose-500/30' : 'text-slate-400'}`} />
                <span className="hidden lg:inline text-xs font-bold">Watchlist</span>
                {watchlistCount > 0 && (
                  <span className="bg-rose-500 text-white text-[9px] font-bold px-1 py-0.2 rounded-full shadow-md ml-0.5 sm:ml-1">
                    {watchlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative h-8 w-8 sm:h-9 sm:w-auto sm:px-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center justify-center space-x-1"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline text-xs font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="bg-blue-500 text-white text-[9px] font-bold px-1 py-0.2 rounded-full shadow-md ml-0.5 sm:ml-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dark / White Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center justify-center shrink-0 active:scale-95 shadow-sm"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Dark or Light Mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="flex md:hidden items-center justify-around py-1.5 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition-all ${
              activeTab === 'projects' ? 'text-blue-400 font-bold bg-blue-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition-all ${
              activeTab === 'marketplace' ? 'text-blue-400 font-bold bg-blue-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Store</span>
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition-all ${
              activeTab === 'learn' ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 mb-0.5" />
            <span>Learn</span>
          </button>
        </div>
      </div>
    </header>
  );
};
