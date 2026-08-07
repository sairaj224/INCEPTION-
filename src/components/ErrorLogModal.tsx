import React, { useState, useEffect } from 'react';
import { X, Bug, Download, Trash2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { AppLogger, LogEntry } from '../lib/logger';

interface ErrorLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ErrorLogModal: React.FC<ErrorLogModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLogs(AppLogger.getLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setLogs(AppLogger.getLogs());
  };

  const handleClear = () => {
    if (window.confirm('Clear all stored error and system diagnostic logs?')) {
      AppLogger.clearLogs();
      setLogs([]);
    }
  };

  const handleDownloadLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inception_system_logs_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">System Diagnostics & Error Logs</h2>
              <p className="text-xs text-slate-400">Captured client errors, API exceptions, and security alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Total Entries:</span>
            <span className="px-2 py-0.5 bg-slate-800 text-amber-300 font-bold rounded border border-slate-700">
              {logs.length} Logs
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 flex items-center space-x-1 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleDownloadLogs}
              disabled={logs.length === 0}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center space-x-1 shadow-sm transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Logs JSON</span>
            </button>
            <button
              onClick={handleClear}
              disabled={logs.length === 0}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-xl border border-rose-500/30 flex items-center space-x-1 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Logs</span>
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="p-6 overflow-y-auto space-y-3 font-mono text-[11px]">
          {logs.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/40 border border-slate-800 rounded-2xl space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">No System Errors Captured</h3>
              <p className="text-xs text-slate-400 font-sans">
                The application runtime, local state, and API routes are running smoothly without active errors.
              </p>
            </div>
          ) : (
            logs.slice().reverse().map((entry) => (
              <div
                key={entry.id}
                className={`p-3.5 rounded-xl border space-y-1.5 transition-all ${
                  entry.level === 'error' || entry.level === 'fatal'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : entry.level === 'warn'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-sans text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        entry.level === 'error' || entry.level === 'fatal'
                          ? 'bg-rose-600 text-white'
                          : entry.level === 'warn'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {entry.level}
                    </span>
                    <span className="font-bold text-white">[{entry.category}]</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{new Date(entry.timestamp).toLocaleString()}</span>
                </div>

                <p className="font-sans font-semibold text-slate-100">{entry.message}</p>

                {entry.details && (
                  <pre className="p-2 bg-slate-950/90 rounded-lg border border-slate-800/80 overflow-x-auto text-[10px] text-slate-400">
                    {entry.details}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
          >
            Close Diagnostics
          </button>
        </div>

      </div>
    </div>
  );
};
