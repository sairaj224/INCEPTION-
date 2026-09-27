import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShoppingBag, Compass, BookOpen, Users, ShieldCheck, CheckCircle2, Settings2, UserCheck, ShieldAlert, User, HelpCircle, Heart, LogIn, Sun, Moon, GraduationCap, Menu, X, ChevronRight, ChevronDown, ExternalLink, GitBranch, Layers } from 'lucide-react';
import { UserProfile } from '../types';
import { InceptionLogo } from './InceptionLogo';

// Default scenic mountain & lake illustration avatar matching user pinhole photo
const DEFAULT_SCENIC_AVATAR = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=240&auto=format&fit=crop&q=85';

interface UserPinAvatarProps {
  userProfile?: UserProfile;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserPinAvatar: React.FC<UserPinAvatarProps> = ({ userProfile, size = 'md', className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-14 h-14' : size === 'xl' ? 'w-20 h-20' : 'w-8 h-8 sm:w-9 sm:h-9';
  const avatarSrc = userProfile?.avatarUrl || DEFAULT_SCENIC_AVATAR;

  return (
    <div className={`relative ${sizeClasses} rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-slate-800 shrink-0 ring-2 ring-slate-900/80 ${className}`}>
      {!imgError ? (
        <img
          src={avatarSrc}
          alt={userProfile?.name || 'Buyer Profile'}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover select-none"
        />
      ) : (
        /* Fallback Scenic Mountain-Lake Pin Hole Vector */
        <div className="w-full h-full bg-gradient-to-b from-sky-400 via-teal-500 to-emerald-700 flex items-center justify-center relative overflow-hidden">
          {/* Mountain Silhouette */}
          <div className="absolute inset-0 flex items-end justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-90">
              <polygon points="0,100 25,45 50,75 75,35 100,100" fill="#1e3a8a" />
              <polygon points="20,100 45,55 70,85 100,100" fill="#047857" opacity="0.8" />
              <ellipse cx="50" cy="92" rx="48" ry="12" fill="#38bdf8" opacity="0.9" />
            </svg>
          </div>
          <span className="relative z-10 text-[10px] font-black text-white drop-shadow-md">
            {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
      )}
    </div>
  );
};

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
  onBuyerLogout?: () => void;
  isAdminAuthenticated?: boolean;
  onOpenAdminLogin?: (msg?: string) => void;
  onAdminLogout?: () => void;
  onOpenSupport?: () => void;
  watchlistCount?: number;
  onOpenWatchlist?: () => void;
  onOpenFlowchart?: () => void;
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
  onBuyerLogout,
  isAdminAuthenticated = false,
  onOpenAdminLogin,
  onAdminLogout,
  onOpenSupport,
  watchlistCount = 0,
  onOpenWatchlist,
  onOpenFlowchart,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isUserLoggedIn = Boolean(userProfile?.isLoggedIn || (userProfile?.email && userProfile.email.includes('@')));

  // Close lines menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 py-1.5 gap-2">
          
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

          {/* Top Right Actions & User Pin Hole Menu */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0" ref={menuRef}>
            
            {/* Direct Quick-Access Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative h-9 px-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center justify-center space-x-1.5 active:scale-95 shadow-sm"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="bg-blue-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Quick Admin Indicator if logged in as Admin */}
            {isAdminAuthenticated && (
              <button
                onClick={onOpenAdminInventory}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all"
                title="Open Admin Dashboard"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </button>
            )}

            {/* USER PIN HOLE PICTURE BUTTON (replaces plain menu button) */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`h-9 pl-1 pr-2.5 sm:pr-3 rounded-full flex items-center justify-center space-x-2 font-bold text-xs border transition-all active:scale-95 shadow-sm ${
                  isMenuOpen
                    ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/40 text-white shadow-amber-500/10'
                    : 'bg-slate-800 hover:bg-slate-700/90 border-slate-700 text-slate-200 hover:border-slate-600'
                }`}
                title="Open User Profile & Menu"
                aria-label="Toggle User Profile and Actions Menu"
                aria-expanded={isMenuOpen}
              >
                {/* Circular User Pin Hole Avatar */}
                <UserPinAvatar userProfile={userProfile} size="sm" />
                
                {/* Buyer Name & Status */}
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold text-slate-100 max-w-[85px] sm:max-w-[110px] truncate">
                    {isUserLoggedIn && userProfile.name ? userProfile.name.split(' ')[0] : (isUserLoggedIn && userProfile.email ? userProfile.email.split('@')[0] : 'Account')}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </div>

                {(watchlistCount > 0 || isStudentVerified) && !isMenuOpen && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900 absolute -top-0.5 -right-0.5" />
                )}
              </button>

              {/* USER PIN HOLE PROFILE & ACTIONS DROPDOWN PANEL */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-200">
                  
                  {/* Pinhole Picture & Buyer Name Card (Center-Aligned Header matching screenshot) */}
                  <div className="flex flex-col items-center text-center p-3 mb-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-inner">
                    
                    {/* Big Circular Pin Hole Picture */}
                    <div className="relative mb-2">
                      <UserPinAvatar userProfile={userProfile} size="lg" className="border-2 border-amber-400 shadow-lg" />
                      {isUserLoggedIn && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Buyer Full Name & Role */}
                    <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center justify-center space-x-1">
                      <span>{userProfile.name || (isUserLoggedIn ? 'Verified Student Member' : 'Student Buyer / Guest')}</span>
                    </h3>

                    {/* Buyer Email */}
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {userProfile.email || (isUserLoggedIn ? 'Signed In' : 'Sign in to sync your cart & orders')}
                    </p>

                    {/* Buyer College / Tag */}
                    <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-[10px] font-bold text-blue-300">
                        {userProfile.collegeName || 'Engineering Student Buyer'}
                      </span>
                      {isStudentVerified && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                          15% .EDU Discount Active
                        </span>
                      )}
                    </div>

                    {/* Profile Actions */}
                    <div className="w-full mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between gap-1.5">
                      {isUserLoggedIn ? (
                        <>
                          <button
                            onClick={() => {
                              onOpenProfile();
                              setIsMenuOpen(false);
                            }}
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>My Profile</span>
                          </button>
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => {
                                if (onOpenBuyerLogin) onOpenBuyerLogin("Switch buyer account or update your details.");
                                setIsMenuOpen(false);
                              }}
                              className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-700/70 hover:bg-slate-700 transition-colors"
                              title="Sign in with another email or student ID"
                            >
                              Switch
                            </button>
                            {onBuyerLogout && (
                              <button
                                onClick={() => {
                                  onBuyerLogout();
                                  setIsMenuOpen(false);
                                }}
                                className="text-[11px] font-semibold text-rose-300 hover:text-rose-200 px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 transition-colors"
                                title="Log out from this device"
                              >
                                Logout
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            if (onOpenBuyerLogin) onOpenBuyerLogin("Log in or create a student buyer account to track your orders and save carts.");
                            setIsMenuOpen(false);
                          }}
                          className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Buyer Sign In with Email</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions & Utilities List */}
                  <div className="space-y-1">
                    <p className="px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tools & Services</p>
                    
                    {/* Cart in menu */}
                    <button
                      onClick={() => {
                        onOpenCart();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-all text-xs font-semibold text-slate-200 group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <ShoppingBag className="w-4 h-4 text-blue-400" />
                        <span>Shopping Cart</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {cartCount > 0 ? (
                          <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {cartCount} items
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Empty</span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                      </div>
                    </button>

                    {/* Saved Watchlist */}
                    {onOpenWatchlist && (
                      <button
                        onClick={() => {
                          onOpenWatchlist();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-all text-xs font-semibold text-slate-200 group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Heart className={`w-4 h-4 ${watchlistCount > 0 ? 'text-rose-400 fill-rose-500/30' : 'text-slate-400'}`} />
                          <span>Saved Watchlist</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {watchlistCount > 0 && (
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                              {watchlistCount}
                            </span>
                          )}
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                        </div>
                      </button>
                    )}

                    {/* Student Verification & Campus Discount */}
                    <button
                      onClick={() => {
                        onOpenSubscription();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-all text-xs font-semibold text-slate-200 group"
                    >
                      <div className="flex items-center space-x-2.5">
                        {isStudentVerified ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                        )}
                        <span>Student .EDU Discount</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isStudentVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {isStudentVerified ? 'Active 15% OFF' : 'Verify ID'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                      </div>
                    </button>

                    {/* Customer Support & Help Desk */}
                    {onOpenSupport && (
                      <button
                        onClick={() => {
                          onOpenSupport();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-all text-xs font-semibold text-slate-200 group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <HelpCircle className="w-4 h-4 text-emerald-400" />
                          <span>Campus Support & Help</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                      </button>
                    )}

                    {/* User Interaction Flowchart */}
                    {onOpenFlowchart && (
                      <button
                        onClick={() => {
                          onOpenFlowchart();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-900/20 text-blue-300 hover:text-blue-200 transition-all text-xs font-semibold group border border-blue-500/20 bg-blue-950/30"
                      >
                        <div className="flex items-center space-x-2.5">
                          <GitBranch className="w-4 h-4 text-blue-400" />
                          <span>User Interaction Flowchart</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300">
                          View
                        </span>
                      </button>
                    )}

                    {/* Store Owner / Admin Login Option */}
                    {isAdminAuthenticated ? (
                      <button
                        onClick={() => {
                          onOpenAdminInventory();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all text-xs font-bold group border border-amber-500/20"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Settings2 className="w-4 h-4 text-amber-400" />
                          <span>Admin Inventory & Prices</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (onOpenAdminLogin) onOpenAdminLogin("Please log in with Store Owner credentials to access Admin mode.");
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-amber-300/90 hover:text-amber-300 transition-all text-xs font-semibold group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          <span>Store Owner / Admin Portal</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                      </button>
                    )}

                    {/* Dark / Light Theme Toggle */}
                    {onToggleTheme && (
                      <button
                        onClick={() => {
                          onToggleTheme();
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-all text-xs font-semibold text-slate-200"
                      >
                        <div className="flex items-center space-x-2.5">
                          {theme === 'dark' ? (
                            <Sun className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Moon className="w-4 h-4 text-indigo-400" />
                          )}
                          <span>Appearance Mode</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">
                          {theme === 'dark' ? 'Dark' : 'Light'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
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

