import React, { useState } from 'react';
import { Project } from '../types';
import { Clock, IndianRupee, ArrowRight, Layers, Sparkles, Heart, Image as ImageIcon } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { ImageChangeModal } from './ImageChangeModal';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (project: Project) => void;
  ownedProductsCount: number;
  isWatched?: boolean;
  onToggleWatchlist?: (projectId: string) => void;
  onChangePhoto?: (projectId: string, newPhotoUrl: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
  ownedProductsCount,
  isWatched = false,
  onToggleWatchlist,
  onChangePhoto,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Calculate total BOM cost vs owned items cost
  const totalBomProducts = project.bom.length;

  return (
    <div
      onClick={() => onSelectProject(project)}
      className="group relative bg-white border border-slate-200 hover:border-blue-400 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer text-slate-800"
    >
      {/* Hero Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <OptimizedImage
          src={project.heroImage}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Change Photo Overlay Button */}
        {onChangePhoto && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-xs backdrop-blur-md border border-slate-700/80 shadow-md flex items-center space-x-1.5 z-10 opacity-90 hover:opacity-100 transition-all"
            title="Change Project Photo"
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Change Photo</span>
          </button>
        )}

        {/* Badges on Top */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded uppercase ${
              project.difficulty === 'Beginner'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : project.difficulty === 'Intermediate'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            {project.difficulty}
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-white/90 text-slate-700 border border-slate-200 shadow-sm">
            {project.domain}
          </span>
        </div>



        {/* Watchlist Bookmark Button Overlay */}
        {onToggleWatchlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(project.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-md ${
              isWatched
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-slate-900/60 text-slate-200 hover:bg-slate-900 hover:text-rose-400'
            }`}
            title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Heart className={`w-4 h-4 ${isWatched ? 'fill-white' : ''}`} />
          </button>
        )}

        {/* Price Tag Overlay at Bottom Right */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-md">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>₹{project.estimatedBudget}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {project.subtitle}
          </p>
        </div>

        {/* Features & Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{project.estimatedHours} Hours Build</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>{totalBomProducts} Parts in BOM</span>
          </div>
        </div>

        {/* Owned Items Discount Callout if any */}
        {ownedProductsCount > 0 && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
            <div className="flex items-center space-x-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>You own parts in this BOM!</span>
            </div>
            <span className="font-bold text-emerald-700">Save Money</span>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-500 font-mono">
            {project.quiz.length} Quiz Questions
          </span>
          <div className="flex items-center space-x-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>Inspect Project</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Image Change Modal */}
      {isModalOpen && onChangePhoto && (
        <ImageChangeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Change Photo for ${project.title}`}
          currentImageUrl={project.heroImage}
          onSaveImage={(newUrl) => {
            onChangePhoto(project.id, newUrl);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
