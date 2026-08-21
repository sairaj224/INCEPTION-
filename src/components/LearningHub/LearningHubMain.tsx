import React, { useState } from 'react';
import { BookOpen, Award, Activity, Cpu, Video, Wrench, X, Sparkles, Compass } from 'lucide-react';
import { LearningPathView } from './LearningPathView';
import { SensorExplorerView } from './SensorExplorerView';
import { MicrocontrollerPinoutView } from './MicrocontrollerPinoutView';
import { PracticalGuidesView } from './PracticalGuidesView';
import { VideoLesson } from '../../types';

interface LearningHubMainProps {
  onBackToDashboard?: () => void;
}

export const LearningHubMain: React.FC<LearningHubMainProps> = ({ onBackToDashboard }) => {
  const [activeSubTab, setActiveSubTab] = useState<'path' | 'sensors' | 'microcontrollers' | 'practical'>('path');
  const [activeVideoModal, setActiveVideoModal] = useState<VideoLesson | null>(null);

  const subTabs = [
    { id: 'path', label: 'Learning Path', icon: Award, badge: '7 Stages' },
    { id: 'sensors', label: 'Sensor Explorer', icon: Activity, badge: 'Live Sim & Videos' },
    { id: 'microcontrollers', label: 'Microcontrollers & Pinouts', icon: Cpu, badge: 'Interactive' },
    { id: 'practical', label: 'Wiring & Logic Checker', icon: Wrench, badge: 'Matchmaker' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Learning Hub Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        
        {/* Title & Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                InspectionLabs Learning Hub
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Interactive
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive electronics, microcontroller pinouts, sensor physics & IoT architecture
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation Switcher */}
        <div className="flex items-center space-x-1 overflow-x-auto p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Sub-Tab View Content */}
      <div>
        {activeSubTab === 'path' && <LearningPathView onOpenVideoModal={(v) => setActiveVideoModal(v)} />}
        {activeSubTab === 'sensors' && <SensorExplorerView onOpenVideoModal={(v) => setActiveVideoModal(v)} />}
        {activeSubTab === 'microcontrollers' && <MicrocontrollerPinoutView onOpenVideoModal={(v) => setActiveVideoModal(v)} />}
        {activeSubTab === 'practical' && <PracticalGuidesView />}
      </div>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 text-slate-200">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
                  {activeVideoModal.category}
                </span>
                <h3 className="font-bold text-white text-xs sm:text-sm truncate">
                  {activeVideoModal.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Responsive Embed */}
            <div className="px-4 sm:px-6">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border border-slate-800">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Video Metadata & Takeaway Notes */}
            <div className="p-4 sm:p-6 space-y-3 pt-0 text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Channel: <strong className="text-slate-200">{activeVideoModal.channel}</strong></span>
                <span>Duration: <strong className="text-slate-200 font-mono">{activeVideoModal.duration}</strong></span>
              </div>

              <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {activeVideoModal.summary}
              </p>

              {activeVideoModal.keyTakeaways.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-200 text-[11px] uppercase tracking-wider">
                    Key Concept Takeaways:
                  </span>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
                    {activeVideoModal.keyTakeaways.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                Close Video Lesson
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
