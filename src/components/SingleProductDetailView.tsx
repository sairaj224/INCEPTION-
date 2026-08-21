import React, { useState } from 'react';
import { Product, Project, ProductReview } from '../types';
import {
  ChevronLeft,
  ShoppingCart,
  Heart,
  Check,
  Star,
  ShieldCheck,
  Zap,
  Download,
  HelpCircle,
  Package,
  Layers,
  Cpu,
  ArrowRight,
  Info,
  Sparkles,
  FileText,
  Truck,
  MessageSquare,
  Maximize2,
  X,
  Send,
  Play,
  Video,
  Clock,
  BookOpen
} from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface SingleProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  allProjects: Project[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
  onSelectProject?: (project: Project) => void;
  onSelectProduct?: (product: Product) => void;
  isWatched?: boolean;
  onToggleWatchlist?: (productId: string) => void;
  userRole?: 'student' | 'owner';
  onUpdateProduct?: (product: Product) => void;
}

export const SingleProductDetailView: React.FC<SingleProductDetailViewProps> = ({
  product,
  allProducts,
  allProjects,
  onBack,
  onAddToCart,
  onBuyNow,
  onSelectProject,
  onSelectProduct,
  isWatched = false,
  onToggleWatchlist,
  userRole = 'student',
  onUpdateProduct,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'guide' | 'reviews' | 'projects'>('specs');
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Review Form State
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(
    product.reviews || [
      {
        id: 'rev-1',
        reviewerName: 'Aarav Sharma (IIT Bombay)',
        rating: 5,
        date: '3 days ago',
        comment: 'Excellent build quality! Verified working with ESP32 and Arduino IDE without any driver issues.',
        verifiedBuyer: true,
      },
      {
        id: 'rev-2',
        reviewerName: 'Priya Patel (BITS Pilani)',
        rating: 5,
        date: '1 week ago',
        comment: 'Delivered to Hostel 8 in under 24 hours. Comes with pin headers pre-soldered.',
        verifiedBuyer: true,
      },
    ]
  );
  const [newReviewName, setNewReviewName] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Filter compatible projects that use this component in BOM
  const compatibleProjects = allProjects.filter((proj) =>
    proj.bom.some((item) => item.productId === product.id)
  );

  // Filter related components in the same category
  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNowClick = () => {
    if (onBuyNow) {
      onBuyNow(product, quantity);
    } else {
      onAddToCart(product, quantity);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev: ProductReview = {
      id: 'rev-' + Date.now(),
      reviewerName: newReviewName.trim() || 'Verified Engineering Student',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      verifiedBuyer: true,
    };

    const updatedList = [newRev, ...reviewsList];
    setReviewsList(updatedList);

    if (onUpdateProduct) {
      onUpdateProduct({
        ...product,
        reviews: updatedList,
        reviewCount: updatedList.length,
      });
    }

    setNewReviewName('');
    setNewReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const skuCode = `INCP-${product.id.replace('prod-', '').toUpperCase()}`;
  const originalPrice = Math.round(product.price * 1.25);
  const studentDiscountPrice = Math.round(product.price * 0.9);
  const rewardPoints = Math.round(product.price / 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-sm text-slate-300 text-xs">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-blue-400" />
            <span>Back to Store Catalog</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 font-medium whitespace-nowrap">Store</span>
          <span className="text-slate-600">/</span>
          <span className="text-blue-400 font-semibold whitespace-nowrap">{product.category}</span>
          <span className="text-slate-600">/</span>
          <span className="text-white font-bold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </div>

        {onToggleWatchlist && (
          <button
            onClick={() => onToggleWatchlist(product.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isWatched
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWatched ? 'text-rose-400 fill-rose-500' : 'text-slate-400'}`} />
            <span>{isWatched ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>
        )}
      </div>

      {/* Main Product Card Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
        {/* Left Column: Product Image & Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-inner flex items-center justify-center">
            <OptimizedImage
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Lightbox Expand Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700 shadow-md transition-all opacity-80 group-hover:opacity-100"
              title="Click to zoom image"
            >
              <Maximize2 className="w-4 h-4 text-blue-400" />
            </button>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-blue-600 text-white rounded-lg shadow-md border border-blue-400/40">
                {product.category}
              </span>
              {product.inStock ? (
                <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg backdrop-blur-md">
                  In Stock ({product.stockQuantity || 48} Units)
                </span>
              ) : (
                <span className="px-2.5 py-1 text-[10px] font-bold bg-rose-600 text-white rounded-lg shadow-md">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Alternate Views / Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            {[product.image, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80'].map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                className={`w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border-2 transition-all p-1 flex-shrink-0 ${
                  selectedImage === imgUrl ? 'border-blue-500 shadow-lg scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Fast Delivery Info Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Truck className="w-4 h-4" />
              <span>Campus Hostel & Lab Express Delivery</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Orders placed before 4:00 PM are dispatched same-day to campus hostels, robotics labs, or faculty desks.
            </p>
          </div>
        </div>

        {/* Right Column: Product Title, Pricing, Specs Summary & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category / Subcategory & Ratings */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                {product.subcategory || product.category}
              </span>

              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center text-amber-400 space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-extrabold text-white">{product.rating || 4.9}</span>
                <span className="text-slate-500">({reviewsList.length} student reviews)</span>
              </div>
            </div>

            {/* Main Product Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* SKU & Stock Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span>SKU: <strong className="text-slate-200">{skuCode}</strong></span>
              <span>•</span>
              <span>Availability: <strong className={product.inStock ? 'text-emerald-400' : 'text-rose-400'}>{product.inStock ? 'In Stock' : 'Out of Stock'}</strong></span>
              <span>•</span>
              <span className="text-blue-300 font-bold">Verified Inception Hardware</span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">
                  ₹{product.price}
                </span>
                <span className="text-xs text-slate-400 font-normal">(Incl. GST)</span>
                <span className="line-through text-slate-500 text-sm font-mono">₹{originalPrice}</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md">
                  SAVE 20%
                </span>
              </div>

              {/* Student Discount Perk */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  College ID Perk: Get it for <strong>₹{studentDiscountPrice}</strong> with verified .edu student email at checkout!
                </span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>Purchase this item and earn <strong>{rewardPoints} Inception CashPoints</strong> for future project kits.</span>
              </div>
            </div>

            {/* Description & Key Specs Bullet Highlights */}
            <div className="space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed text-slate-300 text-sm">
                {product.description}
              </p>

              {/* Key Specs Highlights */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    <span>Key Technical Highlights</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                    {Object.entries(product.specs).slice(0, 6).map(([key, val]) => (
                      <li key={key} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span><strong>{key}:</strong> {val}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Quantity Picker & Cart Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-400 uppercase">Quantity:</span>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-sm transition-all"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold font-mono text-white min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-sm transition-all"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCartClick}
                disabled={!product.inStock}
                className={`py-3 px-6 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 ${
                  !product.inStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added ({quantity}) to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add {quantity > 1 ? `(${quantity})` : ''} to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNowClick}
                disabled={!product.inStock}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-950/40 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Buy Now (Express Checkout)</span>
              </button>
            </div>

            {/* B2B / Bulk Lab Note */}
            <p className="text-[11px] text-slate-500 text-center sm:text-left">
              For bulk lab procurement, college team discounts, or official GST invoices, email: <a href="mailto:sales@inceptionstore.in" className="text-blue-400 underline font-medium">sales@inceptionstore.in</a>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section: Technical Specs, Learning Guide, Reviews, Compatible Projects */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6 text-white">
        {/* Tab Headers */}
        <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'specs'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 text-blue-300" />
            <span>Technical Specifications & Pinout</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Component Learning Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Student Reviews ({reviewsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Compatible Inception Projects ({compatibleProjects.length})</span>
          </button>
        </div>

        {/* Tab 1: Technical Specifications */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Datasheet & Technical Parameters</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified hardware operating parameters, pin configurations, and electrical specifications.
                </p>
              </div>

              <button
                onClick={() => alert(`Downloading official PDF datasheet for ${product.name}...`)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-xs border border-slate-700 flex items-center space-x-1.5 transition-all"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Download Datasheet PDF</span>
              </button>
            </div>

            {/* Specifications Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs text-slate-300">
                <tbody className="divide-y divide-slate-800">
                  <tr className="bg-slate-900/60 font-bold text-slate-200">
                    <td className="p-3 w-1/3">Category / Family</td>
                    <td className="p-3 w-2/3 text-blue-400">{product.category}</td>
                  </tr>
                  <tr className="bg-slate-950 font-bold text-slate-200">
                    <td className="p-3">SKU Part ID</td>
                    <td className="p-3 font-mono">{skuCode}</td>
                  </tr>

                  {product.specs &&
                    Object.entries(product.specs).map(([specKey, specVal], idx) => (
                      <tr key={specKey} className={idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-950'}>
                        <td className="p-3 font-semibold text-slate-400">{specKey}</td>
                        <td className="p-3 text-slate-100 font-mono font-medium">{specVal}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pinout Details */}
            {product.pinout && product.pinout.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-extrabold text-sm text-amber-300 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Module Pinout Diagram & Pin Mapping</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.pinout.map((pin, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-200 flex items-center space-x-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>{pin}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Learning Guide */}
        {activeTab === 'guide' && product.detailGuide && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-sm text-blue-400 flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>Why Do I Need This Component?</span>
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {product.detailGuide.whyDoINeedThis}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-sm text-emerald-400 flex items-center space-x-2">
                  <Cpu className="w-4 h-4" />
                  <span>How Does It Work Under the Hood?</span>
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {product.detailGuide.howDoesItWork}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-sm text-rose-400 flex items-center space-x-2">
                  <Info className="w-4 h-4" />
                  <span>What If I Don't Use This?</span>
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {product.detailGuide.whatIfIDontUseIt}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-sm text-amber-400 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Industrial & Real-Life Applications</span>
                </h4>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {product.detailGuide.realLifeApplications?.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Embedded Component Video Tutorial (DHT11, ESP32, MQ-2, etc. respective lessons) */}
            {product.videoTutorial && (
              <div className="p-5 rounded-3xl bg-slate-950 border border-blue-500/30 space-y-4 shadow-xl shadow-blue-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        <span>{product.videoTutorial.title}</span>
                        <span className="px-2 py-0.5 text-[9px] bg-rose-500/20 text-rose-300 rounded border border-rose-500/40 uppercase font-black">
                          Video Lesson
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Instructor: <strong>{product.videoTutorial.instructor}</strong> • Duration: {product.videoTutorial.duration}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 bg-slate-900 text-blue-300 font-mono rounded-lg border border-slate-800 self-start sm:self-auto">
                    Part of {product.name} Lab Syllabus
                  </span>
                </div>

                {/* YouTube Video Player Embed */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-inner">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${product.videoTutorial.youtubeId}?rel=0&modestbranding=1`}
                    title={product.videoTutorial.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {product.videoTutorial.description}
                </p>

                {/* Video Lesson Key Timestamps & Checkpoints */}
                {product.videoTutorial.keyTimestamps && product.videoTutorial.keyTimestamps.length > 0 && (
                  <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-[11px] text-blue-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Video Lesson Checkpoints & Timestamps</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.videoTutorial.keyTimestamps.map((ts, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-xs p-2 rounded-xl bg-slate-950 border border-slate-800/80"
                        >
                          <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                            {ts.time}
                          </span>
                          <span className="text-slate-300 truncate">{ts.topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Alternatives */}
            {product.detailGuide.alternativeComponents && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wide">
                  Alternative / Swap Components
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.detailGuide.alternativeComponents.map((alt, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Reviews List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-extrabold text-sm text-white">Student & Faculty Reviews</h3>
                {reviewsList.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">No reviews yet for this product. Be the first student to review!</p>
                ) : (
                  <div className="space-y-3">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-white">{rev.reviewerName}</span>
                            {rev.verifiedBuyer && (
                              <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{rev.date}</span>
                        </div>

                        <div className="flex items-center text-amber-400 space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                            />
                          ))}
                        </div>

                        <p className="text-slate-300 leading-relaxed text-xs">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Review Form */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="font-extrabold text-sm text-white">Write a Student Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Your Name & College</label>
                    <input
                      type="text"
                      placeholder="e.g. Rohan Verma (IIT Delhi)"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Rating</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-bold text-xs"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5) - Excellent</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5) - Very Good</option>
                      <option value={3}>⭐⭐⭐ (3/5) - Good</option>
                      <option value={2}>⭐⭐ (2/5) - Fair</option>
                      <option value={1}>⭐ (1/5) - Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Your Review / Testing Experience</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe pin headers, testing with code, or campus lab performance..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Student Review</span>
                  </button>

                  {reviewSubmitted && (
                    <p className="text-emerald-400 font-bold text-center text-[11px] animate-fade-in">
                      ✓ Thank you! Your review has been added.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Compatible Inception Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Build these full engineering project kits using this component in their Bill of Materials (BOM):
            </p>

            {compatibleProjects.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No default project kits explicitly list this component in BOM yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compatibleProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject && onSelectProject(proj)}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all space-y-3 group"
                  >
                    <div className="h-32 rounded-xl overflow-hidden bg-slate-900">
                      <img src={proj.heroImage} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-500/20 text-blue-300 rounded uppercase">
                        {proj.domain}
                      </span>
                      <h4 className="font-extrabold text-sm text-white mt-1 group-hover:text-blue-400 transition-colors">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{proj.subtitle}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-300 font-bold">
                      <span>Est. Budget: ₹{proj.estimatedBudget}</span>
                      <span className="text-blue-400 flex items-center space-x-1">
                        <span>View Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Components in Same Category */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-400" />
            <span>Similar {product.category} Components</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct && onSelectProduct(p)}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-2xl p-4 cursor-pointer transition-all space-y-3 group text-white"
              >
                <div className="h-28 rounded-xl overflow-hidden bg-slate-950 p-2">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="font-mono font-bold text-blue-400 text-sm">₹{p.price}</span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-white">View Specs →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">{product.name}</h3>
              <button onClick={() => setIsLightboxOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="max-h-[70vh] flex items-center justify-center bg-slate-950 rounded-2xl p-4">
              <img src={selectedImage || product.image} alt={product.name} className="max-h-[60vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
