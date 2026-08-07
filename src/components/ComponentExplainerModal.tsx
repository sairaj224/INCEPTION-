import React, { useState } from 'react';
import { Product, ProductReview } from '../types';
import { X, HelpCircle, Cpu, AlertTriangle, Lightbulb, RefreshCw, Loader2, CheckCircle2, Star, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { fetchAiComponentExplanation } from '../lib/api';

interface ComponentExplainerModalProps {
  product: Product | null;
  onClose: () => void;
  onAddReview?: (productId: string, review: ProductReview) => void;
  userProfileName?: string;
}

export const ComponentExplainerModal: React.FC<ComponentExplainerModalProps> = ({
  product,
  onClose,
  onAddReview,
  userProfileName = 'Student Developer',
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'reviews'>('guide');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiData, setAiData] = useState<any>(null);

  // New Review Form State
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>(userProfileName);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  if (!product) return null;

  const guide = aiData || product.detailGuide;
  const reviewsList = product.reviews || [
    {
      id: 'rev-1',
      reviewerName: 'Aarav Mehta (IITB)',
      rating: 5,
      date: '2 days ago',
      comment: 'Excellent quality board! Pin headers are pre-soldered and worked seamlessly with the Arduino IDE.',
      verifiedBuyer: true,
    },
    {
      id: 'rev-2',
      reviewerName: 'Priya Verma (BITS)',
      rating: 4,
      date: '1 week ago',
      comment: 'Very reliable for IoT projects. Fast shipping to campus hostel.',
      verifiedBuyer: true,
    },
  ];

  const avgRating = product.rating || (reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length).toFixed(1);

  const handleFetchDetailedAiExplanation = async () => {
    if (!product || !product.name) return;
    setLoadingAi(true);
    try {
      const explanation = await fetchAiComponentExplanation(product.name);
      setAiData(explanation);
    } catch (err: any) {
      console.error('Error fetching AI explanation:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const reviewObj: ProductReview = {
      id: 'rev-' + Date.now(),
      reviewerName: reviewerName.trim() || 'Campus Builder',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      verifiedBuyer: true,
    };

    if (onAddReview) {
      onAddReview(product.id, reviewObj);
    } else {
      reviewsList.unshift(reviewObj);
    }

    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white">{product.name}</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded-md">
                  ₹{product.price}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-400">
                <div className="flex items-center text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  <span>{avgRating}</span>
                </div>
                <span>•</span>
                <span>{reviewsList.length} Student Reviews</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center space-x-1.5 ${
              activeTab === 'guide'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Hardware Explainer & Datasheet</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center space-x-1.5 ${
              activeTab === 'reviews'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ratings & Student Reviews ({reviewsList.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 text-sm max-h-[70vh] overflow-y-auto">
          
          {activeTab === 'guide' ? (
            <>
              {/* 1. Why Do I Need This? */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>Why do I need this?</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{guide.whyDoINeedThis}</p>
              </div>

              {/* 2. How Does It Work Inside? */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>How does it work inside?</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{guide.howDoesItWork}</p>
              </div>

              {/* 3. What if I Don't Use It? */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>What if I don't use it?</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{guide.whatIfIDontUseIt}</p>
              </div>

              {/* 4. Real Life Applications */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Lightbulb className="w-4 h-4" />
                  <span>Applications in real life</span>
                </div>
                <ul className="space-y-1">
                  {guide.realLifeApplications?.map((app: string, idx: number) => (
                    <li key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alternative Swaps */}
              {guide.alternativeComponents && guide.alternativeComponents.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-2">Alternative Component Swaps:</span>
                  <div className="flex flex-wrap gap-2">
                    {guide.alternativeComponents.map((alt: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-800 text-cyan-300 border border-slate-700 text-xs rounded-lg font-mono"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Refresh Button */}
              <button
                onClick={handleFetchDetailedAiExplanation}
                disabled={loadingAi}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-all"
              >
                {loadingAi ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                )}
                <span>Generate Extended Physics & Datasheet Insight via AI</span>
              </button>
            </>
          ) : (
            <div className="space-y-5 text-xs">
              
              {/* Ratings Summary Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-white flex items-center gap-1.5">
                    <span>{avgRating}</span>
                    <span className="text-slate-500 text-sm font-normal">/ 5.0</span>
                  </div>
                  <div className="flex items-center text-amber-400 space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Based on verified campus builder testing</p>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-lg text-[11px]">
                    100% Verified Quality
                  </span>
                </div>
              </div>

              {/* Submit Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Write a Student Review</span>
                </h4>

                {reviewSubmitted && (
                  <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 font-bold text-[11px] flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Thank you! Your review has been published.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Your Name / Handle</label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Star Rating</label>
                    <div className="flex items-center space-x-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewRating(s)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${s <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">Your Hardware Review & Feedback</label>
                  <textarea
                    rows={2}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe pin compatibility, build quality, or performance in your lab project..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center space-x-1.5 text-xs transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Review</span>
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-300 text-xs">Recent Reviews</h4>
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-xs">{rev.reviewerName}</span>
                        {rev.verifiedBuyer && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-md font-bold">
                            ✓ Verified Campus Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{rev.date}</span>
                    </div>

                    <div className="flex items-center text-amber-400 space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
