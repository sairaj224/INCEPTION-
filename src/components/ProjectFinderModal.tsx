import React, { useState } from 'react';
import { Sparkles, X, IndianRupee, ArrowRight, Loader2, CheckCircle, Zap } from 'lucide-react';
import { AIRecommendation } from '../types';
import { fetchAiRecommendations } from '../lib/api';

interface ProjectFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedProject: (recommendation: AIRecommendation) => void;
}

export const ProjectFinderModal: React.FC<ProjectFinderModalProps> = ({
  isOpen,
  onClose,
  onSelectRecommendedProject,
}) => {
  const [budget, setBudget] = useState<number>(500);
  const [interest, setInterest] = useState<string>('Sensors & Safety');
  const [skillLevel, setSkillLevel] = useState<string>('Beginner');
  const [customGoal, setCustomGoal] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<AIRecommendation[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const recommendations = await fetchAiRecommendations({
        budget,
        interest,
        skillLevel,
        customizedGoal: customGoal,
      });
      setResults(recommendations);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setErrorMessage(err.message || 'Validation or network error during recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col text-slate-100">
        
        {/* Modal Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">"I Don't Know What to Build" AI Assistant</h2>
              <p className="text-xs text-slate-400">Tell us your budget and interests — AI will match 3 perfect engineering projects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
          {!results ? (
            <div className="space-y-6">
              
              {/* Target Budget Slider & User Input */}
              <div>
                <div className="flex justify-between items-center mb-2 gap-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center space-x-1">
                    <IndianRupee className="w-4 h-4 text-cyan-400" />
                    <span>Target Budget Limit (INR ₹)</span>
                  </label>
                  <div className="flex items-center space-x-1 bg-slate-950 border border-cyan-500/40 rounded-lg px-2.5 py-1 focus-within:ring-2 focus-within:ring-cyan-400">
                    <span className="text-cyan-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="10"
                      value={budget}
                      onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
                      className="w-20 bg-transparent text-cyan-300 font-bold text-sm focus:outline-none text-right font-mono"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                  <button 
                    type="button" 
                    onClick={() => setBudget(300)} 
                    className="hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    ₹300 (Micro)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setBudget(1000)} 
                    className="hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    ₹1,000 (Standard)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setBudget(2000)} 
                    className="hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    ₹2,000 (Advanced)
                  </button>
                </div>
              </div>

              {/* Interest Areas */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Primary Interest Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Sensors & Safety',
                    'Cloud IoT',
                    'Automation',
                    'Robotics',
                    'Audio & Displays',
                    'Agriculture Tech',
                  ].map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setInterest(area)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-left ${
                        interest === area
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700/60'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Level Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Target Skill Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { level: 'Beginner', desc: '1-2 hrs • Core circuits' },
                    { level: 'Intermediate', desc: '2-4 hrs • Cloud & I2C' },
                    { level: 'Advanced', desc: '4+ hrs • Multi-node IoT' },
                  ].map((item) => (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => setSkillLevel(item.level)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        skillLevel === item.level
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/50 ring-1 ring-cyan-500/50'
                          : 'bg-slate-800/40 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-sm text-white">{item.level}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Custom Goal */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1">
                  Custom Request or Goal (Optional)
                </label>
                <input
                  type="text"
                  placeholder='e.g., "I want to build something for my college hostel room"'
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Analyzing Budget & Microcontroller Options...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    <span>Find My Ideal Project Options</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300 font-medium">
                  Based on your <span className="text-cyan-400 font-bold">₹{budget}</span> budget and interest in{' '}
                  <span className="text-indigo-400 font-bold">{interest}</span>:
                </p>
                <button
                  onClick={() => setResults(null)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Adjust Filters
                </button>
              </div>

              <div className="grid gap-4">
                {results.map((rec, index) => (
                  <div
                    key={index}
                    className="p-5 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl transition-all group hover:shadow-lg hover:shadow-cyan-500/5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {rec.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-bold rounded-lg border border-emerald-500/20">
                          ₹{rec.budget}
                        </span>
                        <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded-lg">
                          {rec.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded-lg">
                          {rec.timeCommitment}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">{rec.summary}</p>

                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 mb-3 text-xs text-slate-400 space-y-1">
                      <div className="flex items-center space-x-1.5 text-cyan-300 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Why this fits:</span>
                      </div>
                      <p className="text-slate-300">{rec.whyRecommended}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                      <div className="flex flex-wrap gap-1.5">
                        {rec.coreComponents.map((comp, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] rounded-md font-mono"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          onSelectRecommendedProject(rec);
                          onClose();
                        }}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                      >
                        <span>Open Project Page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
