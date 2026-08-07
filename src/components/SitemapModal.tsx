import React, { useState } from 'react';
import { X, Globe, Copy, Check, Download, ExternalLink, Cpu, BookOpen, Layers } from 'lucide-react';
import { Product, Project } from '../types';
import { createSlug, generateXmlSitemap } from '../lib/seo';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  projects: Project[];
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  products,
  projects,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const baseUrl = window.location.origin;
  const categories: string[] = Array.from(new Set(products.map((p) => p.category)));

  const handleDownloadXml = () => {
    const xmlContent = generateXmlSitemap(products, projects);
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Store Sitemap & Search Index</h2>
              <p className="text-xs text-slate-400">SEO URLs, structured routes, and sitemap.xml generator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* XML Download Action Bar */}
          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-white block">Google & Search Engine Crawling XML Sitemap</span>
              <span className="text-[11px] text-slate-400">
                Generated {products.length + projects.length + 3} indexed URLs with canonical priorities.
              </span>
            </div>
            <button
              onClick={handleDownloadXml}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download sitemap.xml</span>
            </button>
          </div>

          {/* Section 1: Core Navigation Routes */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-sm flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Main Store Navigation Routes</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { name: 'Store Homepage & Catalog', url: `${baseUrl}/` },
                { name: 'Hardware Component Marketplace', url: `${baseUrl}/?tab=marketplace` },
                { name: 'IoT Student Lab Projects', url: `${baseUrl}/?tab=projects` },
              ].map((route) => (
                <div
                  key={route.url}
                  className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white block">{route.name}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[200px] block">{route.url}</span>
                  </div>
                  <button
                    onClick={() => handleCopyUrl(route.url)}
                    className="p-1.5 bg-slate-700/60 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                    title="Copy SEO Link"
                  >
                    {copiedUrl === route.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Electronics Component Categories */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-sm flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Component Categories ({categories.length})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const catUrl = `${baseUrl}/?category=${encodeURIComponent(cat)}`;
                return (
                  <div
                    key={cat}
                    className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl flex items-center space-x-2"
                  >
                    <span className="font-semibold text-slate-200">{cat}</span>
                    <button
                      onClick={() => handleCopyUrl(catUrl)}
                      className="text-slate-400 hover:text-white"
                      title="Copy Category Link"
                    >
                      {copiedUrl === catUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Direct Component Product URLs */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-sm flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Indexed Hardware Items ({products.length})</span>
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {products.map((p) => {
                const prodUrl = `${baseUrl}/?product=${createSlug(p.name)}`;
                return (
                  <div
                    key={p.id}
                    className="p-2.5 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center space-x-2.5">
                      <img src={p.image} alt={p.name} className="w-7 h-7 rounded object-cover border border-slate-700" />
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-slate-400 text-[10px]">₹{p.price} • {p.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyUrl(prodUrl)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-[10px] font-bold flex items-center space-x-1"
                    >
                      {copiedUrl === prodUrl ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy SEO Link</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Student Project Guides */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-sm flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Lab Projects & Guides ({projects.length})</span>
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {projects.map((proj) => {
                const projUrl = `${baseUrl}/?project=${createSlug(proj.title)}`;
                return (
                  <div
                    key={proj.id}
                    className="p-2.5 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between text-[11px]"
                  >
                    <span className="font-bold text-white">{proj.title}</span>
                    <button
                      onClick={() => handleCopyUrl(projUrl)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-[10px] font-bold flex items-center space-x-1"
                    >
                      {copiedUrl === projUrl ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
          >
            Close Sitemap
          </button>
        </div>

      </div>
    </div>
  );
};
