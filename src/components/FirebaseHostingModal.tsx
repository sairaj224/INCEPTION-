import React, { useState } from 'react';
import { Flame, Check, Copy, ExternalLink, X, HardDrive, Globe, ShieldCheck, Terminal, ArrowRight } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';
import { storage } from '../lib/firebase';

interface FirebaseHostingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseHostingModal: React.FC<FirebaseHostingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const projectId = firebaseConfig?.projectId || 'gen-lang-client-0556791099';
  const storageBucket = firebaseConfig?.storageBucket || `${projectId}.firebasestorage.app`;
  const hostingUrl = `https://${projectId}.web.app`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center space-x-2">
                <span>Firebase Hosting & Cloud Storage</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-[10px] uppercase font-extrabold">
                  Configured & Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Deploy your static web bundle to Firebase Hosting & store media in Cloud Storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300">

          {/* Status summary banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 flex items-start space-x-3">
              <Globe className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">Hosting Target</div>
                <div className="text-sm font-bold text-white font-mono break-all">{hostingUrl}</div>
                <div className="text-[11px] text-amber-200/80">Global CDN edge serving /dist bundle</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-blue-200 flex items-start space-x-3">
              <HardDrive className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-[11px] uppercase font-bold text-blue-400 tracking-wider">Cloud Storage Bucket</div>
                <div className="text-sm font-bold text-white font-mono break-all">{storageBucket}</div>
                <div className="text-[11px] text-blue-200/80">
                  {storage ? 'Active client initialized' : 'Configured in firebase-applet-config.json'}
                </div>
              </div>
            </div>
          </div>

          {/* Deployment steps */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>How to Deploy to Firebase Hosting</span>
            </h3>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">Step 1: Install Firebase CLI & Login</span>
                  <button
                    onClick={() => copyToClipboard('npm install -g firebase-tools && firebase login', 'step1')}
                    className="flex items-center space-x-1 text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px]"
                  >
                    {copiedCmd === 'step1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'step1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-200">
                  npm install -g firebase-tools && firebase login
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">Step 2: Build the Production Bundle</span>
                  <button
                    onClick={() => copyToClipboard('npm run build', 'step2')}
                    className="flex items-center space-x-1 text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px]"
                  >
                    {copiedCmd === 'step2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'step2' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-200">
                  npm run build
                </div>
                <p className="text-[11px] text-slate-400">
                  Produces optimized static assets in the <code className="text-amber-300">/dist</code> directory configured in your <code className="text-amber-300">firebase.json</code>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">Step 3: Deploy Hosting & Firestore Rules</span>
                  <button
                    onClick={() => copyToClipboard(`firebase deploy --only hosting,firestore:rules`, 'step3')}
                    className="flex items-center space-x-1 text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px]"
                  >
                    {copiedCmd === 'step3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'step3' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-300 font-bold">
                  firebase deploy --only hosting,firestore:rules
                </div>
                <p className="text-[11px] text-slate-400">
                  100% Free Spark tier command! This deploys your static files to Firebase global CDN and syncs Firestore database security rules without requiring billing.
                </p>
              </div>
            </div>
          </div>

          {/* Cloud Storage Capabilities Info */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-white text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Firebase Cloud Storage Capabilities in this App</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
              <li><strong className="text-slate-200">Automatic File Uploads:</strong> When uploading component photos, datasheets, or student project builds, files are uploaded directly to Firebase Storage bucket <code className="text-blue-300">{storageBucket}</code>.</li>
              <li><strong className="text-slate-200">Instant Download URLs:</strong> Returns permanent secure HTTPS URLs for direct CDN delivery in component cards.</li>
              <li><strong className="text-slate-200">Automatic Fallback:</strong> If offline or during development previews, automatically preserves data URLs for uninterrupted student testing.</li>
            </ul>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <a
            href={`https://console.firebase.google.com/project/${projectId}/overview`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
          >
            <span>Open Firebase Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
