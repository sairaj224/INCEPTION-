import React, { useState } from 'react';
import { X, ShieldCheck, Cookie, Save, CheckCircle2 } from 'lucide-react';
import { CookiePreferences } from '../types';

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: CookiePreferences;
  onSavePreferences: (prefs: CookiePreferences) => void;
}

export const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [analytics, setAnalytics] = useState(preferences.analytics);
  const [caching, setCaching] = useState(preferences.cachingPerformance);
  const [marketing, setMarketing] = useState(preferences.marketing);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePreferences({
      essential: true,
      analytics,
      cachingPerformance: caching,
      marketing,
      hasConsented: true,
      updatedAt: new Date().toISOString(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Cookie & Privacy Controls</h2>
              <p className="text-xs text-slate-400">Manage how data and cache are stored on your device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Toast */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Privacy preferences saved successfully!</span>
          </div>
        )}

        {/* Toggles List */}
        <div className="space-y-4 text-xs">
          
          {/* Essential */}
          <div className="p-3.5 bg-slate-800/60 border border-slate-700/80 rounded-xl flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">Essential & Session Storage</span>
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[10px] font-bold uppercase">Required</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Necessary for cart items, order checkout history, and student profile login state. Cannot be disabled.
              </p>
            </div>
            <div className="shrink-0 mt-1">
              <input type="checkbox" checked disabled className="w-4 h-4 accent-blue-600 cursor-not-allowed" />
            </div>
          </div>

          {/* Performance Caching */}
          <div className="p-3.5 bg-slate-800/60 border border-slate-700/80 rounded-xl flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold text-white">Offline Performance Caching</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Stores catalog components and project guides locally so the store loads instantly even on weak campus Wi-Fi.
              </p>
            </div>
            <div className="shrink-0 mt-1">
              <input
                type="checkbox"
                checked={caching}
                onChange={(e) => setCaching(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Analytics */}
          <div className="p-3.5 bg-slate-800/60 border border-slate-700/80 rounded-xl flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold text-white">Store Analytics & Search Trends</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Helps store admins analyze which components are in high demand across engineering departments to restock accurately.
              </p>
            </div>
            <div className="shrink-0 mt-1">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Marketing */}
          <div className="p-3.5 bg-slate-800/60 border border-slate-700/80 rounded-xl flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold text-white">Campus Offers & Discount Notifications</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Allows displaying personalized student coupon popups and flash discount banners on component kits.
              </p>
            </div>
            <div className="shrink-0 mt-1">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Your settings are saved locally</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center space-x-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
