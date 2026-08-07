import React, { useState } from 'react';
import { Project, Product, BOMItem } from '../types';
import { fetchAiTroubleshoot } from '../lib/api';
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Play,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  Terminal,
  Cpu,
  RefreshCw,
  Loader2,
  ShoppingCart,
  IndianRupee,
  Award,
  AlertCircle,
  Heart
} from 'lucide-react';
import { ComponentExplainerModal } from './ComponentExplainerModal';
import { ImageChangeModal } from './ImageChangeModal';
import { Image as ImageIcon } from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
  productsMap: Map<string, Product>;
  onBack: () => void;
  ownedProductIds: Set<string>;
  onToggleOwnedProduct: (productId: string) => void;
  onAddBomToCart: (items: { product: Product; quantity: number }[]) => void;
  isWatched?: boolean;
  onToggleWatchlist?: (projectId: string) => void;
  onChangePhoto?: (projectId: string, newPhotoUrl: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  productsMap,
  onBack,
  ownedProductIds,
  onToggleOwnedProduct,
  onAddBomToCart,
  isWatched = false,
  onToggleWatchlist,
  onChangePhoto,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'quiz' | 'bom' | 'wiring' | 'code' | 'simulation' | 'troubleshoot'>('overview');
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Component Explainer Modal state
  const [selectedProductForGuide, setSelectedProductForGuide] = useState<Product | null>(null);

  // Copy code state
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // Budget Swap alternatives state
  const [swappedAlternatives, setSwappedAlternatives] = useState<Record<string, string>>({});

  // Simulation State
  const [simInputs, setSimInputs] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    project.simulationConfig.inputs.forEach((inp) => {
      init[inp.id] = inp.defaultValue;
    });
    return init;
  });
  const [simLogs, setSimLogs] = useState<string[]>(project.simulationConfig.initialLogs);

  // Troubleshooting state
  const [problemInput, setProblemInput] = useState<string>('');
  const [loadingTroubleshoot, setLoadingTroubleshoot] = useState<boolean>(false);
  const [troubleshootResult, setTroubleshootResult] = useState<any>(null);

  // Calculate BOM Costs
  let rawTotalCost = 0;
  let netCostWithOwned = 0;
  const currentBomItems: { product: Product; quantity: number; isOwned: boolean; alternativeProduct?: Product }[] = [];

  project.bom.forEach((item: BOMItem) => {
    const activeProdId = swappedAlternatives[item.productId] || item.productId;
    const prod = productsMap.get(activeProdId) || productsMap.get(item.productId);
    if (prod) {
      const isOwned = ownedProductIds.has(prod.id);
      const itemCost = prod.price * item.quantity;
      rawTotalCost += itemCost;
      if (!isOwned) {
        netCostWithOwned += itemCost;
      }
      currentBomItems.push({
        product: prod,
        quantity: item.quantity,
        isOwned,
        alternativeProduct: item.alternativeProductId ? productsMap.get(item.alternativeProductId) : undefined,
      });
    }
  });

  const savingsAmount = rawTotalCost - netCostWithOwned;

  // Handle Quiz Submission
  const handleQuizSubmit = () => {
    let correctCount = 0;
    project.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const percent = Math.round((correctCount / project.quiz.length) * 100);
    setQuizScore(percent);
    setQuizSubmitted(true);
    if (percent >= 60) {
      setQuizPassed(true);
    }
  };

  // Run Simulation Logic
  const simResult = project.simulationConfig.simulationCode(simInputs);

  const handleSimInputChange = (id: string, val: number) => {
    const nextInputs = { ...simInputs, [id]: val };
    setSimInputs(nextInputs);
    const updatedRes = project.simulationConfig.simulationCode(nextInputs);
    if (updatedRes.logMessage) {
      setSimLogs((prev) => [updatedRes.logMessage!, ...prev.slice(0, 8)]);
    }
  };

  // Handle Copy Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.codeSnippet.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Handle Troubleshooting Request
  const handleTroubleshoot = async () => {
    if (!problemInput.trim()) return;
    setLoadingTroubleshoot(true);
    try {
      const result = await fetchAiTroubleshoot({
        problemStatement: problemInput,
        projectTitle: project.title,
        componentList: project.bom.map((b) => productsMap.get(b.productId)?.name).filter((name): name is string => Boolean(name)),
      });
      setTroubleshootResult(result);
    } catch (err) {
      console.error('Troubleshooting error:', err);
    } finally {
      setLoadingTroubleshoot(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Bar Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Workspace</span>
        </button>

        {/* Quick Quiz Status Banner */}
        <div className="flex items-center space-x-2">
          {quizPassed ? (
            <span className="flex items-center space-x-1 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-lg shadow-sm">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Verified Scholar Unlocked</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs rounded-lg shadow-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Skill Quiz Pending (Score ≥60% to unlock verification)</span>
            </span>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm text-white">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Hero Content Overlay */}
          {onChangePhoto && (
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-xs backdrop-blur-md border border-slate-700 shadow-md flex items-center space-x-1.5 transition-all z-20"
            >
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>Change Project Hero Photo</span>
            </button>
          )}

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
                {project.difficulty}
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">
                {project.domain}
              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center space-x-1 overflow-x-auto p-2 bg-slate-800/80 border-t border-slate-800 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Learning' },
            { id: 'quiz', label: `Skill Quiz (${project.quiz.length} Qs)`, badge: quizPassed ? '✅' : 'Required' },
            { id: 'bom', label: 'Smart BOM & Budget', badge: savingsAmount > 0 ? `Saved ₹${savingsAmount}` : undefined },
            { id: 'wiring', label: 'Pinout & Wiring' },
            { id: 'code', label: 'Embedded C++ Code' },
            { id: 'simulation', label: 'Interactive Simulation' },
            { id: 'troubleshoot', label: 'AI Troubleshooter' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 text-[10px] bg-slate-900 text-blue-300 rounded border border-slate-700">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview & Learning */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 text-slate-800">
              <h3 className="text-lg font-bold text-slate-900">Project Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>

              <h4 className="text-sm font-bold text-blue-600 pt-2">Core Learning Objectives</h4>
              <ul className="space-y-2">
                {project.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* E-Waste & Sustainability Score */}
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-3 text-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>🌱 E-Waste Impact Score</span>
                </span>
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded">
                  {project.eWasteScore.reusablePercent}% Reusable
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-emerald-200 shadow-sm">
                  <div className="text-slate-500">Reusable Parts</div>
                  <div className="font-bold text-slate-900 text-sm">{project.eWasteScore.reusablePercent}%</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-emerald-200 shadow-sm">
                  <div className="text-slate-500">Packaging</div>
                  <div className="font-bold text-slate-900 text-sm">Recyclable</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-emerald-200 shadow-sm">
                  <div className="text-slate-500">Carbon Footprint</div>
                  <div className="font-bold text-slate-900 text-sm">{project.eWasteScore.carbonFootprint}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Panel */}
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 text-slate-800">
              <h3 className="text-base font-bold text-slate-900">Project Specs</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Total Net Budget</span>
                  <span className="font-bold text-blue-600 text-sm font-mono">₹{netCostWithOwned}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Estimated Build Time</span>
                  <span className="font-bold text-slate-800">{project.estimatedHours} Hours</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">BOM Parts Count</span>
                  <span className="font-bold text-slate-800">{project.bom.length} Components</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <span>Take Skill Quiz & Unlock BOM</span>
              </button>

              <button
                onClick={() => {
                  onAddBomToCart(
                    currentBomItems
                      .filter((i) => !i.isOwned)
                      .map((i) => ({ product: i.product, quantity: i.quantity }))
                  );
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <span>Add Filtered BOM to Cart (₹{netCostWithOwned})</span>
              </button>

              {onToggleWatchlist && (
                <button
                  type="button"
                  onClick={() => onToggleWatchlist(project.id)}
                  className={`w-full py-2.5 px-4 rounded-lg border font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs ${
                    isWatched
                      ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWatched ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
                  <span>{isWatched ? 'Saved in Watchlist' : 'Save to Watchlist'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skill Assessment Quiz */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Skill Assessment Quiz</h3>
              <p className="text-xs text-slate-500">Test your understanding before ordering components (Score ≥60% to unlock)</p>
            </div>
            {quizSubmitted && (
              <span
                className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                  quizPassed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                Score: {quizScore}% {quizPassed ? '(Passed)' : '(Retry Needed)'}
              </span>
            )}
          </div>

          <div className="space-y-6">
            {project.quiz.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug">{q.question}</h4>
                </div>

                <div className="grid gap-2 pl-8">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[q.id] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;
                    
                    let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                    if (isSelected) {
                      btnStyle = 'bg-blue-600 text-white border-blue-600 font-semibold';
                    }
                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-100 text-rose-900 border-rose-300';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                        className={`w-full p-3 text-xs text-left rounded-lg border transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="ml-8 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-blue-600">Explanation:</span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {quizSubmitted ? (
              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center space-x-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>
            ) : (
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < project.quiz.length}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-sm"
              >
                Submit Quiz Answers
              </button>
            )}

            {quizPassed && (
              <button
                onClick={() => setActiveTab('bom')}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center space-x-2 shadow-sm"
              >
                <span>Proceed to Smart BOM</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Smart BOM & Budget Customizer */}
      {activeTab === 'bom' && (
        <div className="space-y-6">
          
          {/* Header Banner for Savings */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Smart Bill of Materials (BOM)</span>
                <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                  Interactive
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Check off components you already own to recalculate your net cost.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs text-slate-400">Original Total: <span className="line-through">₹{rawTotalCost}</span></div>
                <div className="text-lg font-extrabold text-blue-400 font-mono">Net Cost: ₹{netCostWithOwned}</div>
              </div>

              <button
                onClick={() => {
                  onAddBomToCart(
                    currentBomItems
                      .filter((i) => !i.isOwned)
                      .map((i) => ({ product: i.product, quantity: i.quantity }))
                  );
                }}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Needed Parts to Cart</span>
              </button>
            </div>
          </div>

          {/* BOM Itemized Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm text-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">I Already Have This</th>
                    <th className="p-4">Component</th>
                    <th className="p-4">Unit Price</th>
                    <th className="p-4">Qty</th>
                    <th className="p-4">Subtotal</th>
                    <th className="p-4 text-right">Educational Guide</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentBomItems.map((item, idx) => {
                    const subtotal = item.product.price * item.quantity;
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          item.isOwned ? 'bg-emerald-50/60 text-slate-400' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        {/* "Own Components" Checkbox */}
                        <td className="p-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isOwned}
                              onChange={() => onToggleOwnedProduct(item.product.id)}
                              className="w-4 h-4 rounded text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
                            />
                            <span className={item.isOwned ? 'line-through text-emerald-700 font-semibold' : ''}>
                              {item.isOwned ? 'Owned (Deducted)' : 'Need to Buy'}
                            </span>
                          </label>
                        </td>

                        {/* Product info */}
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-xs">{item.product.name}</div>
                              {item.alternativeProduct && (
                                <button
                                  onClick={() => {
                                    const currentSwapped = swappedAlternatives[item.product.id];
                                    const nextId = currentSwapped ? '' : item.alternativeProduct!.id;
                                    setSwappedAlternatives({ ...swappedAlternatives, [item.product.id]: nextId });
                                  }}
                                  className="text-[11px] text-blue-600 hover:underline flex items-center space-x-1 mt-0.5 font-medium"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>
                                    Swap for {item.alternativeProduct.name} (₹{item.alternativeProduct.price})
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-slate-700">₹{item.product.price}</td>
                        <td className="p-4 font-mono text-slate-700">{item.quantity}</td>
                        <td className="p-4 font-mono font-bold text-blue-600">
                          {item.isOwned ? <span className="line-through text-slate-400">₹{subtotal}</span> : `₹${subtotal}`}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedProductForGuide(item.product)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-semibold transition-all inline-flex items-center space-x-1"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Why do I need this?</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Pinout & Wiring Table */}
      {activeTab === 'wiring' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Circuit Pinout & Wiring Table</h3>
              <p className="text-xs text-slate-500">Follow wire color coding to avoid short circuits or reversed polarity</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Component Module</th>
                  <th className="p-3.5">Component Pin</th>
                  <th className="p-3.5">Microcontroller Pin</th>
                  <th className="p-3.5">Recommended Wire Color</th>
                  <th className="p-3.5">Wiring Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.pinoutTable.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 text-slate-800">
                    <td className="p-3.5 font-bold text-slate-900">{p.componentName}</td>
                    <td className="p-3.5 font-mono text-blue-600 font-semibold">{p.componentPin}</td>
                    <td className="p-3.5 font-mono text-slate-700 font-semibold">{p.boardPin}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-mono">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              (p.wireColor || '').toLowerCase() === 'red'
                                ? '#ef4444'
                                : (p.wireColor || '').toLowerCase() === 'black'
                                ? '#1e293b'
                                : (p.wireColor || '').toLowerCase() === 'yellow'
                                ? '#eab308'
                                : (p.wireColor || '').toLowerCase() === 'blue'
                                ? '#3b82f6'
                                : (p.wireColor || '').toLowerCase() === 'green'
                                ? '#22c55e'
                                : '#a855f7',
                          }}
                        />
                        <span>{p.wireColor}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px]">{p.note || 'Standard connection'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Embedded C++ Code Studio */}
      {activeTab === 'code' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-blue-600" />
                <span>{project.codeSnippet.filename}</span>
              </h3>
              <p className="text-xs text-slate-500">Arduino IDE / PlatformIO C++ firmware code</p>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
            >
              {codeCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{codeCopied ? 'Code Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-bold text-blue-600">Code Logic Breakdown:</span> {project.codeSnippet.explanation}
          </p>

          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed shadow-sm">
            {project.codeSnippet.code}
          </pre>
        </div>
      )}

      {/* Tab 6: Interactive Wokwi Simulation Sandbox */}
      {activeTab === 'simulation' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Play className="w-5 h-5 text-blue-600 fill-blue-600" />
                <span>Interactive Hardware Simulator</span>
              </h3>
              <p className="text-xs text-slate-500">Simulate sensor inputs before buying components to test logic response</p>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-md border border-emerald-200">
              ● Live Engine Running
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input Sliders */}
            <div className="space-y-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">Hardware Inputs (Adjust Controls)</h4>
              {project.simulationConfig.inputs.map((inp) => (
                <div key={inp.id} className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{inp.label}</span>
                    <span className="text-blue-600 font-bold font-mono">
                      {simInputs[inp.id]} {inp.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={inp.min}
                    max={inp.max}
                    value={simInputs[inp.id]}
                    onChange={(e) => handleSimInputChange(inp.id, Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              ))}
            </div>

            {/* Output State Views */}
            <div className="space-y-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">Live Hardware Actuator Outputs</h4>
              <div className="space-y-3">
                {project.simulationConfig.outputs.map((out) => {
                  const stateVal = simResult.outputsState[out.id];
                  const isActive = Boolean(stateVal);

                  return (
                    <div
                      key={out.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isActive
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="font-semibold">{out.label}</span>
                      <span className="font-mono font-bold">
                        {typeof stateVal === 'string' ? stateVal : isActive ? 'ACTIVE / HIGH' : 'OFF / LOW'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Serial Monitor Log Stream */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>SERIAL MONITOR LOG STREAM (115200 BAUD)</span>
              <button onClick={() => setSimLogs([])} className="hover:text-white">Clear</button>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto font-mono text-[11px] text-blue-400">
              {simLogs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: AI Troubleshooting Assistant */}
      {activeTab === 'troubleshoot' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>AI Circuit & Code Troubleshooter</span>
              </h3>
              <p className="text-xs text-slate-500">Describe what is going wrong (e.g., "LED isn't blinking", "Serial monitor printing junk")</p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              rows={3}
              value={problemInput}
              onChange={(e) => setProblemInput(e.target.value)}
              placeholder='e.g., "My OLED screen remains blank even when plugged in", "I get error compiling for board ESP32"'
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />

            <button
              onClick={handleTroubleshoot}
              disabled={loadingTroubleshoot || !problemInput.trim()}
              className="py-2.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              {loadingTroubleshoot ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Diagnosing Hardware Logic & Code...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-white fill-white" />
                  <span>Diagnose Problem with AI</span>
                </>
              )}
            </button>

            {troubleshootResult && (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                <div className="font-bold text-blue-700 text-sm">
                  Diagnosis: {troubleshootResult.diagnosis}
                </div>

                <div className="grid gap-3">
                  {troubleshootResult.checks?.map((chk: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-white border border-slate-200 space-y-1 shadow-sm">
                      <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span>{chk.title}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] pl-6">{chk.detail}</p>
                    </div>
                  ))}
                </div>

                {troubleshootResult.codeFixSuggestion && (
                  <div className="p-3 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto space-y-1">
                    <span className="font-bold text-emerald-400">Suggested Fix:</span>
                    <pre>{troubleshootResult.codeFixSuggestion}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Component Explainer Modal */}
      <ComponentExplainerModal
        product={selectedProductForGuide}
        onClose={() => setSelectedProductForGuide(null)}
      />

      {/* Image Change Modal */}
      {isImageModalOpen && onChangePhoto && (
        <ImageChangeModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          title={`Change Hero Photo: ${project.title}`}
          currentImageUrl={project.heroImage}
          onSaveImage={(newUrl) => {
            onChangePhoto(project.id, newUrl);
            setIsImageModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
