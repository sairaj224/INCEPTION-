import React, { useState } from 'react';
import { Cpu, Zap, AlertTriangle, ShieldCheck, CheckCircle2, Play, Info, Filter, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { MicrocontrollerBoard, BoardPin, ProtocolType } from '../../types';
import { MICROCONTROLLER_BOARDS } from '../../data/learningBoardsData';
import { PinoutDiagramSvg } from './PinoutDiagramSvg';

interface MicrocontrollerPinoutViewProps {
  onOpenVideoModal?: (video: any) => void;
}

export const MicrocontrollerPinoutView: React.FC<MicrocontrollerPinoutViewProps> = ({ onOpenVideoModal }) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>('esp32-devkit-v1');
  const [activeProtocolFilter, setActiveProtocolFilter] = useState<ProtocolType | 'ALL'>('ALL');
  
  const currentBoard = MICROCONTROLLER_BOARDS.find((b) => b.id === selectedBoardId) || MICROCONTROLLER_BOARDS[0];
  const [selectedPin, setSelectedPin] = useState<BoardPin | null>(currentBoard.pins[15] || currentBoard.pins[0]);

  const handleSelectBoard = (board: MicrocontrollerBoard) => {
    setSelectedBoardId(board.id);
    setSelectedPin(board.pins[0] || null);
    setActiveProtocolFilter('ALL');
  };

  const protocolFilterOptions: { label: string; value: ProtocolType | 'ALL'; color: string }[] = [
    { label: 'All Pins', value: 'ALL', color: 'slate' },
    { label: 'I2C Bus (SDA/SCL)', value: 'I2C', color: 'blue' },
    { label: 'SPI Bus (MOSI/MISO/SCK)', value: 'SPI', color: 'purple' },
    { label: 'UART Serial (TX/RX)', value: 'UART', color: 'pink' },
    { label: 'ADC Analog In', value: 'ADC', color: 'emerald' },
    { label: 'PWM Timers', value: 'PWM', color: 'cyan' },
    { label: 'Power & Ground', value: 'Power', color: 'red' },
    { label: 'Boot / Strapping Pins', value: 'Strapping', color: 'amber' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 text-white space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
          <Cpu className="w-3.5 h-3.5 text-indigo-300" />
          <span>Interactive Microcontroller Pinout Explorer</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Visual Board Diagrams & Pin Logic Inspector
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Select an embedded development board, filter pins by communication protocol (I2C, SPI, UART, ADC, PWM), and click any pin to learn its voltage rating, strapping states, and exactly <strong>which pin to connect and why</strong>.
        </p>

        {/* Board Selection Tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          {MICROCONTROLLER_BOARDS.map((board) => {
            const isSelected = board.id === currentBoard.id;
            return (
              <button
                key={board.id}
                onClick={() => handleSelectBoard(board)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-blue-300" />
                <span>{board.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Protocol Quick-Filter Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs">
        <span className="text-slate-400 font-bold flex items-center space-x-1 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Highlight Protocol:</span>
        </span>
        {protocolFilterOptions.map((opt) => {
          const isActive = activeProtocolFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setActiveProtocolFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all text-[11px] ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Pinout Layout: SVG Diagram + Selected Pin Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Visual SVG Diagram */}
        <div className="lg:col-span-7 space-y-4">
          <PinoutDiagramSvg
            board={currentBoard}
            selectedPin={selectedPin}
            onSelectPin={(pin) => setSelectedPin(pin)}
            activeProtocolFilter={activeProtocolFilter}
          />

          {/* Critical Board Warnings Callout */}
          {currentBoard.criticalWarnings.length > 0 && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 space-y-2 text-amber-200 text-xs">
              <div className="flex items-center space-x-2 font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Critical Hardware & Logic Safety Warnings</span>
              </div>
              <ul className="space-y-1 pl-6 list-disc text-[11px] text-amber-200/90 leading-relaxed">
                {currentBoard.criticalWarnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Deep-Dive Pin Inspector Card */}
        <div className="lg:col-span-5 space-y-4">
          {selectedPin ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 text-slate-200 shadow-xl">
              
              {/* Pin Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono text-[10px] font-bold">
                      PIN #{selectedPin.pinSequence} ({selectedPin.side.toUpperCase()})
                    </span>
                    {selectedPin.isStrappingPin && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold">
                        STRAPPING PIN
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-white font-mono mt-1">
                    {selectedPin.pinName}
                  </h3>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  selectedPin.safeForBoot ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {selectedPin.safeForBoot ? '✓ Safe For Boot' : '⚠ Caution on Boot'}
                </span>
              </div>

              {/* Pin Attributes Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Voltage Tolerance:</span>
                  <span className="font-mono font-bold text-amber-300">{selectedPin.voltage}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Max Pin Current:</span>
                  <span className="font-mono font-bold text-slate-200">{selectedPin.maxCurrentMa} mA</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Internal Pull-up:</span>
                  <span className="font-mono font-bold text-slate-200">{selectedPin.pullUpAvailable ? 'Yes (Software)' : 'None / External'}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Primary Category:</span>
                  <span className="font-mono font-bold text-blue-400">{selectedPin.primaryType}</span>
                </div>
              </div>

              {/* Supported Communication Protocols */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300">Supported Hardware Protocols:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPin.protocols.map((proto) => (
                    <span
                      key={proto}
                      className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-mono font-bold"
                    >
                      {proto}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-300">Hardware Pin Description:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                  {selectedPin.description}
                </p>
              </div>

              {/* Recommended Connection & Why */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Recommended Uses (Why Connect Here):</span>
                </span>
                <p className="text-xs text-slate-200 bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-lg leading-relaxed">
                  {selectedPin.recommendedUse}
                </p>
              </div>

              {/* Caution Warning if any */}
              {selectedPin.cautionWarning && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{selectedPin.cautionWarning}</span>
                </div>
              )}

            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-400 space-y-2">
              <Info className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-xs">Click any pin on the diagram to inspect its detailed specifications.</p>
            </div>
          )}

          {/* Board Architecture Specs Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>{currentBoard.shortName} Architecture Specs</span>
            </h4>
            
            <div className="space-y-2 text-slate-300 divide-y divide-slate-800/60 text-[11px]">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Processor Core:</span>
                <span className="font-mono text-slate-200 font-semibold">{currentBoard.architecture}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Flash & SRAM:</span>
                <span className="font-mono text-slate-200">{currentBoard.flashMemory} Flash / {currentBoard.sram}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Connectivity:</span>
                <span className="font-mono text-emerald-400">{currentBoard.wirelessConnectivity}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Hardware Peripherals:</span>
                <span className="font-mono text-blue-300">
                  {currentBoard.gpioPinsCount} GPIO · {currentBoard.adcPinsCount} ADC · {currentBoard.pwmPinsCount} PWM · {currentBoard.i2cCount} I2C · {currentBoard.spiCount} SPI
                </span>
              </div>
            </div>

            {/* Video Lesson for this board */}
            {currentBoard.videos && currentBoard.videos.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Featured Board Tutorial & Pinout Video
                </span>
                {currentBoard.videos.map((vid) => (
                  <div key={vid.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-rose-400 block font-bold">
                          {vid.channel} · {vid.duration}
                        </span>
                        <h5 className="font-bold text-white text-xs mt-0.5">{vid.title}</h5>
                      </div>
                      <button
                        onClick={() => onOpenVideoModal && onOpenVideoModal(vid)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 shrink-0 shadow transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{vid.summary}</p>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
