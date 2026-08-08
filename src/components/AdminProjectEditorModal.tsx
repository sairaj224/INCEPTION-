import React, { useState } from 'react';
import { Project, Product, BOMItem, QuizQuestion, PinConnection, SimulationInput, SimulationOutput } from '../types';
import {
  X,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Cpu,
  HelpCircle,
  Layers,
  FileCode,
  Play,
  AlertTriangle,
  Image as ImageIcon,
  IndianRupee,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
  List
} from 'lucide-react';
import { ImageChangeModal } from './ImageChangeModal';

interface AdminProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null; // null means creating a new project
  allProducts: Product[];
  onSaveProject: (project: Project) => void;
  initialTab?: 'overview' | 'quiz' | 'bom' | 'wiring' | 'code' | 'simulation' | 'troubleshoot';
}

export const AdminProjectEditorModal: React.FC<AdminProjectEditorModalProps> = ({
  isOpen,
  onClose,
  project,
  allProducts,
  onSaveProject,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'quiz' | 'bom' | 'wiring' | 'code' | 'simulation' | 'troubleshoot'>(initialTab);

  // General / Overview State
  const [title, setTitle] = useState<string>(project?.title || '');
  const [subtitle, setSubtitle] = useState<string>(project?.subtitle || '');
  const [domain, setDomain] = useState<Project['domain']>(project?.domain || 'Sensors');
  const [difficulty, setDifficulty] = useState<Project['difficulty']>(project?.difficulty || 'Beginner');
  const [estimatedHours, setEstimatedHours] = useState<number>(project?.estimatedHours || 3);
  const [estimatedBudget, setEstimatedBudget] = useState<number>(project?.estimatedBudget || 800);
  const [heroImage, setHeroImage] = useState<string>(
    project?.heroImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  );
  const [description, setDescription] = useState<string>(project?.description || '');
  const [learningObjectives, setLearningObjectives] = useState<string[]>(
    project?.learningObjectives || [
      'Understand GPIO pin routing and analog-to-digital conversion.',
      'Interface sensors with ESP32 microcontroller using C++.',
      'Read telemetry data and trigger automated hardware outputs.'
    ]
  );
  const [newObjInput, setNewObjInput] = useState<string>('');

  // Skill Quiz State (3 Qs required)
  const [quizList, setQuizList] = useState<QuizQuestion[]>(
    project?.quiz || [
      {
        id: 'q-1',
        question: 'What is the standard operating voltage for the ESP32 microcontroller analog input pins?',
        options: ['1.8V max', '3.3V max', '5.0V max', '12V max'],
        correctIndex: 1,
        explanation: 'ESP32 GPIO pins operate at 3.3V logic. Connecting 5V directly to ADC input pins will permanently damage the chip.'
      },
      {
        id: 'q-2',
        question: 'Which communication protocol is commonly used for reading environmental sensors like DHT11 or BME280?',
        options: ['SPI or I2C', 'RS-232 serial only', 'CAN Bus', 'Ethernet PHY'],
        correctIndex: 0,
        explanation: 'Most compact sensor breakout modules support I2C (SDA/SCL) or SPI bus protocol for digital data streaming.'
      },
      {
        id: 'q-3',
        question: 'What happens if a pull-up resistor is omitted from an open-drain sensor data pin?',
        options: ['The sensor explodes', 'Floating signal causes intermittent sensor read failures', 'Higher current draw', 'Code runs 2x faster'],
        correctIndex: 1,
        explanation: 'Without pull-up resistors, logic levels float between 0V and 3.3V, causing spurious noise and communication time-outs.'
      }
    ]
  );

  // Smart BOM & Budget State
  const [bomList, setBomList] = useState<BOMItem[]>(
    project?.bom || [
      { productId: allProducts[0]?.id || 'prod-1', quantity: 1, required: true },
      { productId: allProducts[1]?.id || 'prod-2', quantity: 1, required: true }
    ]
  );

  // Pinout & Wiring State
  const [pinoutList, setPinoutList] = useState<PinConnection[]>(
    project?.pinoutTable || [
      { componentName: 'ESP32 Dev Board', componentPin: '3V3 Pin', boardPin: 'Breadboard Power Rail', wireColor: 'Red', note: '3.3V VCC supply' },
      { componentName: 'ESP32 Dev Board', componentPin: 'GND Pin', boardPin: 'Breadboard Ground Rail', wireColor: 'Black', note: 'Common ground' },
      { componentName: 'Sensor Module', componentPin: 'VCC', boardPin: '3.3V Power Rail', wireColor: 'Red', note: 'Power rail connection' },
      { componentName: 'Sensor Module', componentPin: 'OUT / DATA', boardPin: 'ESP32 GPIO 4', wireColor: 'Yellow', note: 'ADC Data input' }
    ]
  );

  // Embedded C++ Code State
  const [codeFilename, setCodeFilename] = useState<string>(project?.codeSnippet?.filename || 'main.cpp');
  const [codeLanguage, setCodeLanguage] = useState<string>(project?.codeSnippet?.language || 'C++');
  const [codeText, setCodeText] = useState<string>(
    project?.codeSnippet?.code ||
      `#include <Arduino.h>\n\n#define SENSOR_PIN 4\n#define ACTUATOR_PIN 18\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(SENSOR_PIN, INPUT);\n  pinMode(ACTUATOR_PIN, OUTPUT);\n  Serial.println("Inception Hardware Initialized successfully.");\n}\n\nvoid loop() {\n  int val = analogRead(SENSOR_PIN);\n  Serial.print("Sensor ADC Value: ");\n  Serial.println(val);\n  if (val > 2000) {\n    digitalWrite(ACTUATOR_PIN, HIGH);\n  } else {\n    digitalWrite(ACTUATOR_PIN, LOW);\n  }\n  delay(1000);\n}`
  );
  const [codeExplanation, setCodeExplanation] = useState<string>(
    project?.codeSnippet?.explanation || 'Reads analog telemetry from pin 4 and toggles output relay on GPIO 18.'
  );

  // Simulation Config State
  const [simInputsList, setSimInputsList] = useState<SimulationInput[]>(
    project?.simulationConfig?.inputs || [
      { id: 'sim_sensor', label: 'Sensor Threshold', min: 0, max: 4095, defaultValue: 1500, unit: 'ADC' },
      { id: 'sim_supply', label: 'Power Rail Voltage', min: 0, max: 50, defaultValue: 33, unit: 'x0.1V' }
    ]
  );
  const [simInitialLogs, setSimInitialLogs] = useState<string[]>(
    project?.simulationConfig?.initialLogs || [
      'System booting...',
      'Connecting to virtual breadboard...',
      'Sensor calibration complete.'
    ]
  );

  // AI Troubleshooter State (Common Issues / Troubleshooting Steps)
  const [troubleshooterTips, setTroubleshooterTips] = useState<string[]>(
    [
      'Verify serial monitor baud rate is set to 115200 in Arduino IDE.',
      'Ensure micro-USB cable supports data transfer, not power-only charging.',
      'Check logic level voltage: DHT11 requires 3.3V-5V with 10k pullup resistor.'
    ]
  );

  // Image Upload Modal
  const [isImagePickerOpen, setIsImagePickerOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  // Helpers for Objectives
  const handleAddObjective = () => {
    if (!newObjInput.trim()) return;
    setLearningObjectives([...learningObjectives, newObjInput.trim()]);
    setNewObjInput('');
  };

  const handleRemoveObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };

  // Helpers for Quiz
  const handleAddQuizQuestion = () => {
    const newQ: QuizQuestion = {
      id: 'q-' + Date.now(),
      question: 'New Question: What is the recommended power input?',
      options: ['3.3V DC', '5.0V USB', '12V Adapter', 'All of the above'],
      correctIndex: 3,
      explanation: 'The ESP32 onboard voltage regulator safely converts 5V USB and up to 12V DC input down to 3.3V logic level.'
    };
    setQuizList([...quizList, newQ]);
  };

  const handleUpdateQuiz = (index: number, updated: QuizQuestion) => {
    const next = [...quizList];
    next[index] = updated;
    setQuizList(next);
  };

  const handleRemoveQuiz = (index: number) => {
    setQuizList(quizList.filter((_, i) => i !== index));
  };

  // Helpers for BOM
  const handleAddBomItem = () => {
    if (allProducts.length === 0) return;
    setBomList([
      ...bomList,
      { productId: allProducts[0].id, quantity: 1, required: true }
    ]);
  };

  const handleUpdateBomItem = (index: number, updated: BOMItem) => {
    const next = [...bomList];
    next[index] = updated;
    setBomList(next);
  };

  const handleRemoveBomItem = (index: number) => {
    setBomList(bomList.filter((_, i) => i !== index));
  };

  // Helpers for Pinout
  const handleAddPinoutRow = () => {
    setPinoutList([
      ...pinoutList,
      { componentName: 'New Component', componentPin: 'PIN 1', boardPin: 'GPIO 5', wireColor: 'Blue', note: 'Signal' }
    ]);
  };

  const handleUpdatePinout = (index: number, updated: PinConnection) => {
    const next = [...pinoutList];
    next[index] = updated;
    setPinoutList(next);
  };

  const handleRemovePinout = (index: number) => {
    setPinoutList(pinoutList.filter((_, i) => i !== index));
  };

  // Save Project
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a valid project title.');
      return;
    }

    if (quizList.length < 3) {
      if (!window.confirm('Notice: Recommended minimum 3 quiz questions for student certification. Save anyway?')) {
        setActiveTab('quiz');
        return;
      }
    }

    // Calculate BOM Budget automatically if items exist
    let calcBudget = 0;
    bomList.forEach((b) => {
      const p = allProducts.find((prod) => prod.id === b.productId);
      if (p) calcBudget += p.price * b.quantity;
    });

    const finalProject: Project = {
      id: project?.id || 'proj-' + Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim() || description.substring(0, 100),
      domain,
      difficulty,
      estimatedHours: Number(estimatedHours) || 3,
      estimatedBudget: calcBudget > 0 ? calcBudget : Number(estimatedBudget) || 800,
      heroImage: heroImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      description: description.trim() || 'Complete hands-on engineering project kit.',
      learningObjectives: learningObjectives.length > 0 ? learningObjectives : ['Master microcontroller hardware wiring.'],
      bom: bomList.length > 0 ? bomList : [{ productId: allProducts[0]?.id || 'prod-1', quantity: 1, required: true }],
      quiz: quizList,
      pinoutTable: pinoutList,
      codeSnippet: {
        language: codeLanguage,
        filename: codeFilename,
        code: codeText,
        explanation: codeExplanation
      },
      simulationConfig: project?.simulationConfig || {
        inputs: simInputsList,
        outputs: [
          { id: 'led1', label: 'Relay Output', type: 'relay', activeConditionText: 'Relay Active' },
          { id: 'disp1', label: 'Serial Log', type: 'cloud_log', activeConditionText: 'Logging Telemetry' }
        ],
        initialLogs: simInitialLogs,
        simulationCode: (inputs: Record<string, number>) => {
          const val = Object.values(inputs)[0] || 0;
          return {
            outputsState: { led1: val > 1000 },
            logMessage: `[SIM LOG] Telemetry value: ${val}`
          };
        }
      },
      eWasteScore: project?.eWasteScore || {
        reusablePercent: 92,
        recyclablePackaging: true,
        carbonFootprint: 'Low'
      },
      facultyApproved: true,
      instructorName: 'Head Store Admin'
    };

    onSaveProject(finalProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                {project ? `Admin Edit: ${project.title}` : 'Create New Inception Project Idea'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure all 7 project sections: Overview, Required Quiz, Smart BOM, Wiring, C++ Code, Simulation & Troubleshooter.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center space-x-1.5 p-3 bg-slate-950 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Overview & Learning</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'quiz' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>2. Skill Quiz ({quizList.length} Qs)</span>
            {quizList.length >= 3 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('bom')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'bom' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Smart BOM ({bomList.length} Items)</span>
          </button>

          <button
            onClick={() => setActiveTab('wiring')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'wiring' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>4. Pinout & Wiring</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'code' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>5. Embedded C++ Code</span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'simulation' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>6. Interactive Simulation</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'troubleshoot' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>7. AI Troubleshooter</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-200">
          
          {/* TAB 1: OVERVIEW & LEARNING */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Smart IoT Weather Station with ESP32"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Subtitle / One-Line Teaser</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Monitor temperature, humidity, and rainfall live on mobile dashboard."
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Domain Category</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as any)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  >
                    <option value="Sensors">Sensors</option>
                    <option value="IoT & Cloud">IoT & Cloud</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Automation">Automation</option>
                    <option value="Audio/Visual">Audio/Visual</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Est. Hours</label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Target Budget (₹)</label>
                  <input
                    type="number"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  />
                </div>
              </div>

              {/* Hero Image */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Hero Image URL</label>
                <div className="flex space-x-2 mt-1">
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl border border-slate-700 flex items-center space-x-1"
                  >
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Upload / Pick Image</span>
                  </button>
                </div>
                {heroImage && (
                  <div className="mt-2 h-28 w-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Detailed Description */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Full Project Overview Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what the project builds, real-world application, and hardware design concepts..."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs"
                />
              </div>

              {/* Learning Objectives List */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-extrabold text-white text-xs flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Key Learning Objectives (Student Skills Acquired)</span>
                </h4>

                <div className="space-y-2">
                  {learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <input
                        type="text"
                        value={obj}
                        onChange={(e) => {
                          const next = [...learningObjectives];
                          next[i] = e.target.value;
                          setLearningObjectives(next);
                        }}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveObjective(i)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-900 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add a new learning objective..."
                    value={newObjInput}
                    onChange={(e) => setNewObjInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Objective</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILL QUIZ (3 Qs Required) */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Skill Quiz Questions (3 Qs Required)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Students must complete and pass this quiz to verify their understanding before unlocking completion badges.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                    quizList.length >= 3 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {quizList.length} / 3 Required Qs
                  </span>

                  <button
                    type="button"
                    onClick={handleAddQuizQuestion}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Quiz Question</span>
                  </button>
                </div>
              </div>

              {quizList.map((q, idx) => (
                <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-amber-400 text-xs">Question #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuiz(idx)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                      title="Remove Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Question Text</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleUpdateQuiz(idx, { ...q, question: e.target.value })}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`correct-${q.id || idx}`}
                          checked={q.correctIndex === optIdx}
                          onChange={() => handleUpdateQuiz(idx, { ...q, correctIndex: optIdx })}
                          className="text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Opt {optIdx + 1}:</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[optIdx] = e.target.value;
                            handleUpdateQuiz(idx, { ...q, options: newOpts });
                          }}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Explanation / Feedback on Answer</label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => handleUpdateQuiz(idx, { ...q, explanation: e.target.value })}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SMART BOM & BUDGET */}
          {activeTab === 'bom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Smart BOM & Budget Configuration</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Map hardware components required from the store catalog. Students can swap or deduct owned parts to save up to ₹200+.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddBomItem}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Component to BOM</span>
                </button>
              </div>

              <div className="space-y-3">
                {bomList.map((item, idx) => {
                  const currentProd = allProducts.find((p) => p.id === item.productId);

                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Select Component</label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleUpdateBomItem(idx, { ...item, productId: e.target.value })}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                        >
                          {allProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (₹{p.price})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Quantity</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleUpdateBomItem(idx, { ...item, quantity: Number(e.target.value) })}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Optional Swappable Alternative</label>
                        <select
                          value={item.alternativeProductId || ''}
                          onChange={(e) => handleUpdateBomItem(idx, { ...item, alternativeProductId: e.target.value || undefined })}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs"
                        >
                          <option value="">-- None (Standard Part) --</option>
                          {allProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (₹{p.price})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveBomItem(idx)}
                          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-slate-900 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: PINOUT & WIRING */}
          {activeTab === 'wiring' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Pinout & Hardware Wiring Connections</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Define step-by-step breadboard and microcontroller pin routing tables.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddPinoutRow}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Wiring Connection</span>
                </button>
              </div>

              <div className="space-y-3">
                {pinoutList.map((pin, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-3">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Component Name</label>
                      <input
                        type="text"
                        value={pin.componentName}
                        onChange={(e) => handleUpdatePinout(idx, { ...pin, componentName: e.target.value })}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Module Pin</label>
                      <input
                        type="text"
                        value={pin.componentPin}
                        onChange={(e) => handleUpdatePinout(idx, { ...pin, componentPin: e.target.value })}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Board Pin</label>
                      <input
                        type="text"
                        value={pin.boardPin}
                        onChange={(e) => handleUpdatePinout(idx, { ...pin, boardPin: e.target.value })}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Wire Color</label>
                      <input
                        type="text"
                        value={pin.wireColor}
                        onChange={(e) => handleUpdatePinout(idx, { ...pin, wireColor: e.target.value })}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Notes</label>
                      <input
                        type="text"
                        value={pin.note || ''}
                        onChange={(e) => handleUpdatePinout(idx, { ...pin, note: e.target.value })}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-400"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemovePinout(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EMBEDDED C++ CODE */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Filename</label>
                  <input
                    type="text"
                    value={codeFilename}
                    onChange={(e) => setCodeFilename(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Language</label>
                  <input
                    type="text"
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">C++ / Arduino Firmware Source Code</label>
                <textarea
                  rows={12}
                  value={codeText}
                  onChange={(e) => setCodeText(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-emerald-400 font-mono text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Code Explanation & Libraries Used</label>
                <textarea
                  rows={3}
                  value={codeExplanation}
                  onChange={(e) => setCodeExplanation(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 6: INTERACTIVE SIMULATION */}
          {activeTab === 'simulation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-white text-xs flex items-center space-x-1.5">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Virtual Circuit Simulation Sliders & Inputs</span>
                </h4>
                <p className="text-slate-400 text-xs">
                  Configure real-time simulation controls for students to test signal values prior to ordering hardware.
                </p>
              </div>

              {simInputsList.map((inp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Input Label</label>
                    <input
                      type="text"
                      value={inp.label}
                      onChange={(e) => {
                        const next = [...simInputsList];
                        next[idx].label = e.target.value;
                        setSimInputsList(next);
                      }}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Min</label>
                    <input
                      type="number"
                      value={inp.min}
                      onChange={(e) => {
                        const next = [...simInputsList];
                        next[idx].min = Number(e.target.value);
                        setSimInputsList(next);
                      }}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Max</label>
                    <input
                      type="number"
                      value={inp.max}
                      onChange={(e) => {
                        const next = [...simInputsList];
                        next[idx].max = Number(e.target.value);
                        setSimInputsList(next);
                      }}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Default Value</label>
                    <input
                      type="number"
                      value={inp.defaultValue}
                      onChange={(e) => {
                        const next = [...simInputsList];
                        next[idx].defaultValue = Number(e.target.value);
                        setSimInputsList(next);
                      }}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Unit</label>
                    <input
                      type="text"
                      value={inp.unit}
                      onChange={(e) => {
                        const next = [...simInputsList];
                        next[idx].unit = e.target.value;
                        setSimInputsList(next);
                      }}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: AI TROUBLESHOOTER */}
          {activeTab === 'troubleshoot' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-white text-xs flex items-center space-x-1.5">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span>AI Troubleshooter Diagnostics & Presets</span>
                </h4>
                <p className="text-slate-400 text-xs">
                  Preset common hardware error symptoms, missing library fixes, or pinout checks used by Gemini AI when helping students debug.
                </p>
              </div>

              {troubleshooterTips.map((tip, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => {
                      const next = [...troubleshooterTips];
                      next[idx] = e.target.value;
                      setTroubleshooterTips(next);
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setTroubleshooterTips(troubleshooterTips.filter((_, i) => i !== idx))}
                    className="p-2 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setTroubleshooterTips([...troubleshooterTips, 'Check GND continuity and power rail voltages.'])}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Diagnostic Tip</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 hidden sm:block">
            {quizList.length < 3 && <span className="text-amber-400 font-bold">⚠️ Quiz needs {3 - quizList.length} more question(s) for completion requirement.</span>}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl text-xs shadow-lg flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save & Publish Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Change Modal */}
      {isImagePickerOpen && (
        <ImageChangeModal
          isOpen={isImagePickerOpen}
          onClose={() => setIsImagePickerOpen(false)}
          currentImageUrl={heroImage}
          onSelectImage={(newUrl) => {
            setHeroImage(newUrl);
            setIsImagePickerOpen(false);
          }}
          title="Pick Hero Banner Image for Project"
        />
      )}
    </div>
  );
};
