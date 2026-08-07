import React, { useState } from 'react';
import { ImageOff, Sparkles } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio,
  fallbackSrc = DEFAULT_FALLBACK,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Helper to optimize unsplash URLs with CDN parameters
  const getOptimizedSrc = (url: string) => {
    if (!url) return fallbackSrc;
    if (url.includes('images.unsplash.com') && !url.includes('q=')) {
      const joiner = url.includes('?') ? '&' : '?';
      return `${url}${joiner}auto=format&fit=crop&w=800&q=80`;
    }
    return url;
  };

  const finalSrc = hasError ? fallbackSrc : getOptimizedSrc(src);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center text-slate-600">
          <Sparkles className="w-5 h-5 opacity-40 animate-spin" />
        </div>
      )}

      {/* Actual Image with Native Lazy Loading */}
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />

      {/* Error Fallback Icon Overlay */}
      {hasError && (
        <div className="absolute bottom-1 right-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[9px] text-amber-400 border border-slate-800 flex items-center space-x-1">
          <ImageOff className="w-2.5 h-2.5" />
          <span>Fallback Image</span>
        </div>
      )}
    </div>
  );
};
