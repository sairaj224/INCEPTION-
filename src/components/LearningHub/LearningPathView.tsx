import React, { useState } from 'react';
import { Award, CheckCircle2, ChevronRight, HelpCircle, Zap, Cpu, Activity, Layers, Radio, Wifi, BookOpen, Sparkles, Check, ArrowRight, Play, Clock } from 'lucide-react';
import { LearningPathStage, VideoLesson } from '../../types';
import { LEARNING_PATH_STAGES } from '../../data/learningPathData';

interface LearningPathViewProps {
  onOpenVideoModal?: (video: VideoLesson) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({ onOpenVideoModal }) => {
  const [activeStageId, setActiveStageId] = useState<string>(LEARNING_PATH_STAGES[0].id);
  const [completedStages, setCompletedStages] = useState<Record<string, boolean>>({
    'stage-1-basics': true,
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const activeStage = LEARNING_PATH_STAGES.find((s) => s.id === activeStageId) || LEARNING_PATH_STAGES[0];

  const handleSelectQuizOption = (stageId: string, optionIndex: number) => {
    if (quizSubmitted[stageId]) return;
    setQuizAnswers((prev) => ({ ...prev, [stageId]: optionIndex }));
  };

  const handleSubmitQuiz = (stage: LearningPathStage) => {
    const chosenIndex = quizAnswers[stage.id];
    if (chosenIndex === undefined || chosenIndex === null) return;
    
    setQuizSubmitted((prev) => ({ ...prev, [stage.id]: true }));
    if (chosenIndex === stage.quiz.correctIndex) {
      setCompletedStages((prev) => ({ ...prev, [stage.id]: true }));
    }
  };

  const getStageIcon = (stageNumber: number) => {
    switch (stageNumber) {
      case 1: return Zap;
      case 2: return Cpu;
      case 3: return Activity;
      case 4: return Layers;
      case 5: return Radio;
      case 6: return Wifi;
      case 7: return Award;
      default: return BookOpen;
    }
  };

  const completedCount = Object.values(completedStages).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / LEARNING_PATH_STAGES.length) * 100);

  return (
    <div className="space-y-8">
      
      {/* Top Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 text-white space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
          <Award className="w-3.5 h-3.5 text-indigo-300" />
          <span>Curated 7-Stage Engineering Learning Path</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Basics ➔ Components ➔ Sensors ➔ Microcontrollers ➔ Protocols ➔ IoT ➔ Projects
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Follow a structured curriculum designed by university robotics faculty and embedded engineers. Complete concepts, pass interactive knowledge check quizzes, and earn hardware engineering master badges.
        </p>

        {/* Progress Bar */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">
              Curriculum Progress: {completedCount} of {LEARNING_PATH_STAGES.length} Stages Mastered
            </span>
            <span className="font-mono font-bold text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 7-Stage Interactive Progression Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {LEARNING_PATH_STAGES.map((stage) => {
          const Icon = getStageIcon(stage.stageNumber);
          const isSelected = stage.id === activeStage.id;
          const isDone = completedStages[stage.id];

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-400 text-white shadow-lg'
                  : isDone
                  ? 'bg-slate-900 border-emerald-500/50 text-slate-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-indigo-300">
                  {stage.stageNumber}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">{stage.estimatedMinutes}m</span>
                )}
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-slate-200 truncate">{stage.badgeName}</h4>
                <span className="text-[10px] text-slate-400 truncate block">{stage.title.split('. ')[1]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Master Content */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 text-slate-200 shadow-xl">
        
        {/* Stage Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[11px] font-mono font-bold">
                STAGE {activeStage.stageNumber} OF 7
              </span>
              <span className="text-xs text-slate-400">⏱ Est. Time: {activeStage.estimatedMinutes} mins</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {activeStage.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {activeStage.shortSummary}
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <Award className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="text-left">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Stage Reward:</span>
              <span className="text-xs font-bold text-amber-300">{activeStage.badgeName} Badge</span>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Key Learning Outcomes
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {activeStage.learningObjectives.map((obj, i) => (
              <div key={i} className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Concepts Breakdown */}
        <div className="space-y-4 pt-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            In-Depth Engineering Concepts
          </h4>

          <div className="space-y-4">
            {activeStage.keyConcepts.map((concept, i) => (
              <div key={i} className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h5 className="font-bold text-white text-sm text-indigo-300">
                  {i + 1}. {concept.heading}
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {concept.explanation}
                </p>
                <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-indigo-200 text-xs flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Practical Rule:</strong> {concept.practicalTakeaway}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorial for this stage */}
        {activeStage.videos && activeStage.videos.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
              <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>Recommended Video Lesson for Stage {activeStage.stageNumber}</span>
            </h4>

            <div className="space-y-2">
              {activeStage.videos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                        {vid.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{vid.duration}</span>
                      </span>
                    </div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">{vid.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{vid.summary}</p>
                    <div className="text-[10px] text-indigo-400 font-mono">
                      Channel: {vid.channel}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenVideoModal && onOpenVideoModal(vid)}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-2 shrink-0 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch Video Lesson</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Knowledge Check Quiz */}
        <div className="rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Stage Knowledge Check Quiz
            </h4>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {activeStage.quiz.question}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {activeStage.quiz.options.map((opt, optIdx) => {
              const isSelected = quizAnswers[activeStage.id] === optIdx;
              const isSubmitted = quizSubmitted[activeStage.id];
              const isCorrect = optIdx === activeStage.quiz.correctIndex;

              let btnStyle = 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300';
              if (isSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                btnStyle = 'bg-indigo-600/30 border-indigo-400 text-white font-bold ring-2 ring-indigo-500';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectQuizOption(activeStage.id, optIdx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Submit / Result Action */}
          {!quizSubmitted[activeStage.id] ? (
            <button
              onClick={() => handleSubmitQuiz(activeStage)}
              disabled={quizAnswers[activeStage.id] === undefined || quizAnswers[activeStage.id] === null}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
            >
              Submit Answer & Unlock Stage
            </button>
          ) : (
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-indigo-300">Explanation:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {activeStage.quiz.explanation}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
