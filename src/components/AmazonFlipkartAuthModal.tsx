import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import {
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  User,
  Building,
  GraduationCap,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  KeyRound,
  Shield,
  HelpCircle
} from 'lucide-react';
import {
  checkIdentifier,
  sendAuthOtp,
  verifyAuthOtp,
  loginWithPassword,
  registerNewUser,
  resetUserPassword,
  CheckIdentifierResult
} from '../lib/authApi';
import { getUserFromFirestore, saveUserToFirestore } from '../lib/firebase';

export type AuthModalStep =
  | 'IDENTIFIER'
  | 'PASSWORD_LOGIN'
  | 'CREATE_ACCOUNT'
  | 'OTP_VERIFY'
  | 'ADDRESS_SETUP'
  | 'FORGOT_PASSWORD'
  | 'RESET_PASSWORD';

interface AmazonFlipkartAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLoginSuccess: (updatedProfile: UserProfile) => void;
  contextualMessage?: string;
  onContinueAsGuest?: () => void;
  initialIdentifier?: string;
  initialRole?: 'student' | 'owner';
}

export const AmazonFlipkartAuthModal: React.FC<AmazonFlipkartAuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLoginSuccess,
  contextualMessage,
  onContinueAsGuest,
  initialIdentifier = '',
  initialRole = 'student',
}) => {
  // Step state
  const [step, setStep] = useState<AuthModalStep>('IDENTIFIER');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Primary Identifiers
  const [identifier, setIdentifier] = useState<string>(initialIdentifier || userProfile?.email || userProfile?.phone || '');
  const [identifierInfo, setIdentifierInfo] = useState<CheckIdentifierResult | null>(null);

  // Password & Security
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpPreview, setOtpPreview] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [otpPurpose, setOtpPurpose] = useState<'login' | 'register' | 'forgot_password'>('login');
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Registration & Address Details (Amazon / Flipkart standard format)
  const [fullName, setFullName] = useState<string>(userProfile?.name && userProfile.name !== 'Guest Visitor' ? userProfile.name : '');
  const [regPhone, setRegPhone] = useState<string>(userProfile?.phone || '');
  const [regEmail, setRegEmail] = useState<string>(userProfile?.email || '');
  const [alternatePhone, setAlternatePhone] = useState<string>(userProfile?.alternatePhone || '');
  const [collegeName, setCollegeName] = useState<string>(userProfile?.collegeName || '');
  const [department, setDepartment] = useState<string>(userProfile?.department || '');
  const [yearOrRollNo, setYearOrRollNo] = useState<string>(userProfile?.yearOrRollNo || '');
  const [hostelAddress, setHostelAddress] = useState<string>(userProfile?.hostelAddress || '');
  const [city, setCity] = useState<string>(userProfile?.city || '');
  const [stateName, setStateName] = useState<string>(userProfile?.state || '');
  const [pinCode, setPinCode] = useState<string>(userProfile?.pinCode || '');
  const [landmark, setLandmark] = useState<string>(userProfile?.landmark || '');
  const [addressType, setAddressType] = useState<'Hostel / Campus' | 'Home' | 'Lab / College'>('Hostel / Campus');

  // UI Accordions
  const [showHelpDropdown, setShowHelpDropdown] = useState<boolean>(false);
  const [keepSignedIn, setKeepSignedIn] = useState<boolean>(true);

  // Sync initial identifier if provided
  useEffect(() => {
    if (initialIdentifier) {
      setIdentifier(initialIdentifier);
    }
  }, [initialIdentifier]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Helper to append quick domain chip to email
  const handleApplyDomainChip = (domain: string) => {
    const clean = identifier.trim();
    if (!clean) {
      setIdentifier(domain);
      return;
    }
    if (clean.includes('@')) {
      const prefix = clean.split('@')[0];
      setIdentifier(`${prefix}${domain}`);
    } else {
      setIdentifier(`${clean}${domain}`);
    }
  };

  // -------------------------------------------------------------
  // STEP 1: Check Identifier & Route to Password or Create Account
  // -------------------------------------------------------------
  const handleContinueIdentifier = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    let cleanInput = identifier.trim().toLowerCase();
    if (!cleanInput) {
      setErrorMsg('Please enter your email address (e.g. name@gmail.com or student@college.edu)');
      return;
    }

    // Auto-fix if user typed without domain but clicked continue (e.g., student name)
    if (!cleanInput.includes('@') && !/^\d{10}$/.test(cleanInput)) {
      cleanInput = `${cleanInput}@gmail.com`;
      setIdentifier(cleanInput);
    }

    setIsLoading(true);

    try {
      const result = await checkIdentifier(cleanInput);
      setIdentifierInfo(result);

      if (!result.success && result.error) {
        setErrorMsg(result.error);
        setIsLoading(false);
        return;
      }

      // Check if user exists in Firestore
      const firestoreUser = await getUserFromFirestore(result.cleanIdentifier);
      if (firestoreUser) {
        if (firestoreUser.name) setFullName(firestoreUser.name);
        if (firestoreUser.phone) setRegPhone(firestoreUser.phone);
        if (firestoreUser.email) setRegEmail(firestoreUser.email);
        if (firestoreUser.collegeName) setCollegeName(firestoreUser.collegeName);
        if (firestoreUser.department) setDepartment(firestoreUser.department);
        if (firestoreUser.yearOrRollNo) setYearOrRollNo(firestoreUser.yearOrRollNo);
        if (firestoreUser.hostelAddress) setHostelAddress(firestoreUser.hostelAddress);
        if (firestoreUser.city) setCity(firestoreUser.city);
        if (firestoreUser.state) setStateName(firestoreUser.state);
        if (firestoreUser.pinCode) setPinCode(firestoreUser.pinCode);
        if (firestoreUser.landmark) setLandmark(firestoreUser.landmark);
      }

      if (result.exists || firestoreUser) {
        // Existing user -> Password login screen (or OTP toggle)
        setStep('PASSWORD_LOGIN');
      } else {
        // New user -> Create Account screen
        setRegEmail(result.cleanIdentifier);
        setStep('CREATE_ACCOUNT');
      }
    } catch (err: any) {
      console.error('Identifier check error:', err);
      // Fallback
      setRegEmail(cleanInput);
      setStep('CREATE_ACCOUNT');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // STEP 2A: Password Login
  // -------------------------------------------------------------
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password) {
      setErrorMsg('Enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginWithPassword(identifier, password);
      if (res.success && res.user) {
        onLoginSuccess({
          ...res.user,
          isLoggedIn: true,
        });
        onClose();
      } else {
        setErrorMsg(res.error || 'Incorrect password. You can also sign in with an OTP.');
      }
    } catch (err) {
      setErrorMsg('Sign in failed. Please try with OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // STEP 2B: Switch to OTP Login Flow (Amazon / Flipkart "Sign in with OTP")
  // -------------------------------------------------------------
  const handleRequestOtpLogin = async () => {
    setErrorMsg('');
    setIsLoading(true);
    setOtpPurpose('login');

    try {
      const res = await sendAuthOtp(identifier, 'login');
      if (res.success) {
        setOtpPreview(res.otpPreview || '');
        setResendCooldown(res.resendCooldown || 60);
        setOtpDigits(['', '', '', '', '', '']);
        setStep('OTP_VERIFY');
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        setErrorMsg(res.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setErrorMsg('Failed to send verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // STEP 3: Create Account & Dispatch OTP
  // -------------------------------------------------------------
  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Enter your name');
      return;
    }

    if (!regPhone.trim() && !regEmail.trim()) {
      setErrorMsg('Enter a valid mobile number or email address');
      return;
    }

    if (password && password.length < 6) {
      setErrorMsg('Passwords must be at least 6 characters');
      return;
    }

    const primaryTarget = regEmail.trim() || regPhone.trim();
    setIsLoading(true);
    setOtpPurpose('register');

    try {
      const res = await sendAuthOtp(primaryTarget, 'register');
      if (res.success) {
        setOtpPreview(res.otpPreview || '');
        setResendCooldown(res.resendCooldown || 60);
        setOtpDigits(['', '', '', '', '', '']);
        setStep('OTP_VERIFY');
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        setErrorMsg(res.error || 'Failed to dispatch verification code.');
      }
    } catch (err) {
      setErrorMsg('Failed to send OTP verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // OTP Verification Handling (6-Digit Auto Jump & Paste Support)
  // -------------------------------------------------------------
  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (clean.length > 1) {
      // Paste event detected
      const chars = clean.slice(0, 6).split('');
      chars.forEach((c, i) => {
        if (i < 6) newDigits[i] = c;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(chars.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = clean;
    setOtpDigits(newDigits);

    // Auto advance to next box
    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const chars = pasted.split('');
      const newDigits = ['', '', '', '', '', ''];
      chars.forEach((c, i) => {
        if (i < 6) newDigits[i] = c;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(chars.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerifyOtpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const fullOtp = otpDigits.join('').trim();
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    const targetIdentifier = regEmail.trim() || regPhone.trim() || identifier.trim();
    setIsLoading(true);

    try {
      const res = await verifyAuthOtp(targetIdentifier, fullOtp, otpPurpose);
      if (!res.success) {
        setErrorMsg(res.error || 'Incorrect verification code. Please check and retry.');
        setIsLoading(false);
        return;
      }

      if (otpPurpose === 'forgot_password') {
        setStep('RESET_PASSWORD');
        setIsLoading(false);
        return;
      }

      if (otpPurpose === 'register' || !res.user?.hostelAddress) {
        // Route to address / college delivery details setup
        setStep('ADDRESS_SETUP');
        setIsLoading(false);
        return;
      }

      // Existing verified user
      if (res.user) {
        onLoginSuccess({
          ...res.user,
          isLoggedIn: true,
        });
        onClose();
      } else {
        setStep('ADDRESS_SETUP');
      }
    } catch (err) {
      setErrorMsg('Verification failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // STEP 4: Complete Registration & Save Address Book
  // -------------------------------------------------------------
  const handleSaveAddressAndFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    if (!regPhone.trim()) {
      setErrorMsg('Please enter a 10-digit mobile number for delivery handoff');
      return;
    }

    if (!hostelAddress.trim()) {
      setErrorMsg('Please enter your delivery address (Hostel Room / Flat / Street)');
      return;
    }

    setIsLoading(true);

    const emailToUse = (regEmail.trim() || identifier.trim()).toLowerCase();
    const phoneToUse = regPhone.trim() || identifier.trim();

    const formattedAddress = `${hostelAddress.trim()}${landmark.trim() ? `, Near ${landmark.trim()}` : ''}${city.trim() ? `, ${city.trim()}` : ''}${stateName.trim() ? `, ${stateName.trim()}` : ''}${pinCode.trim() ? ` - ${pinCode.trim()}` : ''}`;

    const profileData: UserProfile = {
      id: userProfile?.id && userProfile.id !== 'usr-guest' ? userProfile.id : `usr-${Date.now()}`,
      name: fullName.trim(),
      email: emailToUse,
      emailVerified: true,
      phone: phoneToUse,
      alternatePhone: alternatePhone.trim() || undefined,
      collegeName: collegeName.trim() || 'College Campus',
      department: department.trim() || 'Electronics & Electrical Engg',
      yearOrRollNo: yearOrRollNo.trim() || 'Student Buyer',
      hostelAddress: hostelAddress.trim(),
      city: city.trim() || undefined,
      state: stateName.trim() || undefined,
      pinCode: pinCode.trim() || undefined,
      landmark: landmark.trim() || undefined,
      isLoggedIn: true,
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          label: `${addressType} (${fullName.trim()})`,
          address: formattedAddress,
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await registerNewUser({ ...profileData, password });
      await saveUserToFirestore(profileData);
      onLoginSuccess(profileData);
      onClose();
    } catch (err: any) {
      console.error('Save address error:', err);
      onLoginSuccess(profileData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // FORGOT PASSWORD / PASSWORD ASSISTANCE FLOW
  // -------------------------------------------------------------
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Enter your email or mobile phone number');
      return;
    }

    setIsLoading(true);
    setOtpPurpose('forgot_password');

    try {
      const res = await sendAuthOtp(identifier.trim(), 'forgot_password');
      if (res.success) {
        setOtpPreview(res.otpPreview || '');
        setResendCooldown(res.resendCooldown || 60);
        setOtpDigits(['', '', '', '', '', '']);
        setStep('OTP_VERIFY');
      } else {
        setErrorMsg(res.error || 'Failed to dispatch reset code.');
      }
    } catch (err) {
      setErrorMsg('Failed to initiate password assistance.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Passwords must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetUserPassword(identifier.trim(), newPassword);
      if (res.success) {
        setSuccessMsg('Your password has been changed successfully! Please sign in.');
        setPassword(newPassword);
        setStep('PASSWORD_LOGIN');
      } else {
        setErrorMsg(res.error || 'Failed to update password.');
      }
    } catch (err) {
      setErrorMsg('Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-300 rounded-xl shadow-2xl overflow-hidden my-auto text-slate-900 flex flex-col">
        
        {/* Top Amazon / Flipkart Style Branding Header */}
        <div className="flex-shrink-0 bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center font-black text-slate-950 text-base shadow-sm">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block leading-tight">
                INCEPTION<span className="text-amber-400">.STORE</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Campus Hardware & Robotics
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contextual Action Notification Banner */}
        {contextualMessage && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center space-x-2 text-xs text-blue-900 font-medium">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{contextualMessage}</span>
          </div>
        )}

        {/* Modal Inner Container */}
        <div className="p-6 sm:p-7 space-y-4">
          
          {/* Error Message Box (Amazon-style Alert) */}
          {errorMsg && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 text-xs flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-xs">There was a problem</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-950 text-xs flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-slate-800 text-[11px] leading-relaxed font-medium">{successMsg}</p>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 1: IDENTIFIER (Email-First Entry Screen)              */}
          {/* ========================================================= */}
          {step === 'IDENTIFIER' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Sign in with Email</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your student or personal email to access orders, cart, and campus discounts
                </p>
              </div>

              <form onSubmit={handleContinueIdentifier} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. rahul@gmail.com or student@iitb.ac.in"
                      autoFocus
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-900 shadow-inner"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Quick Domain Completion Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-semibold text-slate-500">Quick add:</span>
                    {['@gmail.com', '@iitb.ac.in', '@nit.ac.in', '@edu.in', '@outlook.com'].map((domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => handleApplyDomainChip(domain)}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-300 transition-all cursor-pointer text-slate-700"
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <span>Continue with Email</span>
                  )}
                </button>
              </form>

              {/* Conditions of Use */}
              <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                By continuing, you agree to Inception's{' '}
                <a href="#terms" className="text-blue-700 hover:underline">Conditions of Use</a> and{' '}
                <a href="#privacy" className="text-blue-700 hover:underline">Privacy Notice</a>.
              </p>

              {/* Need help? Dropdown */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowHelpDropdown(!showHelpDropdown)}
                  className="text-xs text-blue-700 hover:text-amber-800 hover:underline flex items-center space-x-1 font-medium"
                >
                  <span>Need help?</span>
                  {showHelpDropdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showHelpDropdown && (
                  <div className="mt-2 pl-2 space-y-1.5 text-xs text-blue-700">
                    <div>
                      <button
                        type="button"
                        onClick={() => setStep('FORGOT_PASSWORD')}
                        className="hover:underline hover:text-amber-800"
                      >
                        Forgot your password?
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleRequestOtpLogin()}
                        className="hover:underline hover:text-amber-800"
                      >
                        Sign in with 6-digit Email OTP directly
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Amazon Style New to Inception Divider */}
              <div className="pt-4 border-t border-slate-200 space-y-3 text-center">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                  New to Inception?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (identifier.includes('@')) {
                      setRegEmail(identifier);
                    }
                    setStep('CREATE_ACCOUNT');
                  }}
                  className="w-full py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-lg shadow-xs transition-all"
                >
                  Create your Inception account with Email
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: PASSWORD SIGN IN (Amazon Sign-in Screen)           */}
          {/* ========================================================= */}
          {step === 'PASSWORD_LOGIN' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Sign in</h1>
                <div className="flex items-center space-x-2 mt-1 text-xs text-slate-700">
                  <span className="font-semibold">{identifier}</span>
                  <button
                    type="button"
                    onClick={() => setStep('IDENTIFIER')}
                    className="text-blue-700 hover:underline font-bold"
                  >
                    Change
                  </button>
                </div>
              </div>

              <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800">Password</label>
                    <button
                      type="button"
                      onClick={() => setStep('FORGOT_PASSWORD')}
                      className="text-[11px] text-blue-700 hover:underline font-medium"
                    >
                      Forgot your password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoFocus
                      required
                      className="w-full px-3 py-2 pr-10 text-sm bg-white border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="keepSignedIn"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-400"
                  />
                  <label htmlFor="keepSignedIn" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Keep me signed in
                  </label>
                </div>
              </form>

              {/* Amazon Signature Dual Auth: "Get an OTP on your email" */}
              <div className="pt-3 border-t border-slate-200 space-y-2 text-center">
                <span className="text-xs text-slate-500 block">or sign in without password</span>
                <button
                  type="button"
                  onClick={handleRequestOtpLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Get a 6-digit OTP on your email</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: CREATE ACCOUNT (Email-First Registration)          */}
          {/* ========================================================= */}
          {step === 'CREATE_ACCOUNT' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign up with email for campus hardware delivery and order tracking
                </p>
              </div>

              <form onSubmit={handleCreateAccountSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Your full name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="First and last name"
                    autoFocus
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Email address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. rahul@gmail.com or student@iitb.ac.in"
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 shadow-inner"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      className="w-full px-3 py-2 pr-10 text-sm bg-white border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    🔒 Passwords must be at least 6 characters.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Mobile number (Optional, for delivery notifications)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs font-bold bg-slate-100 border border-r-0 border-slate-400 rounded-l-md text-slate-700">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-400 rounded-r-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 shadow-inner"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px]">
                  We will send a 6-digit verification code to your email to verify your account.
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <span>Verify Email with OTP</span>
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-slate-200 text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setStep('IDENTIFIER')}
                  className="text-blue-700 hover:underline font-bold"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: 6-DIGIT OTP VERIFICATION SCREEN                   */}
          {/* ========================================================= */}
          {step === 'OTP_VERIFY' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Two-Step Verification
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  For your security, we've sent the One Time Password (OTP) to your email:{' '}
                  <span className="font-bold text-slate-900">{regEmail || identifier || regPhone}</span>{' '}
                  <button
                    type="button"
                    onClick={() => setStep('IDENTIFIER')}
                    className="text-blue-700 hover:underline text-[11px] font-bold"
                  >
                    (Change)
                  </button>
                </p>
              </div>

              {/* OTP Preview Badge (Transparent for Testing) */}
              {otpPreview && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-between text-xs text-amber-950 font-medium">
                  <span>Verification Code (Preview):</span>
                  <span className="font-mono font-bold tracking-widest text-sm bg-white px-2 py-0.5 rounded border border-amber-400">
                    {otpPreview}
                  </span>
                </div>
              )}

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Enter 6-digit OTP
                  </label>
                  
                  {/* 6 Discrete Input Boxes */}
                  <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={idx === 0 ? handleOtpPaste : undefined}
                        className="w-full h-12 text-center text-lg sm:text-xl font-bold font-mono bg-white border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-950 shadow-xs transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <span>Verify & Continue</span>
                  )}
                </button>
              </form>

              {/* Resend OTP countdown */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                <span className="text-slate-500">Didn't receive the code?</span>
                {resendCooldown > 0 ? (
                  <span className="text-slate-500 font-medium">Resend OTP in {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRequestOtpLogin()}
                    className="text-blue-700 hover:underline font-bold"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: ADDRESS & CAMPUS DETAILS SETUP                     */}
          {/* ========================================================= */}
          {step === 'ADDRESS_SETUP' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Add Delivery Address
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete your profile for express campus delivery & order tracking
                </p>
              </div>

              <form onSubmit={handleSaveAddressAndFinish} className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Primary Mobile *</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile"
                      required
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Alternate Phone (Hostel)</label>
                    <input
                      type="tel"
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value)}
                      placeholder="Emergency contact"
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">College / Institute *</label>
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. IIT Bombay"
                      required
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Electrical Engg"
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Roll No / Year</label>
                    <input
                      type="text"
                      value={yearOrRollNo}
                      onChange={(e) => setYearOrRollNo(e.target.value)}
                      placeholder="e.g. 210040089 (3rd Year)"
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Flat, Hostel & Room No, Building, Street *
                  </label>
                  <input
                    type="text"
                    value={hostelAddress}
                    onChange={(e) => setHostelAddress(e.target.value)}
                    placeholder="e.g. Hostel 14, Room 208, Campus"
                    required
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Town/City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">State</label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="400076"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Address Type</label>
                  <div className="flex space-x-2">
                    {(['Hostel / Campus', 'Home', 'Lab / College'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAddressType(type)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md border transition-all ${
                          addressType === type
                            ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <span>Use this address & Complete Sign In</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 6: PASSWORD ASSISTANCE (Forgot Password)              */}
          {/* ========================================================= */}
          {step === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Password assistance
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Enter your registered email address to receive a secure password reset code.
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. rahul@gmail.com or student@iitb.ac.in"
                      autoFocus
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 shadow-inner"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <span>Send Password Reset Code</span>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setStep('IDENTIFIER')}
                  className="text-blue-700 hover:underline font-bold"
                >
                  Back to Sign in
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 7: RESET PASSWORD (Set New Password)                  */}
          {/* ========================================================= */}
          {step === 'RESET_PASSWORD' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Create new password
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  We'll ask for this password whenever you sign in.
                </p>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Passwords must be at least 6 characters.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Re-enter password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <span>Save changes and Sign In</span>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Security & Encryption Trust Footer (Amazon / Flipkart standard) */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-Bit SSL Encryption</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-700">Verified Campus Store</span>
          </div>
        </div>

      </div>
    </div>
  );
};
