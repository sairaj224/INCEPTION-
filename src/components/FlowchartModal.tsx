import React, { useState } from 'react';
import { X, Download, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Share2, Layers, Compass, Sparkles, ShoppingBag, Wrench, Truck } from 'lucide-react';

interface FlowchartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlowchartModal: React.FC<FlowchartModalProps> = ({ isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/user_interaction_flowchart.svg';
    link.download = 'Inception_AI_User_Interaction_Flowchart.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenFull = () => {
    window.open('/user_interaction_flowchart.svg', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
                <span>Inception AI • User Interaction Flowchart</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Vector Graphic
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Step-by-step user journey from AI discovery to campus hostel delivery</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-2 text-slate-300">{Math.round(zoomLevel * 100)}%</span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setZoomLevel(1)}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition active:scale-95"
              title="Download High-Resolution SVG Image"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Image</span>
            </button>

            {/* Open in New Tab */}
            <button
              onClick={handleOpenFull}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
              title="Open full-resolution image in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 hover:text-rose-300 border border-slate-700 text-slate-400 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Legend Bar */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] overflow-x-auto shrink-0 gap-3">
          <div className="flex items-center space-x-4 min-w-max">
            <span className="text-slate-400 font-semibold">User Interaction Stages:</span>
            <span className="flex items-center space-x-1.5 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>1. Onboarding &amp; .EDU Auth</span>
            </span>
            <span className="flex items-center space-x-1.5 text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>2. AI Project Discovery &amp; Debugger</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>3. Smart BOM &amp; Campus Checkout</span>
            </span>
            <span className="flex items-center space-x-1.5 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>4. Hardware QA &amp; Hostel Delivery</span>
            </span>
          </div>
          <span className="text-slate-400 hidden lg:inline">Scroll or pinch to inspect details</span>
        </div>

        {/* Image Canvas Viewer */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#070b14]">
          <div 
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
            className="w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden border border-slate-800"
          >
            <img 
              src="/user_interaction_flowchart.svg" 
              alt="Inception AI Complete User Interaction Flowchart"
              className="w-full h-auto block select-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>High-res vector diagram ready for presentations, reports, and documentation.</span>
          </div>
          <button
            onClick={handleDownload}
            className="text-blue-400 hover:text-blue-300 font-semibold underline"
          >
            Save image file (.svg)
          </button>
        </div>
      </div>
    </div>
  );
};
