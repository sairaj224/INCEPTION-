import React, { useState } from 'react';
import { X, FileText, Shield, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              {activeTab === 'terms' ? <FileText className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Legal & Compliance Policy</h2>
              <p className="text-xs text-slate-400">Inception College Electronics & Hardware Lab Store</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'terms'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'privacy'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Privacy Policy
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed text-slate-300">
          {activeTab === 'terms' ? (
            <div className="space-y-4">
              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-blue-200">
                <span className="font-bold">Effective Date:</span> August 2026 | Applies to all college students, faculty buyers, and campus lab orders.
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">1. Student Discount & Identity Verification</h3>
                <p>
                  Special prices and 10% student discounts displayed on Inception College Store are applicable strictly to enrolled students and college faculty members. Buyers must present a valid college ID or register with their official college phone/email upon order pickup.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">2. Order Placement & Cash on Delivery / Counter Pickup</h3>
                <p>
                  Orders placed through this portal are held for 48 hours at the campus electronics store counter or hostel dispatch point. Payment can be settled via UPI, Cash on Delivery, or card at the counter upon testing the components.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">3. Component Testing & Replacement Policy</h3>
                <p>
                  All electronic components (Microcontrollers, OLED displays, Sensors, ICs) undergo basic pre-dispatch functional checks. If a component is found defective upon unboxing, students may request a replacement within 7 days by bringing the component to the store admin or initiating a ticket under <strong>Contact Support</strong>.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">4. Hardware Lab Safety & Misuse Disclaimer</h3>
                <p>
                  Students are responsible for observing correct polarity, voltage limits, and power supply specs when wiring components. Inception College Store is not liable for damages resulting from short circuits, reverse polarity, or incorrect pinouts during lab experiments.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">5. Price Modifications</h3>
                <p>
                  Store Owners reserve the right to modify prices, discount coupons, and stock allocations based on wholesale component market variations.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-emerald-200">
                <span className="font-bold">Data Privacy Guarantee:</span> We prioritize student data security and strictly comply with DPDP and digital privacy guidelines.
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">1. Information We Collect</h3>
                <p>
                  To fulfill lab component orders and offer campus discounts, we store minimal contact details: student name, phone number, college/department name, roll number, and hostel room/delivery address.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">2. How Your Data Is Used</h3>
                <p>
                  Your information is exclusively used for order verification, delivery coordination to your hostel/lab, and processing component return requests. We never sell, rent, or trade student data with third-party advertisers.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">3. Local Caching & Cookie Storage</h3>
                <p>
                  We store session tokens, project bookmark watchlists, and cart items in your browser's local cache so you can browse the store seamlessly offline. You can clear or manage these cookies anytime via <strong>Cookie Controls</strong> or <strong>Cache Settings</strong> in the footer.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">4. Data Deletion & Account Closure</h3>
                <p>
                  Students can request full deletion of their saved profiles and order histories by clicking "Reset Account Data" in the Buyer Profile modal or reaching out to Store Admin Support.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
