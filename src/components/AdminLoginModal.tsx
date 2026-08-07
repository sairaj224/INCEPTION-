import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Lock,
  Mail,
  Key,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export interface AdminProfile {
  name: string;
  email: string;
  roleTitle: string;
  department: string;
  accessLevel: 'SuperAdmin' | 'InventoryManager' | 'StoreOwner';
}

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginSuccess: (adminProfile: AdminProfile) => void;
  contextualMessage?: string;
}

// Preset Protected Admin Accounts with strict Password & PIN verification
export const PRESET_ADMIN_ACCOUNTS = [
  {
    name: 'Prof. Dr. Rajesh K.',
    email: 'admin@inceptionhardware.edu',
    roleTitle: 'Head Store Admin & Faculty Incharge',
    department: 'Electrical & Microelectronics Lab',
    accessLevel: 'SuperAdmin' as const,
    pass: 'AdminPassword@2026',
    pin: '9988',
  },
  {
    name: 'Hardware Store Owner',
    email: 'owner@inceptionhardware.com',
    roleTitle: 'Commercial Store Owner',
    department: 'Campus Hardware Store',
    accessLevel: 'StoreOwner' as const,
    pass: 'StoreOwner#2026',
    pin: '5555',
  },
];

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess,
  contextualMessage,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [securityPin, setSecurityPin] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();
    const trimmedPin = securityPin.trim();

    if (!trimmedEmail || !trimmedPass) {
      setErrorMsg('Please enter both Admin Login Email/ID and Master Password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find matching preset account with strict password and PIN matching
      const matched = PRESET_ADMIN_ACCOUNTS.find(
        (acc) =>
          acc.email.toLowerCase() === trimmedEmail &&
          acc.pass === trimmedPass &&
          (!acc.pin || acc.pin === trimmedPin)
      );

      if (!matched) {
        setIsLoading(false);
        setErrorMsg('Invalid Admin Credentials! Incorrect Login ID, Password, or Security PIN. Access denied.');
        return;
      }

      const adminProfile: AdminProfile = {
        name: matched.name,
        email: matched.email,
        roleTitle: matched.roleTitle,
        department: matched.department,
        accessLevel: matched.accessLevel,
      };

      setIsLoading(false);
      onAdminLoginSuccess(adminProfile);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Store Owner & Admin Portal
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-slate-950 rounded uppercase tracking-wider">
                  Restricted
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authorized credentials required for inventory management and price control
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contextual Message Banner */}
        {contextualMessage && (
          <div className="flex-shrink-0 bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 flex items-center space-x-2 text-xs text-amber-300 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{contextualMessage}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Email / Store Username *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@inceptionhardware.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Master Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Security PIN *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="9988"
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 transform active:scale-95 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>VERIFYING CREDENTIALS...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>LOG IN AS STORE OWNER / ADMIN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Banner */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center space-x-3 text-xs text-slate-400">
            <Building className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="leading-snug text-[11px]">
              Only users with matching preset Admin Login IDs, Passwords, and PINs will be granted store management access.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

