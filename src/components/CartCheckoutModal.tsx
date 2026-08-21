import React, { useState } from 'react';
import { CartItem, UserProfile, PlacedOrder } from '../types';
import { X, Trash2, CheckCircle2, ArrowRight, Sparkles, Loader2, CreditCard, User, Phone, MapPin, Building, GraduationCap, Banknote, ShieldCheck, Plus, Minus, Tag, HelpCircle, Ban, Mail } from 'lucide-react';
import { saveOrderToFirestore, saveUserToFirestore } from '../lib/firebase';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  isStudentVerified: boolean;
  userProfile: UserProfile;
  onPlaceOrder: (order: PlacedOrder) => void;
  onUpdateQuantity?: (productId: string, newQty: number) => void;
  onOpenSupport?: (orderId?: string) => void;
  onCancelOrder?: (orderId: string, reason?: string) => void;
  onOpenBuyerLogin?: (msg?: string) => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  isStudentVerified,
  userProfile,
  onPlaceOrder,
  onUpdateQuantity,
  onOpenSupport,
  onCancelOrder,
  onOpenBuyerLogin,
}) => {
  const isGuest = !userProfile?.isLoggedIn;
  const [step, setStep] = useState<'cart' | 'contact' | 'payment' | 'confirmation'>('cart');
  const [addPrintedKit, setAddPrintedKit] = useState<boolean>(true);
  const [paymentMethod] = useState<string>('Cash on Delivery (COD)');
  const [processing, setProcessing] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [placedItems, setPlacedItems] = useState<CartItem[]>([]);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  // Promo Code State
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'flat' | 'percent' | 'freekit' } | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  // Contact & Address Details
  const [buyerName, setBuyerName] = useState<string>(userProfile?.name && userProfile.name !== 'Guest Visitor' ? userProfile.name : '');
  const [buyerEmail, setBuyerEmail] = useState<string>(userProfile?.email || '');
  const [buyerPhone, setBuyerPhone] = useState<string>(userProfile?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState<string>(userProfile?.alternatePhone || '');
  const [collegeName, setCollegeName] = useState<string>(userProfile?.collegeName || '');
  const [department, setDepartment] = useState<string>(userProfile?.department || '');
  const [yearOrRollNo, setYearOrRollNo] = useState<string>(userProfile?.yearOrRollNo || '');
  const [hostelAddress, setHostelAddress] = useState<string>(userProfile?.hostelAddress || '');
  const [city, setCity] = useState<string>(userProfile?.city || '');
  const [stateName, setStateName] = useState<string>(userProfile?.state || '');
  const [pinCode, setPinCode] = useState<string>(userProfile?.pinCode || '');
  const [landmark, setLandmark] = useState<string>(userProfile?.landmark || '');

  // Keep state synchronized when user profile changes
  React.useEffect(() => {
    if (userProfile?.isLoggedIn) {
      if (userProfile.name && userProfile.name !== 'Guest Visitor') setBuyerName(userProfile.name);
      if (userProfile.email) setBuyerEmail(userProfile.email);
      if (userProfile.phone) setBuyerPhone(userProfile.phone);
      if (userProfile.alternatePhone) setAlternatePhone(userProfile.alternatePhone);
      if (userProfile.collegeName) setCollegeName(userProfile.collegeName);
      if (userProfile.department) setDepartment(userProfile.department);
      if (userProfile.yearOrRollNo) setYearOrRollNo(userProfile.yearOrRollNo);
      if (userProfile.hostelAddress) setHostelAddress(userProfile.hostelAddress);
      if (userProfile.city) setCity(userProfile.city);
      if (userProfile.state) setStateName(userProfile.state);
      if (userProfile.pinCode) setPinCode(userProfile.pinCode);
      if (userProfile.landmark) setLandmark(userProfile.landmark);
    }
  }, [userProfile]);

  if (!isOpen) return null;

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const kitFee = addPrintedKit ? 99 : 0;
  const studentDiscount = isStudentVerified ? Math.round(rawSubtotal * 0.1) : 0;

  // Compute coupon discount
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'flat') couponDiscount = appliedCoupon.discount;
    else if (appliedCoupon.type === 'percent') couponDiscount = Math.round(rawSubtotal * (appliedCoupon.discount / 100));
    else if (appliedCoupon.type === 'freekit') couponDiscount = kitFee;
  }

  const grandTotal = Math.max(0, rawSubtotal + kitFee - studentDiscount - couponDiscount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (code === 'CAMPUS50') {
      setAppliedCoupon({ code: 'CAMPUS50', discount: 50, type: 'flat' });
    } else if (code === 'WELCOME10' || code === 'HARDWARE10') {
      setAppliedCoupon({ code, discount: 10, type: 'percent' });
    } else if (code === 'STUDENT20') {
      setAppliedCoupon({ code: 'STUDENT20', discount: 20, type: 'percent' });
    } else if (code === 'FREEDEL') {
      setAppliedCoupon({ code: 'FREEDEL', discount: 99, type: 'freekit' });
    } else {
      setCouponError('Invalid coupon code. Try CAMPUS50, HARDWARE10, STUDENT20, or FREEDEL.');
    }
  };

  const handlePay = async () => {
    setProcessing(true);
    const newOrderId = 'INCP-' + Math.floor(100000 + Math.random() * 900000);

    // Create new order record
    const newOrder: PlacedOrder = {
      orderId: newOrderId,
      userId: userProfile?.id || `usr-${buyerEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      userEmail: buyerEmail.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buyer: {
        name: buyerName.trim() || 'Student Buyer',
        email: buyerEmail.trim().toLowerCase(),
        phone: buyerPhone.trim(),
        alternatePhone: alternatePhone.trim() || undefined,
        collegeName: collegeName.trim() || 'College Institute',
        department: department.trim() || 'Engineering Dept',
        yearOrRollNo: yearOrRollNo.trim() || 'Student',
        hostelAddress: hostelAddress.trim(),
        city: city.trim() || undefined,
        state: stateName.trim() || undefined,
        pinCode: pinCode.trim() || undefined,
        landmark: landmark.trim() || undefined,
      },
      items: cartItems.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        image: ci.product.image,
      })),
      subtotal: rawSubtotal,
      kitFee,
      discount: studentDiscount + couponDiscount,
      grandTotal,
      paymentMethod,
      status: 'Pending Confirmation',
    };

    setTimeout(async () => {
      try {
        await saveOrderToFirestore(newOrder);
        
        if (userProfile?.isLoggedIn) {
          await saveUserToFirestore({
            ...userProfile,
            name: buyerName.trim() || userProfile.name,
            phone: buyerPhone.trim() || userProfile.phone,
            alternatePhone: alternatePhone.trim() || userProfile.alternatePhone,
            collegeName: collegeName.trim() || userProfile.collegeName,
            department: department.trim() || userProfile.department,
            yearOrRollNo: yearOrRollNo.trim() || userProfile.yearOrRollNo,
            hostelAddress: hostelAddress.trim() || userProfile.hostelAddress,
            city: city.trim() || userProfile.city,
            state: stateName.trim() || userProfile.state,
            pinCode: pinCode.trim() || userProfile.pinCode,
            landmark: landmark.trim() || userProfile.landmark,
          });
        }
      } catch (err) {
        console.warn('Order cloud save error:', err);
      }

      setProcessing(false);
      setOrderId(newOrderId);
      onPlaceOrder(newOrder);
      setPlacedItems([...cartItems]);
      setStep('confirmation');
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-800 flex flex-col">
        
        {/* Flipkart / Amazon Style Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {step === 'cart'
                  ? `My Shopping Cart (${totalCount} ${totalCount === 1 ? 'Item' : 'Items'})`
                  : step === 'contact'
                  ? 'Delivery & Campus Address'
                  : step === 'payment'
                  ? 'Cash on Delivery Handoff'
                  : 'Order Placed & Notified'}
              </h2>
              <p className="text-xs text-slate-300">
                {step === 'cart'
                  ? 'Verified hardware components & campus store pickup'
                  : step === 'contact'
                  ? 'Store owner will call/WhatsApp for component delivery'
                  : step === 'payment'
                  ? 'Pay cash when components arrive at your hostel/lab'
                  : 'College store owner notified with your details'}
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

        {/* Step Progress Bar */}
        {step !== 'confirmation' && (
          <div className="flex-shrink-0 bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-around text-xs font-bold text-slate-600">
            <span className={`flex items-center space-x-1 ${step === 'cart' ? 'text-blue-600 font-extrabold' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Cart & Items</span>
            </span>
            <span>&gt;</span>
            <span className={`flex items-center space-x-1 ${step === 'contact' ? 'text-blue-600 font-extrabold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'contact' || step === 'payment' ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'}`}>2</span>
              <span>Campus Address</span>
            </span>
            <span>&gt;</span>
            <span className={`flex items-center space-x-1 ${step === 'payment' ? 'text-blue-600 font-extrabold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'}`}>3</span>
              <span>COD Payment</span>
            </span>
          </div>
        )}

        {/* STEP 1: CART (Amazon/Flipkart Split View with Scrollable List) */}
        {step === 'cart' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your Shopping Cart is Empty</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Explore engineering projects or browse marketplace components to build your custom hardware kit.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Browse Hardware Store
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Cols: Scrollable Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Selected Components ({totalCount})
                    </span>
                    <button
                      onClick={onClearCart}
                      className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>

                  {/* Scrollable Container with max-height so 10+ items fit easily! */}
                  <div className="space-y-3 max-h-[52vh] sm:max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                      >
                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 space-y-1">
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                              <span className="px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded-md font-medium">
                                {item.product.category}
                              </span>
                              <span className="text-emerald-700 font-bold">In Stock at Campus Store</span>
                            </div>
                            <div className="text-xs font-bold text-slate-900">
                              ₹{item.product.price} <span className="text-[10px] text-slate-500 font-normal">/ unit</span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Adjusters & Item Subtotal */}
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                          {/* Quantity +/- Buttons */}
                          <div className="flex items-center space-x-1 bg-white border border-slate-300 rounded-xl p-1 shadow-sm">
                            <button
                              type="button"
                              onClick={() => {
                                if (onUpdateQuantity) {
                                  onUpdateQuantity(item.product.id, item.quantity - 1);
                                } else {
                                  if (item.quantity > 1) item.quantity--;
                                }
                              }}
                              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-bold text-xs text-slate-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (onUpdateQuantity) {
                                  onUpdateQuantity(item.product.id, item.quantity + 1);
                                } else {
                                  item.quantity++;
                                }
                              }}
                              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-mono font-extrabold text-blue-600 text-sm">
                              ₹{item.product.price * item.quantity}
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-[10px] text-rose-500 hover:text-rose-700 font-bold underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Pre-packaged Build Kit Upgrade */}
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="kitUpgrade"
                      checked={addPrintedKit}
                      onChange={(e) => setAddPrintedKit(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-blue-600 bg-white border-slate-300"
                    />
                    <label htmlFor="kitUpgrade" className="text-xs text-slate-700 space-y-0.5 cursor-pointer">
                      <span className="font-bold text-slate-900 block">
                        Include "Build in Progress" Physical Circuit Layout Kit (+₹99)
                      </span>
                      <span className="text-slate-600 block text-[11px] leading-snug">
                        Includes printed circuit wiring diagram, breadboard placement sticker + QR code linked to step-by-step video!
                      </span>
                    </label>
                  </div>

                </div>

                {/* Right 1 Col: Flipkart / Amazon Style "PRICE DETAILS" Card */}
                <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 h-fit shadow-sm">
                  <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
                    PRICE DETAILS
                  </h3>

                  {/* Promo Code Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      <span>Apply Campus Coupon / Promo Code</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. CAMPUS50, HARDWARE10"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs uppercase font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {appliedCoupon && (
                      <div className="p-2 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-between text-xs text-emerald-900 font-bold">
                        <span>✓ Coupon {appliedCoupon.code} Applied</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedCoupon(null);
                            setCouponInput('');
                          }}
                          className="text-[10px] text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {couponError && (
                      <p className="text-[10px] text-rose-600 font-medium">{couponError}</p>
                    )}
                  </div>

                  <div className="space-y-2.5 text-xs border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-slate-700">
                      <span>Price ({totalCount} items)</span>
                      <span className="font-mono font-bold text-slate-900">₹{rawSubtotal}</span>
                    </div>

                    {addPrintedKit && (
                      <div className="flex justify-between text-slate-700">
                        <span>Printed Enclosure Layout Kit</span>
                        <span className="font-mono font-bold text-slate-900">₹99</span>
                      </div>
                    )}

                    {isStudentVerified && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-emerald-600" />
                          .EDU Student Discount (10% Off)
                        </span>
                        <span className="font-mono">-₹{studentDiscount}</span>
                      </div>
                    )}

                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Coupon Savings ({appliedCoupon.code})</span>
                        <span className="font-mono">-₹{couponDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-700">
                      <span>Campus Delivery / Handoff</span>
                      <span className="text-emerald-700 font-bold">FREE (College Store)</span>
                    </div>

                    <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-extrabold text-slate-900">
                      <span>Total Amount Payable:</span>
                      <span className="font-mono text-base text-blue-600">₹{grandTotal}</span>
                    </div>
                  </div>

                  {(studentDiscount > 0 || couponDiscount > 0) && (
                    <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-200 text-emerald-900 font-bold text-[11px] text-center">
                      🎉 You save ₹{studentDiscount + couponDiscount} on this order!
                    </div>
                  )}

                  {!userProfile.isLoggedIn ? (
                    <div className="space-y-2 pt-1">
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-slate-700 text-[11px] space-y-1">
                        <span className="font-bold text-slate-900 block flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          <span>Buyer Login Recommended</span>
                        </span>
                        <p className="text-slate-600 leading-tight">
                          Log in to get direct campus hostel delivery & save your orders.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenBuyerLogin) {
                            onOpenBuyerLogin("Please log in or create a student buyer account to complete your hardware order.");
                          } else {
                            setStep('contact');
                          }
                        }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95"
                      >
                        <User className="w-4 h-4" />
                        <span>LOG IN / SIGN UP TO BUY</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep('contact')}
                        className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] rounded-xl transition-colors"
                      >
                        Continue as Guest Checkout
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStep('contact')}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95"
                    >
                      <span>PLACE ORDER / ENTER ADDRESS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* STEP 2: BUYER CONTACT INFO */}
        {step === 'contact' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep('payment');
            }}
            className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 min-h-0"
          >
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Confirm Buyer Contact Info</span>
                <p className="text-slate-600 text-[11px]">
                  {isGuest
                    ? 'Guest Checkout Mode: Your details will be saved for this order only.'
                    : 'Your college store owner will receive these details for hostel/lab component handoff.'}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${isGuest ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                {isGuest ? '👤 Guest Checkout' : '✓ Logged-in Profile'}
              </span>
            </div>

            {/* Saved Address Shortcuts */}
            {userProfile?.savedAddresses && userProfile.savedAddresses.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select from Your Saved Addresses:</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {userProfile.savedAddresses.map((saved) => (
                    <button
                      key={saved.id}
                      type="button"
                      onClick={() => setHostelAddress(saved.address)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-slate-800 font-semibold rounded-lg text-xs flex items-center space-x-1 transition-all"
                    >
                      <span>📍 {saved.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Student Buyer Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Sairaj Achari"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Primary Phone (Call/WhatsApp) *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Alternative Phone Number / Emergency Contact *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="e.g. +91 91234 56789 (Hostel room / friend)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold"
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
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="e.g. buyer@college.edu"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>College Name</span>
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. IIT Bombay / University Campus"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Department & Year / Roll No</span>
                </label>
                <input
                  type="text"
                  value={yearOrRollNo}
                  onChange={(e) => setYearOrRollNo(e.target.value)}
                  placeholder="e.g. 3rd Year ECE / Roll 2024-089"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Campus / Hostel / Delivery Address *</span>
              </label>
              <input
                type="text"
                required
                value={hostelAddress}
                onChange={(e) => setHostelAddress(e.target.value)}
                placeholder="e.g. Hostel 14, Room 208, Main Campus / Flat 402"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN / Postal Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="e.g. 400076"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Landmark / Delivery Instructions</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite robotics lab / Hostel security gate"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg"
              >
                Back to Cart
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PAYMENT METHOD */}
        {step === 'payment' && (
          <div className="p-4 sm:p-6 space-y-5 text-xs overflow-y-auto flex-1 min-h-0">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-slate-800">
              <div className="flex items-center space-x-2 font-bold text-emerald-900 text-sm">
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span>Cash on Delivery (COD) / Campus Store Handoff</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                No upfront payment required! Your college store owner packs the exact requested components and hands them over to you at your campus hostel or hardware lab.
              </p>
            </div>

            {/* Total Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="font-bold text-slate-900 text-xs">Final Order Amount:</div>
              <div className="flex justify-between text-slate-700">
                <span>Components + Layout Kit</span>
                <span className="font-mono">₹{rawSubtotal + kitFee}</span>
              </div>
              {studentDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Student Verification Discount (10% Off)</span>
                  <span className="font-mono">-₹{studentDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Cash Due on Delivery:</span>
                <span className="font-mono text-blue-600 text-base">₹{grandTotal}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep('contact')}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg"
              >
                Back to Address
              </button>

              <button
                onClick={handlePay}
                disabled={processing}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-md flex items-center space-x-2 transition-all"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Notifying Store Owner...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Place Order (₹{grandTotal})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION & PLACED ORDER RECAP */}
        {step === 'confirmation' && (
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 min-h-0 text-left">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {isCancelled ? 'Order Cancelled Successfully' : 'COD Order Placed & Owner Notified!'}
              </h3>
              <p className="text-xs text-slate-500">
                Order ID: <span className="font-mono text-blue-600 font-bold">{orderId}</span> • <span className="font-bold text-emerald-700">Cash on Delivery</span>
              </p>
            </div>

            {/* Placed Order Items Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  📦 Ordered Components ({placedItems.length} {placedItems.length === 1 ? 'item' : 'items'})
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Qty x Unit Price</span>
              </div>

              <div className="divide-y divide-slate-200/60 max-h-48 overflow-y-auto pr-1">
                {placedItems.length > 0 ? (
                  placedItems.map((item, index) => (
                    <div key={index} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.product.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {item.quantity} x ₹{item.product.price}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">Components logged with store owner.</p>
                )}
              </div>

              {/* Amount Summary */}
              <div className="border-t border-slate-200 pt-2.5 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-1">
                  <span>Total Amount Due:</span>
                  <span className="font-mono text-emerald-700">
                    ₹{grandTotal || placedItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Handoff Details */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Cash on Delivery & Handoff Info</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Your college store owner has received your contact details (<span className="font-bold text-slate-900">{buyerPhone}</span>) and campus address (<span className="font-bold text-slate-900">{hostelAddress}</span>).
              </p>
            </div>

            {/* Direct Action Bar on Confirmation Screen */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {onOpenSupport && (
                <button
                  onClick={() => onOpenSupport(orderId)}
                  className="w-full sm:w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-300 transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Contact Support for this Order</span>
                </button>
              )}

              {!isCancelled && onCancelOrder && (
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to cancel order ${orderId}?`)) {
                      onCancelOrder(orderId, 'Cancelled by student from order placement confirmation');
                      setIsCancelled(true);
                    }
                  }}
                  className="w-full sm:w-1/2 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center space-x-1.5 border border-rose-200 transition-all"
                >
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>Cancel This Order</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              Back to Inception Hardware Workspace
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
