import React, { useState } from 'react';
import { X, HelpCircle, MessageSquare, Phone, Mail, Send, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, ShoppingBag, ShieldCheck, Upload, FileText, Paperclip } from 'lucide-react';
import { UserProfile, PlacedOrder } from '../types';
import { validateAndProcessFileUpload, ValidatedFileResult } from '../lib/fileUpload';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  orders?: PlacedOrder[];
  prefilledOrderId?: string;
  initialOrderId?: string;
}

export const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  orders = [],
  prefilledOrderId,
  initialOrderId,
}) => {
  const effectiveOrderId = prefilledOrderId || initialOrderId || '';
  const [selectedOrderId, setSelectedOrderId] = useState<string>(effectiveOrderId);
  const [topic, setTopic] = useState<string>('Order Status / Delivery');
  const [message, setMessage] = useState<string>('');
  const [attachment, setAttachment] = useState<ValidatedFileResult | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const handleFileUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    const result = await validateAndProcessFileUpload(file, { maxSizeMb: 5 });
    if (result.success) {
      setAttachment(result);
    } else {
      setUploadError(result.error || 'Invalid file format');
      setAttachment(null);
    }
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitted(true);
  };

  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId);

  // Clean phone number for WhatsApp
  const storePhone = '919876543210';
  const whatsappText = selectedOrder
    ? `Hi Inception Support! I need help with Order ID: ${selectedOrder.orderId} (${selectedOrder.items.length} components, ₹${selectedOrder.grandTotal}). Issue: ${topic}`
    : `Hi Inception Support! I have a question regarding campus hardware components and orders. Topic: ${topic}`;

  const whatsappUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(whatsappText)}`;

  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) component handoff work?',
      a: 'Once you place a COD order, your college store owner receives an alert. The components are packed and delivered directly to your campus address/hostel. You pay the exact amount in cash or UPI during handoff.',
    },
    {
      q: 'Can I cancel an order after placing it?',
      a: 'Yes! You can cancel your order anytime before it is marked as "Dispatched" directly from your Profile > Component Orders tab, or by contacting the store owner via WhatsApp.',
    },
    {
      q: 'What if a component (e.g., sensor or microcontroller) is defective?',
      a: 'We offer a 7-day campus replacement guarantee for all non-damaged components. Bring the component to your college store or contact us here with your Order ID for instant exchange.',
    },
    {
      q: 'How do I claim my 10% Student Discount?',
      a: 'Your student discount is automatically applied during checkout when logged in with a verified college email or student profile ID.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Customer Support & Help Center
              </h2>
              <p className="text-xs text-slate-300">
                Get instant assistance with orders, hardware testing, or component returns
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

        {/* Quick Contact Buttons Row */}
        <div className="flex-shrink-0 p-3 bg-slate-100 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href="tel:+919876543210"
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Call +91 98765 43210</span>
          </a>

          <a
            href="mailto:support@inception-hardware.in"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <Mail className="w-4 h-4" />
            <span>Email Campus Store</span>
          </a>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-6 text-xs">
          
          {/* Form Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Send Support Ticket / Inquiry</h3>
                <p className="text-[11px] text-slate-500">Our campus store team responds within 15 minutes.</p>
              </div>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 font-bold rounded-full text-[10px] uppercase">
                Active Priority Support
              </span>
            </div>

            {isSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Support Ticket Received!</h4>
                <p className="text-slate-600 text-xs">
                  Ticket #TKT-{(Math.random() * 10000).toFixed(0)} generated. Our store manager will call you back at{' '}
                  <span className="font-bold text-slate-900">{userProfile.phone}</span> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-2 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Select Order (Optional):</label>
                    <select
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="">General Query (No Order)</option>
                      {orders.map((ord) => (
                        <option key={ord.orderId} value={ord.orderId}>
                          {ord.orderId} - ₹{ord.grandTotal} ({ord.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Issue Topic:</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="Order Status / Delivery">Order Status & Delivery Delay</option>
                      <option value="Order Cancellation">Request Order Cancellation</option>
                      <option value="Defective Component">Defective Component Replacement</option>
                      <option value="Technical Pinout Doubt">Pinout / Circuit Diagram Doubt</option>
                      <option value="Custom 3D Printing / PCB">Custom 3D Printing or PCB Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message / Details:</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or component requirement..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Secure Attachment File Upload */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                    <span>Attach Photo / Circuit Screenshot / Bill (Optional):</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUploadChange}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                  {uploadError && (
                    <p className="text-xs text-rose-600 font-semibold mt-1">{uploadError}</p>
                  )}
                  {attachment && attachment.dataUrl && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-800">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-bold truncate">{attachment.fileName}</span>
                        <span className="text-[10px] text-slate-500">({attachment.fileSizeKb} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachment(null)}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Support Ticket</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full p-3.5 text-left font-bold text-slate-800 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="p-3.5 border-t border-slate-100 text-slate-600 text-xs bg-white leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">Inception Hardware Store • Campus Tech Support</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm"
          >
            Close Support
          </button>
        </div>

      </div>
    </div>
  );
};
