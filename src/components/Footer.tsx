import React from 'react';
import { Shield, Cookie, Zap, FileText, Cpu, Heart, BarChart3, Globe, Bug, GitBranch } from 'lucide-react';
import { InceptionLogo } from './InceptionLogo';

interface FooterProps {
  onOpenLegalTerms: () => void;
  onOpenLegalPrivacy: () => void;
  onOpenCookieSettings: () => void;
  onOpenCacheSettings: () => void;
  onOpenSitemap?: () => void;
  onOpenErrorLogs?: () => void;
  onOpenAdminInventory?: () => void;
  isAdminAuthenticated?: boolean;
  onOpenSupabaseModal?: () => void;
  onOpenFirebaseHosting?: () => void;
  onOpenFlowchart?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalTerms,
  onOpenLegalPrivacy,
  onOpenCookieSettings,
  onOpenCacheSettings,
  onOpenSitemap,
  onOpenErrorLogs,
  onOpenAdminInventory,
  isAdminAuthenticated,
  onOpenSupabaseModal,
  onOpenFirebaseHosting,
  onOpenFlowchart,
}) => {
  return (
    <footer className="mt-16 bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800/80">
          
          {/* Col 1: Store Branding & Cache Status */}
          <div className="space-y-3 md:col-span-1">
            <div>
              <InceptionLogo size="md" showSubtitle={false} showVersion={false} />
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Campus Electronics & Microcontroller Hardware Lab Store. Special student discounts & hostel dispatch.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenCacheSettings}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 text-[11px] font-semibold transition-all"
              >
                <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                <span>⚡ Store Offline Cached</span>
              </button>
            </div>
          </div>

          {/* Col 2: Legal & Governance */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider">Legal & Store Governance</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={onOpenLegalTerms}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLegalPrivacy}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <Shield className="w-3 h-3 text-slate-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCookieSettings}
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <Cookie className="w-3 h-3 text-slate-500" />
                  <span>Cookie & Privacy Controls</span>
                </button>
              </li>
              {onOpenSitemap && (
                <li>
                  <button
                    onClick={onOpenSitemap}
                    className="hover:text-blue-400 transition-colors flex items-center space-x-1"
                  >
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span>Store Sitemap & SEO Index</span>
                  </button>
                </li>
              )}
              {onOpenFlowchart && (
                <li>
                  <button
                    onClick={onOpenFlowchart}
                    className="hover:text-blue-400 text-blue-300 font-semibold transition-colors flex items-center space-x-1"
                  >
                    <GitBranch className="w-3 h-3 text-blue-400" />
                    <span>User Interaction Flowchart</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Caching & Performance */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider">Performance & Diagnostics</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={onOpenCacheSettings}
                  className="hover:text-amber-400 transition-colors flex items-center space-x-1"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Cache Diagnostics & Sync</span>
                </button>
              </li>
              {onOpenErrorLogs && (
                <li>
                  <button
                    onClick={onOpenErrorLogs}
                    className="hover:text-rose-400 transition-colors flex items-center space-x-1 text-slate-400"
                  >
                    <Bug className="w-3 h-3 text-rose-400" />
                    <span>System Diagnostics & Error Logs</span>
                  </button>
                </li>
              )}
              <li className="text-slate-500">
                <span>Fast local storage for lab pinouts</span>
              </li>
              <li className="text-slate-500">
                <span>Auto-saved student cart & watchlists</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © {new Date().getFullYear()} Inception College Store. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onOpenLegalTerms} className="hover:underline">Terms</button>
            <span>•</span>
            <button onClick={onOpenLegalPrivacy} className="hover:underline">Privacy</button>
            <span>•</span>
            <button onClick={onOpenCookieSettings} className="hover:underline">Cookies</button>
            <span>•</span>
            <button onClick={onOpenCacheSettings} className="hover:underline">Cache Settings</button>
            {onOpenFirebaseHosting && (
              <>
                <span>•</span>
                <button onClick={onOpenFirebaseHosting} className="hover:underline text-amber-400 font-bold flex items-center space-x-1">
                  <span>Firebase Hosting & Storage</span>
                </button>
              </>
            )}
            {onOpenSupabaseModal && (
              <>
                <span>•</span>
                <button onClick={onOpenSupabaseModal} className="hover:underline text-emerald-400 font-bold flex items-center space-x-1">
                  <span>Supabase Database Guide</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
