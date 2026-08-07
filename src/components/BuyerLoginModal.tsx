import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Tag,
  Key,
  UserPlus,
  LogIn
} from 'lucide-react';

interface BuyerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLoginSuccess: (updatedProfile: UserProfile) => void;
  contextualMessage?: string;
  onContinueAsGuest?: () => void;
}

export const BuyerLoginModal: React.FC<BuyerLoginModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLoginSuccess,
  contextualMessage,
  onContinueAsGuest,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Sign Up Form State
  const [signupName, setSignupName] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPhone, setSignupPhone] = useState<string>('');
  const [signupCollege, setSignupCollege] = useState<string>('IIT Bombay');
  const [signupDept, setSignupDept] = useState<string>('Electronics & Electrical Engg');
  const [signupRoll, setSignupRoll] = useState<string>('');
  const [signupAddress, setSignupAddress] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupError, setSignupError] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('Please enter your college email address or student ID.');
      return;
    }

    const loggedInProfile: UserProfile = {
      id: 'usr-' + Date.now(),
      name: userProfile.name && userProfile.name !== 'Guest Visitor' ? userProfile.name : loginEmail.split('@')[0] || 'Student Buyer',
      email: loginEmail.trim(),
      phone: userProfile.phone || '+91 98000 00000',
      collegeName: userProfile.collegeName || 'Engineering College',
      department: userProfile.department || 'Electronics Engineering',
      yearOrRollNo: userProfile.yearOrRollNo || '2026-STUDENT',
      hostelAddress: userProfile.hostelAddress || 'Campus Hostel Room',
      isLoggedIn: true,
    };

    onLoginSuccess(loggedInProfile);
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPhone.trim()) {
      setSignupError('Please fill out your full name, email, and phone number.');
      return;
    }

    const newBuyerProfile: UserProfile = {
      id: 'usr-' + Date.now(),
      name: signupName.trim(),
      email: signupEmail.trim(),
      phone: signupPhone.trim(),
      collegeName: signupCollege.trim() || 'College Campus',
      department: signupDept.trim() || 'Engineering Dept',
      yearOrRollNo: signupRoll.trim() || '2026-STUDENT',
      hostelAddress: signupAddress.trim() || 'Campus Hostel Delivery',
      isLoggedIn: true,
    };

    onLoginSuccess(newBuyerProfile);
    onClose();
  };

  const handleQuickDemoLogin = (demoAcc: UserProfile) => {
    onLoginSuccess(demoAcc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Student & Buyer Login
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500 text-white rounded uppercase">
                  College Store
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Log in to order hardware, claim 10% student discount & track hostel delivery
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

        {/* Contextual Notice Banner (if triggered by checkout) */}
        {contextualMessage && (
          <div className="flex-shrink-0 bg-blue-500/10 border-b border-blue-500/30 px-4 py-2.5 flex items-center space-x-2 text-xs text-blue-300 font-medium">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{contextualMessage}</span>
          </div>
        )}

        {/* Auth Mode Toggle Bar */}
        <div className="flex-shrink-0 bg-slate-950/60 border-b border-slate-800 p-1.5 flex items-center justify-center space-x-2">
          <button
            onClick={() => {
              setAuthMode('login');
              setLoginError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              authMode === 'login'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In (Existing Buyer)</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('signup');
              setSignupError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              authMode === 'signup'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account (New Student)</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <div className="space-y-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    College Email or Student Roll Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. rahul.sharma@iitb.ac.in or 210040089"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-blue-600" />
                    <span>Keep me signed in</span>
                  </label>
                  <span className="text-blue-400 hover:underline cursor-pointer">Forgot Password?</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>LOG IN TO BUYER ACCOUNT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* SIGN UP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {signupError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold">
                  {signupError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Student Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sairaj Achari"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">College Email (.edu / .ac.in) *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="student@college.ac.in"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">WhatsApp / Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">College / University Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="IIT Bombay, BITS Pilani, etc."
                      value={signupCollege}
                      onChange={(e) => setSignupCollege(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Department / Branch</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Electronics, CS, Robotics"
                      value={signupDept}
                      onChange={(e) => setSignupDept(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Roll Number / Year</label>
                  <div className="relative">
                    <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. 210040089 (3rd Year)"
                      value={signupRoll}
                      onChange={(e) => setSignupRoll(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold text-xs mb-1">
                  Hostel / Campus Room Address (For Direct Component Delivery)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Hostel 14, Room 208, Main Campus"
                    value={signupAddress}
                    onChange={(e) => setSignupAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold text-xs mb-1">Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center space-x-2 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Creating an account automatically grants you verified <strong>10% student discount</strong> on hardware components!</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>CREATE BUYER ACCOUNT & LOG IN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Perks Summary Section */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <span className="font-bold text-slate-300 uppercase text-[10px] tracking-wider block">
              Why Create a Student Buyer Account?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
              <div className="flex items-center space-x-2">
                <Tag className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Automatic 10% College Discount</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Direct Hostel Room Handoff</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Order History & WhatsApp Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Saved BOM Hardware Watchlists</span>
              </div>
            </div>
          </div>

          {/* Optional Guest Action */}
          {onContinueAsGuest && (
            <div className="text-center pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-slate-400 hover:text-white text-xs underline font-medium transition-colors"
              >
                Continue as Guest for this order only →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
