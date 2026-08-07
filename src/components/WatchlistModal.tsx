import React, { useState } from 'react';
import { Bookmark, Heart, Trash2, ShoppingBag, ArrowRight, ExternalLink, Sparkles, X, Compass, Cpu, Check, Layers } from 'lucide-react';
import { Project, Product } from '../types';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistProjectIds: Set<string>;
  watchlistProductIds: Set<string>;
  projects: Project[];
  products: Product[];
  onToggleWatchlistProject: (projectId: string) => void;
  onToggleWatchlistProduct: (productId: string) => void;
  onSelectProject: (project: Project) => void;
  onAddToCart: (product: Product) => void;
  onAddProjectKitToCart: (project: Project) => void;
  onClearWatchlist: () => void;
  onNavigateToTab?: (tab: 'projects' | 'marketplace') => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlistProjectIds,
  watchlistProductIds,
  projects,
  products,
  onToggleWatchlistProject,
  onToggleWatchlistProduct,
  onSelectProject,
  onAddToCart,
  onAddProjectKitToCart,
  onClearWatchlist,
  onNavigateToTab,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'projects' | 'products'>('all');

  if (!isOpen) return null;

  const watchedProjects = projects.filter((p) => watchlistProjectIds.has(p.id));
  const watchedProducts = products.filter((p) => watchlistProductIds.has(p.id));

  const totalProjectsCount = watchedProjects.length;
  const totalProductsCount = watchedProducts.length;
  const totalItemsCount = totalProjectsCount + totalProductsCount;

  // Calculate budget estimate
  const totalProjectBudget = watchedProjects.reduce((sum, p) => sum + p.estimatedBudget, 0);
  const totalProductBudget = watchedProducts.reduce((sum, p) => sum + p.price, 0);
  const grandTotalEstimate = totalProjectBudget + totalProductBudget;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl">
              <Heart className="w-5 h-5 fill-rose-500/20 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">My Saved Watchlist</h2>
                <span className="px-2 py-0.5 text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Saved engineering projects and campus component wishlist
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {totalItemsCount > 0 && (
              <button
                type="button"
                onClick={onClearWatchlist}
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all flex items-center space-x-1"
                title="Clear all saved items"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Watchlist</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Navigation & Total Summary Bar */}
        {totalItemsCount > 0 && (
          <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Items ({totalItemsCount})
              </button>
              <button
                onClick={() => setActiveFilter('projects')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeFilter === 'projects'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Projects ({totalProjectsCount})
              </button>
              <button
                onClick={() => setActiveFilter('products')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeFilter === 'products'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Components ({totalProductsCount})
              </button>
            </div>

            {/* Estimated Total */}
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <span className="text-slate-400">Total Budget Est.:</span>
              <span className="font-extrabold text-emerald-400 text-sm">₹{grandTotalEstimate.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {totalItemsCount === 0 ? (
            /* Empty Watchlist State */
            <div className="py-16 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 text-rose-400">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Your Watchlist is Empty</h3>
                <p className="text-xs text-slate-400">
                  Save electronics hardware projects and components to your watchlist while browsing to keep track of your lab requirements.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToTab?.('projects');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Compass className="w-4 h-4" />
                  <span>Browse Projects</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToTab?.('marketplace');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5"
                >
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span>Browse Hardware Store</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: WATCHED PROJECTS */}
              {(activeFilter === 'all' || activeFilter === 'projects') && watchedProjects.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Compass className="w-4 h-4 text-blue-400" />
                      <span>Saved Hardware Projects ({watchedProjects.length})</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {watchedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3 transition-all group"
                      >
                        <div className="flex space-x-3">
                          <img
                            src={project.heroImage}
                            alt={project.title}
                            className="w-20 h-20 object-cover rounded-lg border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded">
                                {project.domain}
                              </span>
                              <button
                                onClick={() => onToggleWatchlistProject(project.id)}
                                className="text-slate-400 hover:text-rose-400 p-1 rounded-md hover:bg-rose-500/10 transition-colors"
                                title="Remove from Watchlist"
                              >
                                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                              </button>
                            </div>

                            <h4
                              onClick={() => {
                                onSelectProject(project);
                                onClose();
                              }}
                              className="font-bold text-sm text-white hover:text-blue-400 transition-colors cursor-pointer line-clamp-1 mt-1"
                            >
                              {project.title}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {project.subtitle}
                            </p>

                            <div className="flex items-center space-x-3 text-xs mt-2 font-medium">
                              <span className="text-emerald-400 font-extrabold">₹{project.estimatedBudget}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-300">{project.difficulty}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-400">{project.estimatedHours} hrs</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 gap-2">
                          <button
                            onClick={() => {
                              onSelectProject(project);
                              onClose();
                            }}
                            className="flex-1 py-1.5 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-all flex items-center justify-center space-x-1"
                          >
                            <span>Open Details</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onAddProjectKitToCart(project)}
                            className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center space-x-1"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add Kit (₹{project.estimatedBudget})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 2: WATCHED PRODUCTS / COMPONENTS */}
              {(activeFilter === 'all' || activeFilter === 'products') && watchedProducts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <span>Saved Store Components ({watchedProducts.length})</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {watchedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3 flex flex-col justify-between space-y-2.5 transition-all group"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg border border-slate-700 shrink-0 bg-white/5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
                                {product.category}
                              </span>
                              <button
                                onClick={() => onToggleWatchlistProduct(product.id)}
                                className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors"
                                title="Remove from Watchlist"
                              >
                                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                              </button>
                            </div>
                            <h4 className="font-bold text-xs text-white line-clamp-1 mt-0.5">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm font-extrabold text-emerald-400">
                                ₹{product.price}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  product.inStock
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-rose-500/20 text-rose-300'
                                }`}
                              >
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onAddToCart(product)}
                          disabled={!product.inStock}
                          className={`w-full py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                            product.inStock
                              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Saved items remain synced across your sessions.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
          >
            Close Watchlist
          </button>
        </div>

      </div>
    </div>
  );
};
