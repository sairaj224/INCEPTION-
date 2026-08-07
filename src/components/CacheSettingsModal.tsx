import React, { useState, useEffect } from 'react';
import { X, HardDrive, RefreshCw, Trash2, CheckCircle2, Zap, AlertTriangle } from 'lucide-react';
import { CacheStats } from '../types';

interface CacheSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productsCount: number;
  projectsCount: number;
  ordersCount: number;
  onClearAllCache: () => void;
  onForceRefreshCatalog: () => void;
}

export const CacheSettingsModal: React.FC<CacheSettingsModalProps> = ({
  isOpen,
  onClose,
  productsCount,
  projectsCount,
  ordersCount,
  onClearAllCache,
  onForceRefreshCatalog,
}) => {
  const [storageBytes, setStorageBytes] = useState<number>(0);
  const [lastCachedTime, setLastCachedTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      calculateStorage();
      setLastCachedTime(new Date().toLocaleTimeString());
    }
  }, [isOpen]);

  const calculateStorage = () => {
    let total = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          total += key.length + value.length;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setStorageBytes(total * 2); // approximate UTF-16 bytes
  };

  if (!isOpen) return null;

  const storageKb = (storageBytes / 1024).toFixed(1);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      onForceRefreshCatalog();
      calculateStorage();
      setIsRefreshing(false);
      setSuccessMessage('Catalog cache synced with latest store inventory!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 600);
  };

  const handleClear = () => {
    if (window.confirm('Clear all local store cache, saved cart items, and stored preference data?')) {
      onClearAllCache();
      calculateStorage();
      setSuccessMessage('All browser cache and offline storage cleared!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Local Caching & Performance</h2>
              <p className="text-xs text-slate-400">Offline catalog cache & storage management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Toast */}
        {successMessage && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Cache Diagnostics Card */}
        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Cache Status:</span>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg border border-emerald-500/30 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Active (Offline Ready)</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-slate-300">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Storage Used</span>
              <span className="text-base font-extrabold text-amber-400">{storageKb} KB</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Last Synced</span>
              <span className="text-xs font-bold text-slate-200 mt-1 block">{lastCachedTime || 'Just now'}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="pt-2 border-t border-slate-700/60 space-y-1.5 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Cached Electronics Components:</span>
              <strong className="text-white">{productsCount} Items</strong>
            </div>
            <div className="flex justify-between">
              <span>Cached Student Projects:</span>
              <strong className="text-white">{projectsCount} Projects</strong>
            </div>
            <div className="flex justify-between">
              <span>Cached Orders & History:</span>
              <strong className="text-white">{ordersCount} Orders</strong>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 text-xs">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Force Re-sync Catalog & Refresh Cache</span>
          </button>

          <button
            onClick={handleClear}
            className="w-full py-2 bg-slate-800 hover:bg-rose-900/30 text-rose-300 hover:text-rose-200 font-semibold rounded-xl border border-slate-700 hover:border-rose-500/40 transition-all flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear Cache & Reset Storage Data</span>
          </button>
        </div>

        {/* Info */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Caching allows the engineering store catalog and lab pinout guides to open instantly without re-downloading image assets on every page refresh.
          </span>
        </div>

      </div>
    </div>
  );
};
