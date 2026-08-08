import React, { useState } from 'react';
import { Product } from '../types';
import { Search, ShoppingCart, HelpCircle, Check, Filter, Edit3, Settings2, ShieldAlert, Heart, Image as ImageIcon } from 'lucide-react';
import { ComponentExplainerModal } from './ComponentExplainerModal';
import { OptimizedImage } from './OptimizedImage';
import { ImageChangeModal } from './ImageChangeModal';

interface MarketplaceViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  userRole?: 'student' | 'owner';
  onOpenAdminModal?: () => void;
  onUpdateProductPrice?: (productId: string, newPrice: number) => void;
  onUpdateProduct?: (product: Product) => void;
  watchlistProductIds?: Set<string>;
  onToggleWatchlistProduct?: (productId: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  onAddToCart,
  userRole = 'student',
  onOpenAdminModal,
  onUpdateProductPrice,
  onUpdateProduct,
  watchlistProductIds = new Set(),
  onToggleWatchlistProduct,
  onSelectProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProductForGuide, setSelectedProductForGuide] = useState<Product | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Image Customization State
  const [targetImageProduct, setTargetImageProduct] = useState<Product | null>(null);

  // Inline Price Editing State
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const categories = ['All', 'Microcontrollers', 'Sensors', 'Actuators', 'Displays', 'Power & Accessories'];

  const filteredProducts = products.filter((p) => {
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch = (p.name || '').toLowerCase().includes(query) || (p.description || '').toLowerCase().includes(query);
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const handleSaveInlinePrice = (productId: string) => {
    if (onUpdateProductPrice && tempPrice >= 0) {
      onUpdateProductPrice(productId, tempPrice);
    }
    setEditingPriceId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Inception Component Store</h2>
            {userRole === 'owner' && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-400 text-slate-950 rounded-md uppercase flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Store Owner Mode</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {userRole === 'owner'
              ? 'You are operating as College Store Owner. You can directly edit prices, add new items, or manage stock.'
              : 'Verified microcontrollers, sensors, actuators & prototyping kits with detailed learning guides.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {userRole === 'owner' && onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Settings2 className="w-4 h-4" />
              <span>Full Store Price & Catalog Manager</span>
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-2 text-xs text-blue-300 font-mono bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
            <span>⚡ 100% Compatible with Inception Projects</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search sensors, boards, modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((p) => {
          const isAdded = addedIds.has(p.id);
          const isEditingPrice = editingPriceId === p.id;

          return (
            <div
              key={p.id}
              className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 flex flex-col justify-between space-y-4 transition-all shadow-sm hover:shadow-md group relative cursor-pointer"
              onClick={() => onSelectProduct && onSelectProduct(p)}
            >
              <div className="space-y-3">
                <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-100">
                  <OptimizedImage
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded bg-slate-900/80 text-white border border-slate-700">
                    {p.category}
                  </span>

                  {userRole === 'owner' && onUpdateProduct && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTargetImageProduct(p);
                      }}
                      className="absolute bottom-2 left-2 px-2 py-1 bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-[10px] rounded-lg backdrop-blur-md border border-slate-700/80 flex items-center space-x-1 opacity-90 hover:opacity-100 transition-all z-10"
                      title="Change Component Photo"
                    >
                      <ImageIcon className="w-3 h-3 text-blue-400" />
                      <span>Change Photo</span>
                    </button>
                  )}

                  {onToggleWatchlistProduct && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlistProduct(p.id);
                      }}
                      className={`absolute top-2 ${!p.inStock ? 'right-20' : 'right-2'} p-1.5 rounded-full backdrop-blur-md transition-all z-10 shadow-sm ${
                        watchlistProductIds.has(p.id)
                          ? 'bg-rose-500 text-white scale-110'
                          : 'bg-slate-900/60 text-slate-200 hover:bg-slate-900 hover:text-rose-400'
                      }`}
                      title={watchlistProductIds.has(p.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${watchlistProductIds.has(p.id) ? 'fill-white' : ''}`} />
                    </button>
                  )}

                  {!p.inStock && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded bg-rose-600 text-white">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  {/* Price display or inline owner price edit */}
                  {userRole === 'owner' && isEditingPrice ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-bold text-slate-700">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(Number(e.target.value))}
                        className="w-20 px-2 py-1 bg-amber-50 border border-amber-400 rounded font-mono font-bold text-slate-900 text-xs focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveInlinePrice(p.id)}
                        className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5">
                      <span className="text-base font-bold text-blue-600 font-mono">₹{p.price}</span>
                      {userRole === 'owner' && (
                        <button
                          onClick={() => {
                            setEditingPriceId(p.id);
                            setTempPrice(p.price);
                          }}
                          className="p-1 rounded bg-amber-100 hover:bg-amber-200 text-slate-800 text-[10px] font-bold flex items-center space-x-0.5"
                          title="Click to edit price directly"
                        >
                          <Edit3 className="w-3 h-3 text-amber-800" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectProduct ? onSelectProduct(p) : setSelectedProductForGuide(p)}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-0.5"
                    >
                      <span>Specs & Page →</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleAdd(p)}
                  disabled={!p.inStock}
                  className={`w-full py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm ${
                    !p.inStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {!p.inStock ? (
                    <span>Out of Stock</span>
                  ) : isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ComponentExplainerModal
        product={selectedProductForGuide}
        onClose={() => setSelectedProductForGuide(null)}
      />

      {/* Image Change Modal */}
      {targetImageProduct && onUpdateProduct && (
        <ImageChangeModal
          isOpen={!!targetImageProduct}
          onClose={() => setTargetImageProduct(null)}
          title={`Change Photo for ${targetImageProduct.name}`}
          currentImageUrl={targetImageProduct.image}
          onSaveImage={(newUrl) => {
            onUpdateProduct({ ...targetImageProduct, image: newUrl });
            setTargetImageProduct(null);
          }}
        />
      )}
    </div>
  );
};

