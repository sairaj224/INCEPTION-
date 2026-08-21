import React, { useState } from 'react';
import { Search, Activity, Sliders, Play, Code, AlertTriangle, CheckCircle2, ChevronRight, Copy, Check, Info, Flame, Droplets, Sun, Gauge, Layers, Wrench, Sparkles, BookOpen } from 'lucide-react';
import { SensorTopic, SensorCategoryType } from '../../types';
import { SENSOR_TOPICS } from '../../data/learningSensorsData';

interface SensorExplorerViewProps {
  onOpenVideoModal?: (video: any) => void;
}

export const SensorExplorerView: React.FC<SensorExplorerViewProps> = ({ onOpenVideoModal }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<SensorCategoryType | 'All'>('All');
  const [selectedSensorId, setSelectedSensorId] = useState<string>(SENSOR_TOPICS[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'pinout_wiring' | 'code' | 'troubleshooting' | 'projects'>('overview');
  
  // Interactive Simulator State
  const [simValue, setSimValue] = useState<number>(SENSOR_TOPICS[0].simulation.defaultValue);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const selectedSensor = SENSOR_TOPICS.find((s) => s.id === selectedSensorId) || SENSOR_TOPICS[0];

  const handleSelectSensor = (sensor: SensorTopic) => {
    setSelectedSensorId(sensor.id);
    setSimValue(sensor.simulation.defaultValue);
    setActiveTab('overview');
  };

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const filteredSensors = SENSOR_TOPICS.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(q) || s.whatItMeasures.toLowerCase().includes(q) || s.modelNumber.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const simResult = selectedSensor.simulation.interpretValue(simValue);

  const categories: (SensorCategoryType | 'All')[] = [
    'All',
    'Temperature & Humidity',
    'Distance & Ranging',
    'Environmental & Gas',
    'Motion & Inertia',
    'Optical & Light',
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 p-6 sm:p-8 text-white space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
          <Activity className="w-3.5 h-3.5 text-blue-300" />
          <span>Interactive Sensor Physics & Electronics Lab</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Comprehensive Sensor Knowledge Base & Live Simulator
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Explore sensor operating principles, signal quantization, voltage tolerances, interactive circuit breadboard diagrams, copyable production firmware, and live physical parameter simulation.
        </p>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search sensors (e.g. DHT22, Ultrasonic, Smoke MQ-2, LDR, MPU6050)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Sensor Directory Sidebar + Deep-Dive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Sensor List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Available Sensors ({filteredSensors.length})
          </div>

          <div className="space-y-2">
            {filteredSensors.map((sensor) => {
              const isSelected = sensor.id === selectedSensor.id;
              return (
                <button
                  key={sensor.id}
                  onClick={() => handleSelectSensor(sensor)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500 ring-2 ring-blue-500/50 shadow-lg text-white'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-bold">
                      {sensor.category}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300">
                      {sensor.specs.operatingVoltage}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {sensor.modelNumber}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {sensor.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Sensor Deep-Dive Explorer */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl text-slate-200">
            
            {/* Header Area */}
            <div className="p-6 border-b border-slate-800 space-y-3 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold">
                  {selectedSensor.category} · {selectedSensor.specs.outputType}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Model: <strong className="text-slate-200">{selectedSensor.modelNumber}</strong>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {selectedSensor.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedSensor.summary}
              </p>

              {/* Sub-Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-800/80 text-xs">
                {[
                  { id: 'overview', label: '1. Working & Specs', icon: Info },
                  { id: 'simulator', label: '2. Live Signal Simulator', icon: Sliders },
                  { id: 'pinout_wiring', label: '3. Pinout & Wiring', icon: Layers },
                  { id: 'code', label: '4. Firmware Code', icon: Code },
                  { id: 'troubleshooting', label: '5. Common Traps & Fixes', icon: Wrench },
                  { id: 'projects', label: '6. Video Lesson & Projects', icon: Play },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-[11px] transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab 1: Working & Specs */}
            {activeTab === 'overview' && (
              <div className="p-6 space-y-6 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-xs flex items-center space-x-1.5">
                      <Gauge className="w-4 h-4 text-blue-400" />
                      <span>What It Measures</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedSensor.whatItMeasures}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-xs flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>How the Physics Works</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedSensor.howItWorks}
                    </p>
                  </div>
                </div>

                {/* Technical Specifications Table */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Engineering Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Operating Voltage:</span>
                      <span className="font-mono font-bold text-amber-300">{selectedSensor.specs.operatingVoltage}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Current Consumption:</span>
                      <span className="font-mono font-bold text-slate-200">{selectedSensor.specs.currentConsumption}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Measurement Range:</span>
                      <span className="font-mono font-bold text-blue-300">{selectedSensor.specs.measurementRange}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Accuracy:</span>
                      <span className="font-mono font-bold text-emerald-400">{selectedSensor.specs.accuracy}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Interface Protocol:</span>
                      <span className="font-mono font-bold text-purple-300">{selectedSensor.specs.outputType}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Sampling Speed:</span>
                      <span className="font-mono font-bold text-cyan-300">{selectedSensor.specs.responseSpeed}</span>
                    </div>
                  </div>
                </div>

                {/* Real-World Industry Applications */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xs">Industry & Practical Applications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedSensor.applications.map((app, i) => (
                      <div key={i} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80 text-slate-300 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Live Signal Simulator */}
            {activeTab === 'simulator' && (
              <div className="p-6 space-y-6 text-xs">
                <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-5 rounded-xl border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                        <Sliders className="w-4 h-4 text-blue-400" />
                        <span>{selectedSensor.simulation.parameterLabel}</span>
                      </h4>
                      <span className="text-slate-400 text-[11px]">
                        Drag the slider to simulate real physical environmental changes
                      </span>
                    </div>
                    <span className="text-lg font-mono font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/30">
                      {simValue} {selectedSensor.simulation.unit}
                    </span>
                  </div>

                  {/* Slider Control */}
                  <input
                    type="range"
                    min={selectedSensor.simulation.min}
                    max={selectedSensor.simulation.max}
                    step={selectedSensor.simulation.step}
                    value={simValue}
                    onChange={(e) => setSimValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />

                  {/* Output Simulation Readout Panel */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold">
                        1. Raw Electrical Signal / Quantization:
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-300">
                        {simResult.rawSignal}
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold">
                        2. MCU Interpreted Engineering Value:
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {simResult.convertedValue}
                      </span>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    simResult.statusColor === 'emerald'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : simResult.statusColor === 'rose'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}>
                    <span>System State: {simResult.status}</span>
                    <span className="text-[10px] font-mono opacity-80">{selectedSensor.simulation.outputFormulaText}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <strong>Sensor Technical Process:</strong> {simResult.technicalNote}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Pinout & Wiring */}
            {activeTab === 'pinout_wiring' && (
              <div className="p-6 space-y-6 text-xs">
                
                {/* Pinout Table */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Physical Pinout Mapping
                  </h4>
                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-[11px] divide-y divide-slate-800">
                      <thead className="bg-slate-950 text-slate-400 font-mono">
                        <tr>
                          <th className="py-2.5 px-3">Pin #</th>
                          <th className="py-2.5 px-3">Pin Name</th>
                          <th className="py-2.5 px-3">Function</th>
                          <th className="py-2.5 px-3">Voltage</th>
                          <th className="py-2.5 px-3">Recommended Connection</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                        {selectedSensor.pinoutGuide.map((pin) => (
                          <tr key={pin.pinNumber} className="hover:bg-slate-800/40">
                            <td className="py-2 px-3 font-mono font-bold text-blue-400">{pin.pinNumber}</td>
                            <td className="py-2 px-3 font-mono font-bold text-slate-100">{pin.pinName}</td>
                            <td className="py-2 px-3 text-slate-300">{pin.function}</td>
                            <td className="py-2 px-3 font-mono text-amber-300">{pin.voltage}</td>
                            <td className="py-2 px-3 text-slate-300">{pin.recommendedConnection}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Step-by-Step Circuit Breadboard Wiring Steps */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Breadboard Wiring Instructions ({selectedSensor.circuitDiagram.microcontroller})</span>
                  </h4>

                  <div className="space-y-2">
                    {selectedSensor.circuitDiagram.wiringSteps.map((step) => (
                      <div key={step.step} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-3">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {step.step}
                        </span>
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-200">{step.fromComponentPin}</span>
                            <span className="text-slate-500">➔</span>
                            <span className="font-bold text-blue-300">{step.toBoardPin}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                              Wire Color: {step.wireColor}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{step.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Safety Notes */}
                  {selectedSensor.circuitDiagram.safetyNotes.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                      <div className="font-bold flex items-center space-x-1.5 text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Circuit Safety & Wiring Rules:</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-200/90">
                        {selectedSensor.circuitDiagram.safetyNotes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Tab 4: Firmware Code */}
            {activeTab === 'code' && (
              <div className="p-6 space-y-6 text-xs">
                {selectedSensor.codeExamples.map((ex, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden space-y-2">
                    
                    <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono font-bold text-[10px]">
                          {ex.platform}
                        </span>
                        <h4 className="font-bold text-white text-xs">{ex.title}</h4>
                      </div>

                      <button
                        onClick={() => handleCopyCode(ex.code, idx)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono flex items-center space-x-1 border border-slate-700 transition-all"
                      >
                        {copiedCodeIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {ex.librariesRequired.length > 0 && (
                      <div className="px-4 py-1.5 text-[11px] text-slate-400 flex items-center space-x-1.5">
                        <span className="font-bold text-slate-300">Required Libraries:</span>
                        <span className="font-mono text-amber-300">{ex.librariesRequired.join(', ')}</span>
                      </div>
                    )}

                    <pre className="p-4 text-[11px] font-mono text-emerald-400 bg-slate-950 overflow-x-auto leading-relaxed max-h-80">
                      <code>{ex.code}</code>
                    </pre>

                    <p className="p-3 text-[11px] text-slate-400 bg-slate-900/50 border-t border-slate-800/80 leading-relaxed">
                      <strong>Code Explanation:</strong> {ex.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Common Traps & Fixes */}
            {activeTab === 'troubleshooting' && (
              <div className="p-6 space-y-6 text-xs">
                
                {/* Common Mistakes */}
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Common Beginner Mistakes & Traps</span>
                  </h4>

                  <div className="space-y-2.5">
                    {selectedSensor.commonMistakes.map((item, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="font-bold text-rose-300 flex items-center space-x-1.5">
                          <span className="text-rose-400 font-black">✕ Mistake:</span>
                          <span>{item.mistake}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          <strong>Consequence:</strong> {item.consequence}
                        </p>
                        <p className="text-[11px] text-emerald-300 bg-emerald-950/20 border border-emerald-500/20 p-2 rounded-lg">
                          <strong>✓ The Fix:</strong> {item.fix}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Troubleshooting Flowchart */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                    <Wrench className="w-4 h-4 text-blue-400" />
                    <span>Troubleshooting Guide (Symptom ➔ Fix)</span>
                  </h4>

                  <div className="space-y-2">
                    {selectedSensor.troubleshootingGuide.map((guide, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <span className="text-slate-200 font-bold block">
                          Symptom: "{guide.symptom}"
                        </span>
                        <p className="text-[11px] text-amber-300">
                          <strong>Probable Cause:</strong> {guide.probableCause}
                        </p>
                        <p className="text-[11px] text-slate-300">
                          <strong>How to Fix:</strong> {guide.stepToFix}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 6: Video Lesson & Projects */}
            {activeTab === 'projects' && (
              <div className="p-6 space-y-6 text-xs">
                
                {/* Curated Video Lessons for this Sensor */}
                {selectedSensor.videos.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                      <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
                      <span>Dedicated Video Tutorial for {selectedSensor.modelNumber}</span>
                    </h4>

                    <div className="space-y-3">
                      {selectedSensor.videos.map((vid) => (
                        <div key={vid.id} className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-rose-500/20 shadow-lg space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                                  {vid.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Duration: {vid.duration}
                                </span>
                                <span className="text-[10px] text-blue-400 font-mono">
                                  Channel: {vid.channel}
                                </span>
                              </div>
                              <h5 className="font-bold text-white text-sm">{vid.title}</h5>
                            </div>

                            <button
                              onClick={() => onOpenVideoModal && onOpenVideoModal(vid)}
                              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-2 shrink-0 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
                            >
                              <Play className="w-4 h-4 fill-white" />
                              <span>Watch Video Lesson</span>
                            </button>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">{vid.summary}</p>

                          {vid.keyTakeaways && vid.keyTakeaways.length > 0 && (
                            <div className="pt-2 border-t border-slate-800/80">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Key Takeaways from this Lesson:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {vid.keyTakeaways.map((takeaway, idx) => (
                                  <span key={idx} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-1">
                                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span>{takeaway}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mini Projects */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Hands-on Mini Projects with {selectedSensor.modelNumber}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSensor.miniProjects.map((proj, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                              {proj.difficulty}
                            </span>
                          </div>
                          <h5 className="font-bold text-white text-xs">{proj.title}</h5>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{proj.description}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                          <strong>Key Components:</strong> {proj.keyComponents.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
