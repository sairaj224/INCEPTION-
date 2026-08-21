import React, { useState } from 'react';
import { Cookie, ShieldCheck, Settings, X, Check } from 'lucide-react';
import { CookiePreferences } from '../types';

interface CookieConsentBannerProps {
  preferences: CookiePreferences;
  onSavePreferences: (prefs: CookiePreferences) => void;
  onOpenPreferencesModal: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  preferences,
  onSavePreferences,
  onOpenPreferencesModal,
}) => {
  if (preferences.hasConsented) {
    return null;
  }

  const handleAcceptAll = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onSavePreferences({
      essential: true,
      analytics: true,
      cachingPerformance: true,
      marketing: true,
      hasConsented: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRejectOptional = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onSavePreferences({
      essential: true,
      analytics: false,
      cachingPerformance: true, // Keep performance cache active
      marketing: false,
      hasConsented: true,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div
      id="cookie-consent-banner"
      role="region"
      aria-label="Cookie and Data Privacy Consent"
      className="fixed bottom-0 inset-x-0 z-[70] p-4 sm:p-5 bg-slate-900/98 backdrop-blur-lg border-t-2 border-blue-500/50 text-slate-200 shadow-2xl animate-slideUp"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left icon & summary */}
        <div className="flex items-start space-x-3 max-w-3xl">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">Cookie & Data Privacy Preferences</h3>
              <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded font-semibold border border-slate-700">
                GDPR & DPDP Compliant
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              We use local browser storage and performance caching cookies to save your cart, active lab projects, student discount verification, and offline catalog data. You can accept all or customize preferences anytime.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end relative z-10">
          <button
            id="customize-cookies-btn"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenPreferencesModal();
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Customize</span>
          </button>

          <button
            id="essential-only-cookies-btn"
            type="button"
            onClick={handleRejectOptional}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer active:scale-95"
          >
            Essential Only
          </button>

          <button
            id="accept-all-cookies-btn"
            type="button"
            onClick={handleAcceptAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center space-x-1.5 ring-2 ring-blue-500/40 cursor-pointer active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept All Cookies</span>
          </button>
        </div>

      </div>
    </div>
  );
};
