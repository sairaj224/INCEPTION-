import React, { useState } from 'react';
import { UserProfile, PlacedOrder } from '../types';
import { X, User, Phone, Mail, Building, GraduationCap, MapPin, Key, CheckCircle2, ShoppingBag, LogOut, Lock, Edit3, Ban, HelpCircle, AlertTriangle, ArrowRight, Heart, Upload, Image as ImageIcon } from 'lucide-react';
import { validateAndProcessFileUpload } from '../lib/fileUpload';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  studentOrders: PlacedOrder[];
  userRole: 'student' | 'owner';
  setUserRole: (role: 'student' | 'owner') => void;
  onOpenAdminInventory: () => void;
  onCancelOrder?: (orderId: string, reason?: string) => void;
  onOpenSupport?: (orderId?: string) => void;
  onOpenWatchlist?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  studentOrders = [],
  userRole,
  setUserRole,
  onOpenAdminInventory,
  onCancelOrder,
  onOpenSupport,
  onOpenWatchlist,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'auth'>('profile');
  const [loginRoleTab, setLoginRoleTab] = useState<'student' | 'owner'>(userRole);

  // Cancellation State
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [selectedCancelReason, setSelectedCancelReason] = useState<string>('Ordered wrong component / duplicate');
  const [customCancelReason, setCustomCancelReason] = useState<string>('');

  // Status Filter for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  
  // Auth Form State
  const [isRegistering, setIsRegistering] = useState<boolean>(!userProfile.isLoggedIn);
  const [authName, setAuthName] = useState<string>(userProfile.name || '');
  const [authEmail, setAuthEmail] = useState<string>(userProfile.email || '');
  const [authPhone, setAuthPhone] = useState<string>(userProfile.phone || '');
  const [authPassword, setAuthPassword] = useState<string>('');
  
  // Profile Editable State
  const [avatarUrl, setAvatarUrl] = useState<string>(userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
  const [collegeName, setCollegeName] = useState<string>(userProfile.collegeName || 'IIT Bombay');
  const [department, setDepartment] = useState<string>(userProfile.department || 'Electronics & Electrical Engg');
  const [yearOrRollNo, setYearOrRollNo] = useState<string>(userProfile.yearOrRollNo || '210040089 (3rd Year)');
  const [hostelAddress, setHostelAddress] = useState<string>(userProfile.hostelAddress || 'Hostel 14, Room 208, Campus');

  // Saved Addresses State
  const [savedAddressesList, setSavedAddressesList] = useState<any[]>(userProfile.savedAddresses || [
    { id: 'addr-1', label: 'Hostel 14, Room 208', address: 'Hostel 14, Room 208, IIT Campus' },
    { id: 'addr-2', label: 'Robotics Hardware Lab 3', address: 'Robotics & Automation Lab, ECE Dept, Building B' },
  ]);
  const [newAddrLabel, setNewAddrLabel] = useState<string>('');
  const [newAddrText, setNewAddrText] = useState<string>('');

  // Return/Refund Request State
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState<string>('Defective or non-functional pin header');
  const [returnNotes, setReturnNotes] = useState<string>('');
  const [returnSuccess, setReturnSuccess] = useState<boolean>(false);

  React.useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setAuthName(userProfile.name);
      if (userProfile.email) setAuthEmail(userProfile.email);
      if (userProfile.phone) setAuthPhone(userProfile.phone);
      if (userProfile.collegeName) setCollegeName(userProfile.collegeName);
      if (userProfile.department) setDepartment(userProfile.department);
      if (userProfile.yearOrRollNo) setYearOrRollNo(userProfile.yearOrRollNo);
      if (userProfile.hostelAddress) setHostelAddress(userProfile.hostelAddress);
      if (userProfile.avatarUrl) setAvatarUrl(userProfile.avatarUrl);
      if (userProfile.savedAddresses && userProfile.savedAddresses.length > 0) {
        setSavedAddressesList(userProfile.savedAddresses);
      }
    }
  }, [userProfile]);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel.trim() || !newAddrText.trim()) return;
    const newEntry = {
      id: 'addr-' + Date.now(),
      label: newAddrLabel.trim(),
      address: newAddrText.trim(),
    };
    const updated = [...savedAddressesList, newEntry];
    setSavedAddressesList(updated);
    setNewAddrLabel('');
    setNewAddrText('');
    onUpdateProfile({
      ...userProfile,
      savedAddresses: updated,
    });
  };

  const handleRemoveAddress = (id: string) => {
    const updated = savedAddressesList.filter((a) => a.id !== id);
    setSavedAddressesList(updated);
    onUpdateProfile({
      ...userProfile,
      savedAddresses: updated,
    });
  };

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name: authName || userProfile.name,
      email: authEmail || userProfile.email,
      phone: authPhone || userProfile.phone,
      collegeName,
      department,
      yearOrRollNo,
      hostelAddress,
      isLoggedIn: true,
    });
    setActiveTab('profile');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(loginRoleTab);
    onUpdateProfile({
      ...userProfile,
      name: authName || (loginRoleTab === 'owner' ? 'Campus Store Owner' : 'Student Buyer'),
      email: authEmail || (loginRoleTab === 'owner' ? 'owner@collegestore.edu' : 'student@college.edu'),
      phone: authPhone || '+91 98765 43210',
      collegeName: collegeName || (loginRoleTab === 'owner' ? 'Campus Electronics Store' : 'IIT Bombay'),
      department: department || (loginRoleTab === 'owner' ? 'Store & Component Admin' : 'Electronics & Telecommunication'),
      yearOrRollNo: yearOrRollNo || (loginRoleTab === 'owner' ? 'STORE-OWNER-ADMIN' : '2024-ENG-042'),
      hostelAddress: hostelAddress || (loginRoleTab === 'owner' ? 'Student Activity Centre - Shop 4' : 'Hostel Block B, Room 104'),
      isLoggedIn: true,
    });
    setActiveTab('profile');
  };

  const handleLogout = () => {
    onUpdateProfile({
      ...userProfile,
      isLoggedIn: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-800 flex flex-col">
        
        {/* Modal Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl border ${
              userRole === 'owner' ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
            }`}>
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {userProfile.isLoggedIn ? userProfile.name : 'Account & Trial Login'}
                </h2>
                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider ${
                  userRole === 'owner' ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
                }`}>
                  {userRole === 'owner' ? 'Store Owner' : 'Student Buyer'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                {userProfile.isLoggedIn
                  ? `Logged in as ${userRole === 'owner' ? 'Store Owner / Price Admin' : 'Student Buyer'}`
                  : 'Log in or test trial access with custom or sample account data'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex-shrink-0 flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2.5 space-x-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 px-2.5 sm:px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Account Info</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 px-2.5 sm:px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Component Orders ({studentOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`pb-2 px-2.5 sm:px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'auth'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Login with Custom Credentials</span>
          </button>

          {onOpenWatchlist && (
            <button
              onClick={() => {
                onClose();
                onOpenWatchlist();
              }}
              className="pb-2 px-2.5 sm:px-3 border-b-2 border-transparent text-rose-600 hover:text-rose-700 font-semibold transition-all flex items-center space-x-1.5 whitespace-nowrap ml-auto"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              <span>Open Watchlist</span>
            </button>
          )}
        </div>

        {/* Tab Content (Scrollable Body) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-6 text-xs">
          
          {/* PROFILE & COLLEGE DETAILS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Buyer Identity Status</span>
                  <span className="text-slate-600">
                    {userProfile.isLoggedIn
                      ? 'Logged in as active college buyer'
                      : 'Not logged in. Fill profile below to complete orders smoothly.'}
                  </span>
                </div>
                {userProfile.isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg flex items-center space-x-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@iitb.ac.in"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phone / WhatsApp Number (Required for Order Confirmation) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>College Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. Indian Institute of Technology Bombay"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Department / Major *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Electronics & Electrical Engineering"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Year / Roll Number *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={yearOrRollNo}
                    onChange={(e) => setYearOrRollNo(e.target.value)}
                    placeholder="e.g. 210040089 (3rd Year B.Tech)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Hostel / Campus Pick-up Address *</span>
                </label>
                <input
                  type="text"
                  required
                  value={hostelAddress}
                  onChange={(e) => setHostelAddress(e.target.value)}
                  placeholder="e.g. Hostel 14, Room 208, Main Campus OR ECE Hardware Lab 2"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Saved Addresses Manager */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>My Saved Campus Addresses ({savedAddressesList.length})</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {savedAddressesList.map((addr) => (
                    <div key={addr.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <span className="font-bold text-slate-900 block text-xs truncate">📍 {addr.label}</span>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{addr.address}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddress(addr.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 text-[10px] font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Address Form */}
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                  <span className="font-bold text-slate-900 block text-[11px]">Add New Saved Address</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Hostel 9 Room 102)"
                      value={newAddrLabel}
                      onChange={(e) => setNewAddrLabel(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Full Address / Building / Gate"
                      value={newAddrText}
                      onChange={(e) => setNewAddrText(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors"
                  >
                    + Add Saved Address
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile & Buyer Info</span>
                </button>
              </div>
            </form>
          )}

          {/* MY COMPONENT ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Order Status Filters */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                {['All', 'Pending Confirmation', 'Confirmed', 'Dispatched', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold border transition-all whitespace-nowrap ${
                      orderStatusFilter === st
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st === 'All' ? 'All Orders' : st}
                  </button>
                ))}
              </div>

              {studentOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2 bg-slate-50 border border-slate-200 rounded-2xl">
                  <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-slate-600 font-semibold">No component orders found.</p>
                  <p className="text-slate-400 text-[11px]">When you place orders from the marketplace, they will appear here with live tracking & cancellation options.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentOrders
                    .filter((ord) => orderStatusFilter === 'All' || ord.status === orderStatusFilter)
                    .map((ord) => {
                      const canCancel = ord.status === 'Pending Confirmation' || ord.status === 'Confirmed';
                      const isCancelling = cancellingOrderId === ord.orderId;

                      return (
                        <div key={ord.orderId} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5 shadow-sm">
                          
                          {/* Top ID & Amazon/Flipkart Status Badge */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/80 pb-3">
                            <div>
                              <div className="font-mono font-bold text-slate-900 text-sm flex items-center space-x-2">
                                <span>Order ID:</span>
                                <span className="text-blue-600 font-bold">{ord.orderId}</span>
                              </div>
                              <div className="text-[11px] text-slate-500">Placed on: {ord.createdAt}</div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                                  ord.status === 'Pending Confirmation'
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : ord.status === 'Confirmed'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : ord.status === 'Dispatched'
                                    ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                    : ord.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border-rose-300'
                                }`}
                              >
                                {ord.status === 'Cancelled' ? '❌ Cancelled' : ord.status}
                              </span>
                            </div>
                          </div>

                          {/* Amazon / Flipkart Style Live Order Tracking Timeline */}
                          {ord.status !== 'Cancelled' && (
                            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                LIVE ORDER TRACKING
                              </span>
                              <div className="relative flex items-center justify-between text-[11px] font-bold">
                                {/* Timeline connecting line */}
                                <div className="absolute top-3 left-4 right-4 h-1 bg-slate-200 -z-0">
                                  <div
                                    className="h-full bg-blue-600 transition-all duration-500"
                                    style={{
                                      width:
                                        ord.status === 'Pending Confirmation'
                                          ? '15%'
                                          : ord.status === 'Confirmed'
                                          ? '45%'
                                          : ord.status === 'Dispatched'
                                          ? '75%'
                                          : '100%',
                                    }}
                                  />
                                </div>

                                {[
                                  { label: 'Placed', statusKey: 'Pending Confirmation' },
                                  { label: 'Confirmed', statusKey: 'Confirmed' },
                                  { label: 'Dispatched', statusKey: 'Dispatched' },
                                  { label: 'Delivered', statusKey: 'Completed' },
                                ].map((stStep, sIdx) => {
                                  const statusMap = ['Pending Confirmation', 'Confirmed', 'Dispatched', 'Completed'];
                                  const currentIdx = statusMap.indexOf(ord.status);
                                  const stepPassed = currentIdx >= sIdx;
                                  return (
                                    <div key={stStep.label} className="relative z-10 flex flex-col items-center">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 transition-all ${
                                          stepPassed
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                            : 'bg-white text-slate-400 border-slate-300'
                                        }`}
                                      >
                                        {stepPassed ? '✓' : sIdx + 1}
                                      </div>
                                      <span className={`mt-1 text-[10px] whitespace-nowrap ${stepPassed ? 'text-blue-900 font-extrabold' : 'text-slate-400'}`}>
                                        {stStep.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Items Breakdown */}
                          <div className="bg-white border border-slate-200/80 rounded-xl p-3 space-y-2">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              Components Ordered ({ord.items.length})
                            </div>
                            <div className="divide-y divide-slate-100">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="py-2 flex items-center justify-between gap-3 text-slate-800 text-xs">
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    {it.image && (
                                      <img
                                        src={it.image}
                                        alt={it.productName}
                                        className="w-9 h-9 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                    <span className="font-semibold truncate">{it.productName}</span>
                                    <span className="text-slate-500 text-[11px]">x{it.quantity}</span>
                                  </div>
                                  <span className="font-mono font-bold text-slate-900">₹{it.price * it.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Cost & Payment Details */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1 font-bold text-slate-900 text-xs">
                            <div className="text-slate-600 text-[11px]">
                              Payment: <span className="font-semibold text-slate-800">{ord.paymentMethod}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>Total Amount:</span>
                              <span className="font-mono text-blue-600 text-base font-bold">₹{ord.grandTotal}</span>
                            </div>
                          </div>

                          {/* Store Owner Notes or Cancellation Note */}
                          {ord.ownerNotes && (
                            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                              <strong>Store Owner Note:</strong> {ord.ownerNotes}
                            </div>
                          )}

                          {ord.cancellationReason && (
                            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-[11px]">
                              <strong>Cancellation Reason ({ord.cancelledBy === 'student' ? 'By Student' : 'By Store Owner'}):</strong> {ord.cancellationReason}
                            </div>
                          )}

                          {/* Order Action Buttons (Cancel, Return, Support) */}
                          <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                            {onOpenSupport && (
                              <button
                                type="button"
                                onClick={() => onOpenSupport(ord.orderId)}
                                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                              >
                                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                                <span>Need Help / Support</span>
                              </button>
                            )}

                            {ord.status === 'Completed' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setReturnOrderId(ord.orderId);
                                  setReturnSuccess(false);
                                }}
                                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-300 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                              >
                                <span>🔄 Request Return / Replacement</span>
                              </button>
                            )}

                            {canCancel && onCancelOrder && (
                              <button
                                type="button"
                                onClick={() => setCancellingOrderId(isCancelling ? null : ord.orderId)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 rounded-xl text-xs flex items-center space-x-1.5 transition-all ml-auto"
                              >
                                <Ban className="w-3.5 h-3.5 text-rose-600" />
                                <span>Cancel Order</span>
                              </button>
                            )}
                          </div>

                          {/* Inline Cancellation Reason Form */}
                          {isCancelling && (
                            <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl space-y-3 mt-2 text-xs">
                              <div className="font-bold text-rose-900 flex items-center space-x-1.5">
                                <AlertTriangle className="w-4 h-4 text-rose-600" />
                                <span>Select Cancellation Reason for Order {ord.orderId}:</span>
                              </div>

                              <select
                                value={selectedCancelReason}
                                onChange={(e) => setSelectedCancelReason(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                              >
                                <option value="Ordered wrong component / duplicate">Ordered wrong component / duplicate</option>
                                <option value="Project scope or requirements changed">Project scope or requirements changed</option>
                                <option value="Found component in college hardware lab">Found component in college hardware lab</option>
                                <option value="Delivery time too long">Delivery time too long</option>
                                <option value="Other">Other Reason...</option>
                              </select>

                              {selectedCancelReason === 'Other' && (
                                <input
                                  type="text"
                                  placeholder="Type your cancellation reason..."
                                  value={customCancelReason}
                                  onChange={(e) => setCustomCancelReason(e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                                />
                              )}

                              <div className="flex justify-end space-x-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setCancellingOrderId(null)}
                                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs"
                                >
                                  Keep Order
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const finalReason = selectedCancelReason === 'Other' ? (customCancelReason || 'Other reason') : selectedCancelReason;
                                    if (onCancelOrder) {
                                      onCancelOrder(ord.orderId, finalReason);
                                    }
                                    setCancellingOrderId(null);
                                  }}
                                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs shadow-sm flex items-center space-x-1"
                                >
                                  <span>Confirm Cancellation</span>
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* AUTH / REGISTER / LOGIN */}
          {activeTab === 'auth' && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Role Toggle for Login */}
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Select Trial Login Account Role:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginRoleTab('student')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      loginRoleTab === 'student'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🎓 Student Buyer Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRoleTab('owner')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      loginRoleTab === 'owner'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🏪 College Store Owner
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">
                  {loginRoleTab === 'owner'
                    ? 'Enter Store Owner Credentials'
                    : isRegistering
                    ? 'Create Student Buyer Account'
                    : 'Student Buyer Sign In'}
                </span>
                <p className="text-slate-500 text-[11px]">
                  {loginRoleTab === 'owner'
                    ? 'Enter authorized store admin email & password for inventory & price editing.'
                    : 'Sign in to access your saved hardware cart, orders, and college delivery.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {loginRoleTab === 'owner' ? 'Store Owner Name *' : 'Student Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder={loginRoleTab === 'owner' ? 'e.g. Vikram Mehta' : 'e.g. Rahul Sharma'}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {loginRoleTab === 'owner' ? 'Store Email Address *' : 'Student Email (.edu) *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder={loginRoleTab === 'owner' ? 'e.g. store@campus-hardware.edu' : 'e.g. rahul@college.edu'}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp / Call Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {loginRoleTab === 'owner' ? 'College Store Name *' : 'College Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder={loginRoleTab === 'owner' ? 'e.g. Campus Hardware & Electronics Hub' : 'e.g. IIT Bombay'}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {loginRoleTab === 'owner' ? 'Role / Department *' : 'Department & Major *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder={loginRoleTab === 'owner' ? 'e.g. Store Owner & Inventory Admin' : 'e.g. Electronics & Electrical Engg'}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {loginRoleTab === 'owner' ? 'Store Location on Campus *' : 'Hostel / Pick-up Address *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={hostelAddress}
                    onChange={(e) => setHostelAddress(e.target.value)}
                    placeholder={loginRoleTab === 'owner' ? 'e.g. Student Activity Centre - Shop 04' : 'e.g. Hostel 14, Room 208'}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Google & Social Login Options */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                  Campus Authentication Options
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
                    </svg>
                    <span>.EDU Domain Verified</span>
                  </div>

                  <div className="w-full py-2 px-3 bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center justify-center space-x-2">
                    <span>🏫 College Roll / ID Verified</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-blue-600 font-semibold hover:underline text-xs"
                >
                  {isRegistering ? 'Already have credentials? Sign In' : 'Need a new profile? Register'}
                </button>

                <button
                  type="submit"
                  className={`px-5 py-2.5 text-white font-bold rounded-lg shadow-sm text-xs ${
                    loginRoleTab === 'owner'
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {loginRoleTab === 'owner' ? 'Log In as Store Owner' : isRegistering ? 'Register as Student' : 'Sign In as Student'}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm"
          >
            Close
          </button>
        </div>

      </div>

      {/* Return / Refund Request Modal Overlay */}
      {returnOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <span>🔄 7-Day Campus Return / Refund Request</span>
              </h3>
              <button
                type="button"
                onClick={() => setReturnOrderId(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {returnSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center text-emerald-900">
                <div className="text-2xl">🎉</div>
                <h4 className="font-bold text-sm">Return Request Submitted!</h4>
                <p className="text-xs text-emerald-800">
                  Your store owner has been notified via WhatsApp & Admin Panel. You can bring the component to SAC Shop 4 or request hostel pickup.
                </p>
                <button
                  onClick={() => setReturnOrderId(null)}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setReturnSuccess(true);
                }}
                className="space-y-3 text-xs"
              >
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                  <span className="font-bold block">Order ID: {returnOrderId}</span>
                  <span className="text-[11px] text-blue-700">Covered under 7-Day Campus Component Guarantee</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reason for Return / Refund *</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Defective or non-functional pin header">Defective or non-functional pin header</option>
                    <option value="Received wrong value / specification">Received wrong value / specification</option>
                    <option value="Damaged during campus delivery">Damaged during campus delivery</option>
                    <option value="Not compatible with microcontroller project">Not compatible with microcontroller project</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Additional Details / Serial Numbers</label>
                  <textarea
                    rows={3}
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="Describe issue or attach multimeter reading notes..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReturnOrderId(null)}
                    className="px-3 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
                  >
                    Submit Return Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
