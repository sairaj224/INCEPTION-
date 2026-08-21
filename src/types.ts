export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type DomainCategory = 'Sensors' | 'IoT & Cloud' | 'Robotics' | 'Automation' | 'Audio/Visual';

export interface ComponentDetail {
  whyDoINeedThis: string;
  howDoesItWork: string;
  whatIfIDontUseIt: string;
  realLifeApplications: string[];
  alternativeComponents: string[];
}

export interface ProductReview {
  id: string;
  reviewerName: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedBuyer?: boolean;
}

export interface ProductVideoLesson {
  title: string;
  youtubeId: string;
  duration: string;
  instructor: string;
  description: string;
  keyTimestamps?: { time: string; topic: string }[];
}

export interface Product {
  id: string;
  name: string;
  category: 'Microcontrollers' | 'Sensors' | 'Actuators' | 'Displays' | 'Power & Accessories' | string;
  subcategory?: string;
  price: number; // in INR ₹
  image: string;
  description: string;
  inStock: boolean;
  stockQuantity?: number;
  specs: Record<string, string>;
  pinout?: string[];
  detailGuide: ComponentDetail;
  videoTutorial?: ProductVideoLesson;
  isPopular?: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: ProductReview[];
}

export interface BOMItem {
  productId: string;
  quantity: number;
  isOwned?: boolean; // User checked "I already have this"
  note?: string;
  alternativeProductId?: string; // Budget swap alternative
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PinConnection {
  componentName: string;
  componentPin: string;
  boardPin: string;
  wireColor: string;
  note?: string;
}

export interface SimulationInput {
  id: string;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  unit: string;
}

export interface SimulationOutput {
  id: string;
  label: string;
  type: 'led' | 'buzzer' | 'display' | 'servo' | 'relay' | 'cloud_log';
  activeConditionText: string;
}

export interface SimulationConfig {
  inputs: SimulationInput[];
  outputs: SimulationOutput[];
  initialLogs: string[];
  simulationCode: (inputs: Record<string, number>) => {
    outputsState: Record<string, boolean | number | string>;
    logMessage?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  estimatedBudget: number; // in INR ₹
  domain: DomainCategory;
  heroImage: string;
  description: string;
  learningObjectives: string[];
  bom: BOMItem[];
  quiz: QuizQuestion[];
  pinoutTable: PinConnection[];
  codeSnippet: {
    language: string;
    filename: string;
    code: string;
    explanation: string;
  };
  simulationConfig: SimulationConfig;
  facultyApproved?: boolean;
  instructorName?: string;
  eWasteScore: {
    reusablePercent: number;
    recyclablePackaging: boolean;
    carbonFootprint: 'Low' | 'Medium' | 'Negligible';
  };
}

export interface CommunityPost {
  id: string;
  projectId: string;
  studentName: string;
  studentCollege: string;
  studentAvatar: string;
  title: string;
  description: string;
  budgetSpent: number;
  timeTaken: string;
  photoUrl: string;
  likes: number;
  commentsCount: number;
  verifiedBuilt: boolean;
  postedAt: string;
}

export interface AIRecommendation {
  title: string;
  budget: number;
  difficulty: DifficultyLevel;
  timeCommitment: string;
  summary: string;
  whyRecommended: string;
  coreComponents: string[];
  learningOutcome: string;
}

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Hostel 14 Room 208", "Robotics Lab", "Home"
  address: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  phone: string;
  alternatePhone?: string;
  collegeName: string;
  department: string;
  yearOrRollNo: string;
  hostelAddress: string;
  city?: string;
  state?: string;
  pinCode?: string;
  landmark?: string;
  isLoggedIn: boolean;
  savedAddresses?: SavedAddress[];
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = 'Pending Confirmation' | 'Confirmed' | 'Dispatched' | 'Completed' | 'Cancelled';

export interface ReturnRequest {
  requestedAt: string;
  reason: string;
  notes?: string;
  status: 'Pending Approval' | 'Approved' | 'Refunded / Replaced' | 'Rejected';
}

export interface PlacedOrder {
  orderId: string;
  userId?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt?: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    collegeName: string;
    department: string;
    yearOrRollNo: string;
    hostelAddress: string;
    city?: string;
    state?: string;
    pinCode?: string;
    landmark?: string;
  };
  items: OrderItem[];
  subtotal: number;
  kitFee: number;
  discount: number;
  grandTotal: number;
  paymentMethod: string;
  status: OrderStatus;
  ownerNotes?: string;
  cancellationReason?: string;
  cancelledBy?: 'student' | 'owner' | 'system';
  returnRequest?: ReturnRequest;
  couponCode?: string;
  estimatedDelivery?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isOwnedDiscounted?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  timesUsed: number;
  expiryDate: string;
  isActive: boolean;
  description?: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  badgeText?: string;
  bgGradient?: string;
  isActive: boolean;
}

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  reviewerName: string;
  reviewerCollege: string;
  rating: number;
  date: string;
  comment: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface CategoryData {
  id: string;
  name: string;
  subcategories: string[];
  description: string;
}

export interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  cachingPerformance: boolean;
  marketing: boolean;
  hasConsented: boolean;
  updatedAt?: string;
}

export interface CacheStats {
  catalogItemsCount: number;
  projectsCount: number;
  cachedOrdersCount: number;
  totalStorageBytes: number;
  lastCachedAt: string;
  isOfflineReady: boolean;
}

// ==========================================
// INSPECTIONLABS LEARNING HUB TYPES
// ==========================================

export type SensorCategoryType = 'Temperature & Humidity' | 'Environmental & Gas' | 'Distance & Ranging' | 'Motion & Inertia' | 'Optical & Light' | 'Soil & Agriculture' | 'Identification & Security';

export interface PinoutGuideEntry {
  pinNumber: number;
  pinName: string;
  function: string;
  voltage: string;
  recommendedConnection: string;
}

export interface WiringStep {
  step: number;
  fromComponentPin: string;
  toBoardPin: string;
  wireColor: string;
  reason: string;
}

export interface CodeExample {
  platform: 'Arduino C++' | 'ESP32 MicroPython' | 'Raspberry Pi Python';
  title: string;
  librariesRequired: string[];
  code: string;
  explanation: string;
}

export interface SensorCommonMistake {
  mistake: string;
  consequence: string;
  fix: string;
}

export interface TroubleshootingEntry {
  symptom: string;
  probableCause: string;
  stepToFix: string;
}

export interface MiniProjectIdea {
  title: string;
  difficulty: DifficultyLevel;
  description: string;
  keyComponents: string[];
}

export interface VideoLesson {
  id: string;
  title: string;
  youtubeId: string;
  channel: string;
  duration: string;
  category: 'Sensors' | 'Microcontrollers' | 'Protocols' | 'Circuits' | 'IoT';
  summary: string;
  keyTakeaways: string[];
}

export interface SensorSimulationModel {
  parameterLabel: string;
  min: number;
  max: number;
  unit: string;
  defaultValue: number;
  outputFormulaText: string;
  step: number;
  interpretValue: (val: number) => {
    rawSignal: string;
    convertedValue: string;
    status: string;
    statusColor: 'emerald' | 'amber' | 'rose' | 'blue';
    technicalNote: string;
  };
}

export interface SensorTopic {
  id: string;
  name: string;
  modelNumber: string;
  category: SensorCategoryType;
  heroImage: string;
  summary: string;
  whatItMeasures: string;
  howItWorks: string;
  specs: {
    operatingVoltage: string;
    currentConsumption: string;
    measurementRange: string;
    accuracy: string;
    outputType: string;
    responseSpeed: string;
    interfacePinsCount: number;
  };
  applications: string[];
  pinoutGuide: PinoutGuideEntry[];
  circuitDiagram: {
    microcontroller: string;
    wiringSteps: WiringStep[];
    safetyNotes: string[];
  };
  codeExamples: CodeExample[];
  commonMistakes: SensorCommonMistake[];
  troubleshootingGuide: TroubleshootingEntry[];
  miniProjects: MiniProjectIdea[];
  videos: VideoLesson[];
  simulation: SensorSimulationModel;
}

export type ProtocolType = 'GPIO' | 'I2C' | 'SPI' | 'UART' | 'PWM' | 'ADC' | 'DAC' | 'Touch' | 'Power' | 'Ground' | 'Reset' | 'Strapping';

export interface BoardPin {
  id: string;
  pinSequence: number;
  pinName: string;
  side: 'left' | 'right' | 'top' | 'bottom';
  primaryType: 'GPIO' | 'Power' | 'Ground' | 'Analog' | 'Reset' | 'Special';
  protocols: ProtocolType[];
  voltage: string;
  maxCurrentMa: number;
  pullUpAvailable: boolean;
  isStrappingPin?: boolean;
  isInputOnly?: boolean;
  safeForBoot: boolean;
  description: string;
  recommendedUse: string;
  cautionWarning?: string;
}

export interface MicrocontrollerBoard {
  id: string;
  name: string;
  shortName: string;
  manufacturer: string;
  chipset: string;
  architecture: string;
  clockSpeed: string;
  operatingVoltage: string;
  inputVoltageVin: string;
  flashMemory: string;
  sram: string;
  wirelessConnectivity: string;
  totalPins: number;
  gpioPinsCount: number;
  adcPinsCount: number;
  pwmPinsCount: number;
  i2cCount: number;
  spiCount: number;
  uartCount: number;
  heroImage: string;
  overview: string;
  bestUsedFor: string[];
  criticalWarnings: string[];
  layoutType: 'dual-inline-30' | 'dual-inline-38' | 'arduino-uno' | 'pico-40' | 'rpi-40';
  pins: BoardPin[];
  videos: VideoLesson[];
}

export interface LearningPathStage {
  id: string;
  stageNumber: number;
  title: string;
  badgeName: string;
  badgeIcon: string;
  estimatedMinutes: number;
  shortSummary: string;
  learningObjectives: string[];
  keyConcepts: {
    heading: string;
    explanation: string;
    practicalTakeaway: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  videos?: VideoLesson[];
}


