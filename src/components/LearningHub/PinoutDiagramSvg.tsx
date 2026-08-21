import React from 'react';
import { MicrocontrollerBoard, BoardPin, ProtocolType } from '../../types';

interface PinoutDiagramSvgProps {
  board: MicrocontrollerBoard;
  selectedPin: BoardPin | null;
  onSelectPin: (pin: BoardPin) => void;
  activeProtocolFilter: ProtocolType | 'ALL';
}

export const PinoutDiagramSvg: React.FC<PinoutDiagramSvgProps> = ({
  board,
  selectedPin,
  onSelectPin,
  activeProtocolFilter,
}) => {
  const isPinHighlighted = (pin: BoardPin) => {
    if (activeProtocolFilter === 'ALL') return true;
    return pin.protocols.includes(activeProtocolFilter);
  };

  const getPinColor = (pin: BoardPin) => {
    if (pin.primaryType === 'Ground') return '#64748b'; // slate-500
    if (pin.primaryType === 'Power') return '#ef4444'; // red-500
    if (pin.primaryType === 'Analog') return '#10b981'; // emerald-500
    if (pin.primaryType === 'Special' || pin.isStrappingPin) return '#f59e0b'; // amber-500
    if (pin.protocols.includes('I2C')) return '#3b82f6'; // blue-500
    if (pin.protocols.includes('SPI')) return '#8b5cf6'; // purple-500
    if (pin.protocols.includes('UART')) return '#ec4899'; // pink-500
    if (pin.protocols.includes('PWM')) return '#06b6d4'; // cyan-500
    return '#60a5fa'; // blue-400
  };

  const leftPins = board.pins.filter((p) => p.side === 'left' || p.side === 'top');
  const rightPins = board.pins.filter((p) => p.side === 'right' || p.side === 'bottom');

  return (
    <div className="w-full bg-slate-950/80 rounded-2xl border border-slate-800 p-4 sm:p-6 overflow-x-auto shadow-inner">
      <div className="min-w-[620px] max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Board Top Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono font-bold text-slate-200">{board.name}</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-blue-300 font-mono">{board.operatingVoltage}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Click any pin to inspect functions, voltage & protocols
          </div>
        </div>

        {/* Visual Board Layout with Dual-Sided Pin Columns */}
        <div className="w-full grid grid-cols-12 gap-2 my-6 items-start">
          
          {/* Left Pins Column */}
          <div className="col-span-4 space-y-1.5 flex flex-col items-end">
            {leftPins.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              const matchesFilter = isPinHighlighted(pin);
              const pinColor = getPinColor(pin);

              return (
                <button
                  key={pin.id}
                  onClick={() => onSelectPin(pin)}
                  className={`w-full flex items-center justify-end space-x-2 py-1 px-2.5 rounded-lg border text-[11px] font-mono transition-all transform text-right ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-400 text-white font-bold ring-2 ring-blue-500 scale-[1.02] shadow-md shadow-blue-500/20'
                      : matchesFilter
                      ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300'
                      : 'bg-slate-900/30 border-slate-900 text-slate-600 opacity-40'
                  }`}
                >
                  <div className="flex flex-col items-end truncate">
                    <span className="truncate font-semibold">{pin.pinName}</span>
                    <span className="text-[9px] opacity-75">{pin.protocols.slice(0, 2).join(' · ')}</span>
                  </div>
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-950"
                    style={{ backgroundColor: pinColor }}
                    title={pin.primaryType}
                  >
                    {pin.pinSequence}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Central Microcontroller PCB Core Graphic */}
          <div className="col-span-4 self-stretch bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-xl border-2 border-slate-700/80 p-4 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl min-h-[380px]">
            
            {/* USB Connector Mock */}
            <div className="w-14 h-5 bg-slate-700 rounded-t border-t-2 border-x-2 border-slate-500/80 -mt-4 shadow-sm flex items-center justify-center">
              <span className="text-[8px] font-mono text-slate-300">USB</span>
            </div>

            {/* Wi-Fi Antenna / Crystal area */}
            <div className="w-20 h-10 border border-amber-500/30 bg-amber-500/5 rounded flex items-center justify-center my-2">
              <span className="text-[9px] font-mono text-amber-300 font-bold tracking-wider">RF ANTENNA</span>
            </div>

            {/* Silicon SoC IC Package */}
            <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-600 rounded-lg flex flex-col items-center justify-center p-2 shadow-inner my-auto">
              <div className="w-2 h-2 rounded-full bg-slate-600 self-start mb-1"></div>
              <span className="text-[10px] font-black text-slate-200 tracking-wider uppercase font-mono">
                {board.chipset.split(' ')[0]}
              </span>
              <span className="text-[8px] text-blue-400 font-mono mt-0.5">{board.clockSpeed}</span>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5">{board.flashMemory}</span>
            </div>

            {/* Bottom Status LEDs & Reset Button */}
            <div className="w-full flex items-center justify-between px-2 pt-3 border-t border-slate-800 text-[9px] font-mono text-slate-400">
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>PWR</span>
              </div>
              <span className="text-slate-500 font-bold">{board.shortName}</span>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>LED</span>
              </div>
            </div>
          </div>

          {/* Right Pins Column */}
          <div className="col-span-4 space-y-1.5 flex flex-col items-start">
            {rightPins.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              const matchesFilter = isPinHighlighted(pin);
              const pinColor = getPinColor(pin);

              return (
                <button
                  key={pin.id}
                  onClick={() => onSelectPin(pin)}
                  className={`w-full flex items-center justify-start space-x-2 py-1 px-2.5 rounded-lg border text-[11px] font-mono transition-all transform text-left ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-400 text-white font-bold ring-2 ring-blue-500 scale-[1.02] shadow-md shadow-blue-500/20'
                      : matchesFilter
                      ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300'
                      : 'bg-slate-900/30 border-slate-900 text-slate-600 opacity-40'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-950"
                    style={{ backgroundColor: pinColor }}
                    title={pin.primaryType}
                  >
                    {pin.pinSequence}
                  </span>
                  <div className="flex flex-col items-start truncate">
                    <span className="truncate font-semibold">{pin.pinName}</span>
                    <span className="text-[9px] opacity-75">{pin.protocols.slice(0, 2).join(' · ')}</span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Pin Color Legend */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Power (3.3V/5V)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>Ground (GND)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Analog (ADC/DAC)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>I2C Bus</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>SPI Bus</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
            <span>UART Serial</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Strapping / Boot Warn</span>
          </span>
        </div>

      </div>
    </div>
  );
};
