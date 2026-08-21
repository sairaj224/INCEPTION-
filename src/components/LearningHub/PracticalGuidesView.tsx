import React, { useState } from 'react';
import { Cpu, Activity, AlertTriangle, CheckCircle2, ShieldCheck, Zap, Layers, Wrench, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { MICROCONTROLLER_BOARDS } from '../../data/learningBoardsData';
import { SENSOR_TOPICS } from '../../data/learningSensorsData';

export const PracticalGuidesView: React.FC = () => {
  const [selectedMcuId, setSelectedMcuId] = useState<string>('esp32-devkit-v1');
  const [selectedSensorId, setSelectedSensorId] = useState<string>('hc-sr04-ultrasonic');

  const selectedMcu = MICROCONTROLLER_BOARDS.find((b) => b.id === selectedMcuId) || MICROCONTROLLER_BOARDS[0];
  const selectedSensor = SENSOR_TOPICS.find((s) => s.id === selectedSensorId) || SENSOR_TOPICS[0];

  // Logic Level Analysis
  const isMcu3V3 = selectedMcu.operatingVoltage.includes('3.3V');
  const isSensor5V = selectedSensor.specs.operatingVoltage.includes('5.0V') || selectedSensor.specs.operatingVoltage.includes('5V');
  const isDirectlyCompatible = (isMcu3V3 && !isSensor5V) || (!isMcu3V3 && isSensor5V) || selectedSensor.specs.operatingVoltage.includes('3.3V to 5');

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 text-white space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
          <Wrench className="w-3.5 h-3.5 text-emerald-300" />
          <span>Practical Lab Wiring & Compatibility Engine</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Microcontroller & Sensor Wiring Matchmaker
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Select any development board and any sensor module to verify <strong>voltage level compatibility</strong>, determine pull-up resistor requirements, and obtain color-coded breadboard wiring instructions before applying power.
        </p>
      </div>

      {/* Interactive Matchmaker Configurator */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-200 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Select Microcontroller */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>1. Choose Development Board:</span>
            </label>
            <select
              value={selectedMcuId}
              onChange={(e) => setSelectedMcuId(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-blue-500"
            >
              {MICROCONTROLLER_BOARDS.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name} ({board.operatingVoltage})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <strong>Logic Rating:</strong> <span className="text-amber-300 font-mono">{selectedMcu.operatingVoltage}</span>
            </div>
          </div>

          {/* 2. Select Sensor */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>2. Choose Sensor / Peripheral:</span>
            </label>
            <select
              value={selectedSensorId}
              onChange={(e) => setSelectedSensorId(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
            >
              {SENSOR_TOPICS.map((sensor) => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.modelNumber} — {sensor.name}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <strong>Sensor Supply:</strong> <span className="text-blue-300 font-mono">{selectedSensor.specs.operatingVoltage}</span> · <strong>Interface:</strong> <span className="text-purple-300 font-mono">{selectedSensor.specs.outputType}</span>
            </div>
          </div>

        </div>

        {/* Dynamic Compatibility Verdict Card */}
        <div className={`p-5 rounded-xl border space-y-3 ${
          isDirectlyCompatible
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isDirectlyCompatible ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
              <h4 className="font-bold text-sm">
                {isDirectlyCompatible
                  ? 'Direct Logic Compatibility: 100% Safe'
                  : 'Voltage Level Shifting Required for Safe Operation'}
              </h4>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-950/60 border border-slate-800">
              {selectedMcu.shortName} + {selectedSensor.modelNumber}
            </span>
          </div>

          <p className="text-xs leading-relaxed">
            {isDirectlyCompatible
              ? `The ${selectedSensor.modelNumber} operates natively within the ${selectedMcu.operatingVoltage} logic specifications of the ${selectedMcu.name}. You can connect digital/analog signal lines directly without voltage dividers.`
              : `CRITICAL SAFETY NOTE: The ${selectedSensor.modelNumber} outputs a 5.0V signal, while the ${selectedMcu.name} has strict 3.3V logic inputs. Connect a 1kΩ series resistor and a 2kΩ pull-down resistor to GND on the sensor output line to step 5.0V down to a safe 3.33V level.`}
          </p>
        </div>

        {/* Step-by-Step Breadboard Wiring Table */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Recommended Breadboard Pin-to-Pin Wiring</span>
          </h4>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-[11px] divide-y divide-slate-800">
              <thead className="bg-slate-950 text-slate-400 font-mono">
                <tr>
                  <th className="py-2.5 px-3">Step</th>
                  <th className="py-2.5 px-3">Sensor Pin</th>
                  <th className="py-2.5 px-3">Microcontroller Pin</th>
                  <th className="py-2.5 px-3">Jumper Color</th>
                  <th className="py-2.5 px-3">Engineering Function</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                {selectedSensor.circuitDiagram.wiringSteps.map((step) => (
                  <tr key={step.step} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-400">#{step.step}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-white">{step.fromComponentPin}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">{step.toBoardPin}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center space-x-1 font-mono text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full" style={{
                          backgroundColor: step.wireColor.toLowerCase() === 'red' ? '#ef4444' :
                            step.wireColor.toLowerCase() === 'black' ? '#0f172a' :
                            step.wireColor.toLowerCase() === 'yellow' ? '#eab308' :
                            step.wireColor.toLowerCase() === 'blue' ? '#3b82f6' : '#a855f7'
                        }}></span>
                        <span>{step.wireColor}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{step.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Embedded Systems Best Practices Checklist */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-xs text-slate-300">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>The Top 5 Hardware Prototyping Golden Rules</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-300 block">1. Always Double-Check Ground First</span>
            <p className="text-slate-400">Never power on a circuit before confirming all modular boards share a unified 0V common ground return.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-300 block">2. Decouple Noisy Actuators</span>
            <p className="text-slate-400">High-current servo motors and relay coils must use external power supplies to prevent MCU brownout resets.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-300 block">3. Pull-Up Resistors on I2C Buses</span>
            <p className="text-slate-400">I2C lines (SDA and SCL) are open-drain and always require 4.7kΩ pull-up resistors to VCC.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-300 block">4. Respect 3.3V GPIO Limits</span>
            <p className="text-slate-400">ESP32, RP2040 Pico, and STM32 chips are strictly 3.3V logic. Always shift 5V inputs down with resistors.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
