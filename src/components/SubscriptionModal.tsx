import React, { useState } from 'react';
import { X, ShieldCheck, Check, Sparkles, Upload, CheckCircle2 } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isStudentVerified: boolean;
  onVerifyStudent: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  isStudentVerified,
  onVerifyStudent,
}) => {
  const [eduEmail, setEduEmail] = useState<string>('');
  const [verifying, setVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduEmail.includes('@')) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onVerifyStudent();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Inception Student Subscription & Verification</h2>
              <p className="text-xs text-slate-500">Unlock unlimited AI project customization & student discounts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
          
          {/* Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Tier 1: Free */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block uppercase">Free Tier</span>
                <div className="text-2xl font-black text-slate-900">₹0 <span className="text-xs text-slate-500 font-normal">/ mo</span></div>
                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-600" /><span>3 Projects / Month</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-600" /><span>Standard BOM Generator</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-600" /><span>Community Showcase</span></li>
                </ul>
              </div>
              <button disabled className="w-full py-2 bg-slate-200 text-slate-500 font-bold text-xs rounded-lg">Current Plan</button>
            </div>

            {/* Tier 2: Student Pro */}
            <div className="p-5 rounded-xl bg-white border-2 border-blue-600 space-y-4 relative flex flex-col justify-between shadow-md">
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">MOST POPULAR</span>
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-600 block uppercase">Student Pro</span>
                <div className="text-2xl font-black text-slate-900">₹99 <span className="text-xs text-slate-500 font-normal">/ mo</span></div>
                <ul className="space-y-2 text-xs text-slate-700 pt-2">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-600" /><span>Unlimited AI Project Finder</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-600" /><span>Interactive Circuit Simulation</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-600" /><span>AI Troubleshooter Assistant</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-blue-600" /><span>10% Off Component Purchases</span></li>
                </ul>
              </div>
              <button onClick={onClose} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm">Get Student Pro</button>
            </div>

            {/* Tier 3: Class Pro */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-700 block uppercase">Class Pro</span>
                <div className="text-2xl font-black text-slate-900">₹999 <span className="text-xs text-slate-500 font-normal">/ yr</span></div>
                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-amber-700" /><span>Faculty Dashboard & Roster</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-amber-700" /><span>Bulk Class Ordering</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-amber-700" /><span>Custom Assignment Push</span></li>
                </ul>
              </div>
              <button onClick={onClose} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm">Get Class Pro</button>
            </div>
          </div>

          {/* Verification Section */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Verify College Student ID (.edu / College Email)</span>
              </h3>
              {isStudentVerified && (
                <span className="px-2.5 py-1 text-xs bg-emerald-100 text-emerald-800 font-bold rounded border border-emerald-200">
                  Verified Student
                </span>
              )}
            </div>

            {isStudentVerified ? (
              <div className="flex items-center space-x-2 text-xs text-emerald-800 p-3 bg-emerald-50 rounded-lg border border-emerald-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your student ID is verified! 10% discount automatically applied to BOM orders.</span>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="e.g., rahul.k@iitb.ac.in or .edu email"
                  value={eduEmail}
                  onChange={(e) => setEduEmail(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={verifying}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center space-x-1 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{verifying ? 'Verifying...' : 'Verify College Email'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
