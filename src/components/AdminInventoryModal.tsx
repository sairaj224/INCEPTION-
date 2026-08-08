import React, { useState, useEffect } from 'react';
import { validateAndProcessFileUpload } from '../lib/fileUpload';
import { ImageChangeModal } from './ImageChangeModal';
import { AdminProjectEditorModal } from './AdminProjectEditorModal';
import {
  Product,
  Project,
  PlacedOrder,
  OrderStatus,
  Coupon,
  PromoBanner,
  AdminReview,
  CategoryData,
  ReturnRequest,
} from '../types';
import {
  X,
  Plus,
  Edit2,
  Check,
  Trash2,
  RotateCcw,
  Package,
  Tag,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  MapPin,
  GraduationCap,
  Image,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  User,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Layers,
  Percent,
  Megaphone,
  Star,
  Users,
  Search,
  Filter,
  BarChart2,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Send,
  HelpCircle,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface AdminInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (updated: Product) => void;
  onAddProduct: (newProd: Product) => void;
  onDeleteProduct: (prodId: string) => void;
  onResetProducts: () => void;
  orders: PlacedOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onAdminLogout?: () => void;
  projects?: Project[];
  onUpdateProject?: (updated: Project) => void;
  onAddProject?: (newProj: Project) => void;
  onDeleteProject?: (projId: string) => void;
}

// Initial Mock Coupons
const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'INCEPTION20',
    discountType: 'percent',
    discountValue: 20,
    minOrderValue: 500,
    maxUses: 100,
    timesUsed: 34,
    expiryDate: '2026-12-31',
    isActive: true,
    description: 'Welcome 20% discount on first robotics or IoT hardware kit order.',
  },
  {
    id: 'coup-2',
    code: 'LAB100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 800,
    maxUses: 50,
    timesUsed: 12,
    expiryDate: '2026-10-15',
    isActive: true,
    description: 'Flat ₹100 discount for college lab capstone projects.',
  },
  {
    id: 'coup-3',
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 300,
    maxUses: 200,
    timesUsed: 89,
    expiryDate: '2026-11-30',
    isActive: true,
    description: 'Hostel express delivery fee waiver.',
  },
];

// Initial Mock Promo Banners
const INITIAL_BANNERS: PromoBanner[] = [
  {
    id: 'ban-1',
    title: 'Semester Capstone Clearance Sale',
    subtitle: 'Get up to 25% discount on pre-bundled IoT & ESP32 Starter Kits with free lab guide.',
    ctaText: 'Explore Kits',
    ctaLink: 'projects',
    badgeText: 'Limited Stock Offer',
    bgGradient: 'from-blue-600 to-indigo-800',
    isActive: true,
  },
  {
    id: 'ban-2',
    title: 'Same-Day Campus Hostel Delivery',
    subtitle: 'Place your order before 2 PM and collect components directly from your Hostel Warden or Lab Assistant.',
    ctaText: 'Shop Store',
    ctaLink: 'marketplace',
    badgeText: 'Campus Express',
    bgGradient: 'from-emerald-600 to-teal-800',
    isActive: true,
  },
];

// Initial Categories & Subcategories
const INITIAL_CATEGORIES: CategoryData[] = [
  {
    id: 'cat-mcu',
    name: 'Microcontrollers',
    subcategories: ['Arduino', 'ESP32 / WiFi', 'Raspberry Pi', 'STM32 / ARM'],
    description: 'Development boards, SoC modules, and core processing units.',
  },
  {
    id: 'cat-sens',
    name: 'Sensors',
    subcategories: ['Environmental', 'Motion / Gyro', 'Optical / Camera', 'Biometric / Gas'],
    description: 'Transducers and sensing modules for physical data collection.',
  },
  {
    id: 'cat-act',
    name: 'Actuators',
    subcategories: ['DC Motors', 'Servo Motors', 'Stepper Motors', 'Relays & Switches'],
    description: 'Motion and power control outputs for electro-mechanical design.',
  },
  {
    id: 'cat-disp',
    name: 'Displays',
    subcategories: ['OLED Screens', 'LCD Displays', '7-Segment Displays', 'E-Paper'],
    description: 'Visual feedback units and graphical interface screens.',
  },
  {
    id: 'cat-pwr',
    name: 'Power & Accessories',
    subcategories: ['Batteries & BMS', 'Breadboards', 'Jumper Wires', 'Voltage Regulators'],
    description: 'Prototyping supplies, connectors, and power regulation.',
  },
];

// Initial Reviews for Moderation
const INITIAL_REVIEWS: AdminReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-esp32',
    productName: 'ESP32 Wi-Fi + Bluetooth Dev Board',
    reviewerName: 'Rohan Sharma',
    reviewerCollege: 'IIT Bombay - Electronics Dept',
    rating: 5,
    date: '2026-08-01',
    comment: 'Authentic ESP-WROOM-32 board. Wifi signal strength is solid in hostel rooms. Flashed MicroPython effortlessly.',
    status: 'Approved',
  },
  {
    id: 'rev-2',
    productId: 'prod-dht11',
    productName: 'DHT11 Temperature & Humidity Sensor',
    reviewerName: 'Priya Verma',
    reviewerCollege: 'BITS Pilani - Computer Science',
    rating: 4,
    date: '2026-08-02',
    comment: 'Works as expected with Arduino Uno using DHTlib. Readings are accurate within ±2°C.',
    status: 'Approved',
  },
  {
    id: 'rev-3',
    productId: 'prod-breadboard',
    productName: 'Solderless Breadboard 830 Point',
    reviewerName: 'Aman Patel',
    reviewerCollege: 'NIT Trichy - Electrical Engineering',
    rating: 5,
    date: '2026-08-03',
    comment: 'Clips are tight and hold jumper wires firmly. Must-have for first-year lab work.',
    status: 'Pending',
  },
];

export const AdminInventoryModal: React.FC<AdminInventoryModalProps> = ({
  isOpen,
  onClose,
  products = [],
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetProducts,
  orders = [],
  onUpdateOrderStatus,
  onDeleteOrder,
  onAdminLogout,
  projects = [],
  onUpdateProject,
  onAddProject,
  onDeleteProject,
}) => {
  // Navigation Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'inventory' | 'categories' | 'orders' | 'customers' | 'returns' | 'coupons' | 'banners' | 'reviews' | 'project_ideas'
  >('overview');

  // Project Ideas Edit & Create State
  const [editorProjectModalTarget, setEditorProjectModalTarget] = useState<Project | null>(null);
  const [isCreatingProjectWithEditorModal, setIsCreatingProjectWithEditorModal] = useState<boolean>(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjTitle, setEditProjTitle] = useState<string>('');
  const [editProjSubtitle, setEditProjSubtitle] = useState<string>('');
  const [editProjDifficulty, setEditProjDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [editProjHours, setEditProjHours] = useState<number>(2.5);
  const [editProjBudget, setEditProjBudget] = useState<number>(850);
  const [editProjDomain, setEditProjDomain] = useState<string>('Sensors');
  const [editProjImage, setEditProjImage] = useState<string>('');
  const [editProjDesc, setEditProjDesc] = useState<string>('');
  const [editProjObjectives, setEditProjObjectives] = useState<string>('');

  // New Project Idea Modal State
  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false);
  const [newProjTitle, setNewProjTitle] = useState<string>('');
  const [newProjSubtitle, setNewProjSubtitle] = useState<string>('');
  const [newProjDifficulty, setNewProjDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newProjHours, setNewProjHours] = useState<number>(3);
  const [newProjBudget, setNewProjBudget] = useState<number>(950);
  const [newProjDomain, setNewProjDomain] = useState<string>('Sensors');
  const [newProjImage, setNewProjImage] = useState<string>('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80');
  const [newProjDesc, setNewProjDesc] = useState<string>('');
  const [newProjObjectives, setNewProjObjectives] = useState<string>('Master circuit assembly, Understand sensor signal processing');

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('inception_admin_coupons');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COUPONS;
  });

  // Promo Banners State
  const [banners, setBanners] = useState<PromoBanner[]>(() => {
    try {
      const saved = localStorage.getItem('inception_admin_banners');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BANNERS;
  });

  // Category Structure State
  const [categories, setCategories] = useState<CategoryData[]>(() => {
    try {
      const saved = localStorage.getItem('inception_admin_categories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CATEGORIES;
  });

  // Reviews Moderation State
  const [reviews, setReviews] = useState<AdminReview[]>(() => {
    try {
      const saved = localStorage.getItem('inception_admin_reviews');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('inception_admin_coupons', JSON.stringify(coupons));
    } catch (e) { console.error(e); }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('inception_admin_banners', JSON.stringify(banners));
    } catch (e) { console.error(e); }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem('inception_admin_categories', JSON.stringify(categories));
    } catch (e) { console.error(e); }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('inception_admin_reviews', JSON.stringify(reviews));
    } catch (e) { console.error(e); }
  }, [reviews]);

  // Product Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');
  const [editImage, setEditImage] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('Sensors');
  const [editSubcategory, setEditSubcategory] = useState<string>('');
  const [editStock, setEditStock] = useState<boolean>(true);
  const [editStockQty, setEditStockQty] = useState<number>(10);

  // Add Product Form Toggle & State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Sensors');
  const [newSubcategory, setNewSubcategory] = useState<string>('');
  const [newPrice, setNewPrice] = useState<number>(150);
  const [newStockQty, setNewStockQty] = useState<number>(20);
  const [newDesc, setNewDesc] = useState<string>('');
  const [newImage, setNewImage] = useState<string>('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80');

  // Search & Filters
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'instock'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // New Category Form
  const [showAddCatModal, setShowAddCatModal] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatDesc, setNewCatDesc] = useState<string>('');
  const [newCatSubs, setNewCatSubs] = useState<string>('');

  // New Coupon Form
  const [showAddCouponModal, setShowAddCouponModal] = useState<boolean>(false);
  const [newCoupCode, setNewCoupCode] = useState<string>('');
  const [newCoupType, setNewCoupType] = useState<'percent' | 'fixed'>('percent');
  const [newCoupVal, setNewCoupVal] = useState<number>(15);
  const [newCoupMin, setNewCoupMin] = useState<number>(400);
  const [newCoupUses, setNewCoupUses] = useState<number>(50);
  const [newCoupExp, setNewCoupExp] = useState<string>('2026-12-31');

  // New Banner Form
  const [showAddBannerModal, setShowAddBannerModal] = useState<boolean>(false);
  const [newBanTitle, setNewBanTitle] = useState<string>('');
  const [newBanSubtitle, setNewBanSubtitle] = useState<string>('');
  const [newBanBadge, setNewBanBadge] = useState<string>('Special Offer');
  const [newBanGrad, setNewBanGrad] = useState<string>('from-blue-600 to-purple-800');

  // Order Note State
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  // Return Notes State
  const [returnNoteId, setReturnNoteId] = useState<string | null>(null);
  const [returnNoteText, setReturnNoteText] = useState<string>('');

  // Image Customizer Target State
  const [imageChangeTarget, setImageChangeTarget] = useState<{ title: string; currentUrl: string; onSave: (url: string) => void } | null>(null);

  if (!isOpen) return null;

  // Key Calculations for Analytics Dashboard
  const completedOrders = orders.filter((o) => o.status !== 'Cancelled');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;
  
  // Unique Customers calculation
  const customerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    collegeName: string;
    department: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
  }>();

  orders.forEach((o) => {
    const key = o.buyer.phone || o.buyer.email || o.buyer.name;
    const existing = customerMap.get(key);
    if (existing) {
      existing.totalOrders += 1;
      if (o.status !== 'Cancelled') existing.totalSpent += o.grandTotal;
      if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.createdAt;
      }
    } else {
      customerMap.set(key, {
        name: o.buyer.name,
        email: o.buyer.email,
        phone: o.buyer.phone,
        collegeName: o.buyer.collegeName,
        department: o.buyer.department,
        totalOrders: 1,
        totalSpent: o.status !== 'Cancelled' ? o.grandTotal : 0,
        lastOrderDate: o.createdAt,
      });
    }
  });

  const customersList = Array.from(customerMap.values());

  // Inventory Stock Calculations
  const lowStockProducts = products.filter((p) => p.inStock && ((p.stockQuantity ?? 10) <= 5));
  const outOfStockProducts = products.filter((p) => !p.inStock || (p.stockQuantity ?? 10) <= 0);

  // Return Requests list
  const returnOrdersList = orders.filter((o) => o.returnRequest);

  // Handlers for Product Edit & Stock Adjustments
  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setEditPrice(product.price);
    setEditName(product.name);
    setEditImage(product.image);
    setEditCategory(product.category);
    setEditSubcategory(product.subcategory || '');
    setEditStock(product.inStock);
    setEditStockQty(product.stockQuantity ?? 15);
  };

  const handleSaveEdit = (product: Product) => {
    const updatedStockQty = editStockQty >= 0 ? editStockQty : 0;
    onUpdateProduct({
      ...product,
      name: editName.trim() || product.name,
      price: editPrice >= 0 ? editPrice : product.price,
      image: editImage.trim() || product.image,
      category: editCategory,
      subcategory: editSubcategory,
      inStock: updatedStockQty > 0 ? editStock : false,
      stockQuantity: updatedStockQty,
    });
    setEditingId(null);
  };

  const handleQuickAdjustStock = (product: Product, delta: number) => {
    const currentQty = product.stockQuantity ?? 15;
    const nextQty = Math.max(0, currentQty + delta);
    onUpdateProduct({
      ...product,
      stockQuantity: nextQty,
      inStock: nextQty > 0,
    });
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProd: Product = {
      id: 'prod-custom-' + Date.now(),
      name: newName.trim(),
      category: newCategory,
      subcategory: newSubcategory.trim() || undefined,
      price: Number(newPrice) || 100,
      image: newImage.trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      description: newDesc.trim() || 'Custom component added by store administrator.',
      inStock: newStockQty > 0,
      stockQuantity: Number(newStockQty) || 10,
      isPopular: false,
      specs: {
        'Store Item': 'College Store Inventory',
        'Added Date': new Date().toLocaleDateString(),
      },
      detailGuide: {
        whyDoINeedThis: 'Required for college engineering experiments.',
        howDoesItWork: 'Operates as specified in college lab manual datasheets.',
        whatIfIDontUseIt: 'You can use an alternative equivalent component from the catalog.',
        realLifeApplications: ['College laboratory experiments', 'Capstone project prototyping'],
        alternativeComponents: ['Generic equivalent module'],
      },
    };

    onAddProduct(newProd);
    setNewName('');
    setNewDesc('');
    setNewPrice(150);
    setNewStockQty(20);
    setShowAddForm(false);
  };

  // Handlers for Project Idea Editing & Creation
  const handleStartEditProject = (proj: Project) => {
    setEditingProjectId(proj.id);
    setEditProjTitle(proj.title);
    setEditProjSubtitle(proj.subtitle);
    setEditProjDifficulty(proj.difficulty);
    setEditProjHours(proj.estimatedHours);
    setEditProjBudget(proj.estimatedBudget);
    setEditProjDomain(proj.domain);
    setEditProjImage(proj.heroImage);
    setEditProjDesc(proj.description);
    setEditProjObjectives((proj.learningObjectives || []).join(', '));
  };

  const handleSaveEditProject = (proj: Project) => {
    if (!onUpdateProject) return;
    const objectivesArray = editProjObjectives
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onUpdateProject({
      ...proj,
      title: editProjTitle.trim() || proj.title,
      subtitle: editProjSubtitle.trim() || proj.subtitle,
      difficulty: editProjDifficulty,
      estimatedHours: editProjHours > 0 ? editProjHours : proj.estimatedHours,
      estimatedBudget: editProjBudget >= 0 ? editProjBudget : proj.estimatedBudget,
      domain: editProjDomain as any,
      heroImage: editProjImage.trim() || proj.heroImage,
      description: editProjDesc.trim() || proj.description,
      learningObjectives: objectivesArray.length > 0 ? objectivesArray : proj.learningObjectives,
    });
    setEditingProjectId(null);
  };

  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !onAddProject) return;

    const objectivesArray = newProjObjectives
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newProj: Project = {
      id: 'proj-custom-' + Date.now(),
      title: newProjTitle.trim(),
      subtitle: newProjSubtitle.trim() || newProjTitle.trim(),
      difficulty: newProjDifficulty,
      estimatedHours: Number(newProjHours) || 2.5,
      estimatedBudget: Number(newProjBudget) || 950,
      domain: newProjDomain as any,
      heroImage: newProjImage.trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      description: newProjDesc.trim() || 'Custom engineering project idea added by admin.',
      learningObjectives: objectivesArray.length > 0 ? objectivesArray : ['Master hardware integration', 'Understand system logic'],
      bom: [
        { productId: products[0]?.id || 'prod-esp32', quantity: 1 },
        { productId: products[1]?.id || 'prod-breadboard', quantity: 1 },
      ],
      quiz: projects[0]?.quiz || [],
      pinoutTable: projects[0]?.pinoutTable || [],
      codeSnippet: projects[0]?.codeSnippet || {
        language: 'cpp',
        filename: 'main.ino',
        code: '// Arduino / ESP32 Code\nvoid setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n  delay(1000);\n}',
        explanation: 'Starter firmware sketch provided for testing.',
      },
      simulationConfig: projects[0]?.simulationConfig || {
        inputs: [],
        outputs: [],
        initialLogs: ['System booted successfully.'],
        simulationCode: () => ({ outputsState: {}, logMessage: 'Running' }),
      },
      facultyApproved: true,
      instructorName: 'Faculty Administrator',
      eWasteScore: {
        reusablePercent: 90,
        recyclablePackaging: true,
        carbonFootprint: 'Low',
      },
    };

    onAddProject(newProj);
    setNewProjTitle('');
    setNewProjSubtitle('');
    setNewProjDesc('');
    setShowAddProjectModal(false);
  };

  // Add Category Handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const subsArray = newCatSubs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newCat: CategoryData = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      subcategories: subsArray.length > 0 ? subsArray : ['General'],
      description: newCatDesc.trim() || 'Custom component category.',
    };

    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    setNewCatSubs('');
    setShowAddCatModal(false);
  };

  // Add Coupon Handler
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupCode.trim()) return;

    const newCoup: Coupon = {
      id: 'coup-' + Date.now(),
      code: newCoupCode.trim().toUpperCase(),
      discountType: newCoupType,
      discountValue: Number(newCoupVal) || 10,
      minOrderValue: Number(newCoupMin) || 0,
      maxUses: Number(newCoupUses) || 50,
      timesUsed: 0,
      expiryDate: newCoupExp || '2026-12-31',
      isActive: true,
      description: `Discount coupon ${newCoupCode.toUpperCase()}`,
    };

    setCoupons([...coupons, newCoup]);
    setNewCoupCode('');
    setShowAddCouponModal(false);
  };

  // Add Banner Handler
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanTitle.trim()) return;

    const newBan: PromoBanner = {
      id: 'ban-' + Date.now(),
      title: newBanTitle.trim(),
      subtitle: newBanSubtitle.trim() || 'Special campus promotion',
      ctaText: 'Explore Now',
      ctaLink: 'marketplace',
      badgeText: newBanBadge.trim() || 'Store Promo',
      bgGradient: newBanGrad,
      isActive: true,
    };

    setBanners([...banners, newBan]);
    setNewBanTitle('');
    setNewBanSubtitle('');
    setShowAddBannerModal(false);
  };

  // Return Request Actions
  const handleUpdateReturnStatus = (
    orderId: string,
    newReturnStatus: ReturnRequest['status'],
    notes?: string
  ) => {
    const targetOrder = orders.find((o) => o.orderId === orderId);
    if (!targetOrder || !targetOrder.returnRequest) return;

    const updatedReturn: ReturnRequest = {
      ...targetOrder.returnRequest,
      status: newReturnStatus,
      notes: notes !== undefined ? notes : targetOrder.returnRequest.notes,
    };

    // If approved / refunded, update main order status if needed
    onUpdateOrderStatus(
      orderId,
      newReturnStatus === 'Approved' || newReturnStatus === 'Refunded / Replaced' ? 'Cancelled' : targetOrder.status,
      `[Return Request: ${newReturnStatus}] ${notes || ''}`
    );

    // Save notes
    setReturnNoteId(null);
  };

  // Filtered Lists
  const filteredProducts = products.filter((p) => {
    const q = (searchFilter || '').toLowerCase();
    const matchesSearch =
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.subcategory ? (p.subcategory || '').toLowerCase().includes(q) : false);

    if (!matchesSearch) return false;

    if (stockFilter === 'low') return p.inStock && (p.stockQuantity ?? 10) <= 5;
    if (stockFilter === 'out') return !p.inStock || (p.stockQuantity ?? 10) <= 0;
    if (stockFilter === 'instock') return p.inStock && (p.stockQuantity ?? 10) > 5;
    return true;
  });

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
    const q = (searchFilter || '').toLowerCase();
    if (!q) return true;
    return (
      (o.orderId || '').toLowerCase().includes(q) ||
      (o.buyer?.name || '').toLowerCase().includes(q) ||
      (o.buyer?.phone || '').toLowerCase().includes(q) ||
      (o.buyer?.collegeName || '').toLowerCase().includes(q) ||
      (o.buyer?.email || '').toLowerCase().includes(q)
    );
  });

  const filteredReviews = reviews.filter((r) => {
    if (reviewStatusFilter !== 'All' && r.status !== reviewStatusFilter) return false;
    const q = (searchFilter || '').toLowerCase();
    if (!q) return true;
    return (
      (r.productName || '').toLowerCase().includes(q) ||
      (r.reviewerName || '').toLowerCase().includes(q) ||
      (r.comment || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 text-white sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-white tracking-tight">Store Owner & Admin Dashboard</h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-400 text-slate-950 rounded uppercase shadow-xs">
                  Owner Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full sales metrics, inventory, category structure, coupons, promo banners & orders dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (window.confirm('Reset catalog products & prices to default starter items?')) {
                  onResetProducts();
                }
              }}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold flex items-center space-x-1"
              title="Reset Catalog to Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            {onAdminLogout && (
              <button
                onClick={() => {
                  onAdminLogout();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all text-xs font-bold flex items-center space-x-1"
                title="Log Out of Admin Portal"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out Admin</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu Bar */}
        <div className="flex-shrink-0 bg-slate-950/60 border-b border-slate-800 px-4 pt-2 overflow-x-auto no-scrollbar flex items-center space-x-1 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalog Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('project_ideas')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'project_ideas'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Project Ideas ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Stock & Inventory</span>
            {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px]">
                {lowStockProducts.length + outOfStockProducts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
            {orders.filter((o) => o.status === 'Pending Confirmation').length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-blue-500 text-white rounded-full text-[10px] font-extrabold">
                {orders.filter((o) => o.status === 'Pending Confirmation').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'customers'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'returns'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Returns & Refunds</span>
            {returnOrdersList.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-[10px]">
                {returnOrdersList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'banners'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Promo Banners ({banners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ==================== TAB 1: OVERVIEW DASHBOARD ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Stat KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue KPI */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
                    <p className="text-2xl font-extrabold text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-emerald-400/80 flex items-center font-medium">
                      <TrendingUp className="w-3.5 h-3.5 mr-1" />
                      <span>{completedOrders.length} completed sales</span>
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                    <DollarSign className="w-7 h-7" />
                  </div>
                </div>

                {/* Total Orders KPI */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders Placed</p>
                    <p className="text-2xl font-extrabold text-white">{totalOrdersCount}</p>
                    <p className="text-[11px] text-blue-400 font-medium flex items-center">
                      <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                      <span>{orders.filter((o) => o.status === 'Pending Confirmation').length} pending approval</span>
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                </div>

                {/* Average Order Value KPI */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Order Value (AOV)</p>
                    <p className="text-2xl font-extrabold text-cyan-400">₹{averageOrderValue.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-cyan-400/80 font-medium">Per completed transaction</p>
                  </div>
                  <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
                    <BarChart2 className="w-7 h-7" />
                  </div>
                </div>

                {/* Total Customers KPI */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Campus Buyers</p>
                    <p className="text-2xl font-extrabold text-purple-400">{customersList.length}</p>
                    <p className="text-[11px] text-purple-400/80 font-medium">Unique student accounts</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
                    <Users className="w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Action Required Alert Banner */}
              {(lowStockProducts.length > 0 || outOfStockProducts.length > 0 || orders.filter((o) => o.status === 'Pending Confirmation').length > 0) && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-amber-200">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                    <div className="text-xs space-y-0.5">
                      <p className="font-extrabold text-white text-sm">Store Administrative Attention Needed</p>
                      <p>
                        You have <span className="font-bold text-amber-300">{orders.filter((o) => o.status === 'Pending Confirmation').length} pending orders</span> awaiting confirmation,{' '}
                        <span className="font-bold text-amber-300">{lowStockProducts.length} low-stock items</span>, and{' '}
                        <span className="font-bold text-rose-300">{outOfStockProducts.length} out-of-stock items</span>.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
                    >
                      Process Orders
                    </button>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
                    >
                      Restock Items
                    </button>
                  </div>
                </div>
              )}

              {/* Category Sales Breakdown & Store Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Category Distribution */}
                <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <span>Catalog Distribution by Category</span>
                    </h3>
                    <span className="text-xs text-slate-400">{products.length} total items</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.category === cat.name).length;
                      const percent = Math.round((count / Math.max(1, products.length)) * 100);

                      return (
                        <div key={cat.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-200">{cat.name}</span>
                            <span className="text-slate-400">{count} products ({percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, percent)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Store Operations Widget */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>Store Status Quick Control</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage global settings, quick coupons, and active sales banners.
                    </p>
                  </div>

                  <div className="space-y-3 my-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-700/60">
                      <span className="text-slate-300 font-medium">Active Coupons:</span>
                      <span className="font-extrabold text-emerald-400">{coupons.filter((c) => c.isActive).length} active</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-700/60">
                      <span className="text-slate-300 font-medium">Promo Banners:</span>
                      <span className="font-extrabold text-blue-400">{banners.filter((b) => b.isActive).length} live</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-700/60">
                      <span className="text-slate-300 font-medium">Pending Reviews:</span>
                      <span className="font-extrabold text-amber-400">{reviews.filter((r) => r.status === 'Pending').length} pending</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('coupons')}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all text-center"
                    >
                      Manage Coupons
                    </button>
                    <button
                      onClick={() => setActiveTab('banners')}
                      className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl transition-all text-center"
                    >
                      Edit Banners
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Orders Stream */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Recent Student Order Activity</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-blue-400 hover:underline font-bold flex items-center space-x-1"
                  >
                    <span>View All Orders ({orders.length})</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No student orders placed yet.</p>
                ) : (
                  <div className="divide-y divide-slate-700/60">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order.orderId} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-blue-400">
                            #{order.orderId.slice(-6)}
                          </div>
                          <div>
                            <p className="font-bold text-white">{order.buyer.name}</p>
                            <p className="text-slate-400 text-[11px]">{order.buyer.collegeName} • {order.items.length} items</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="font-extrabold text-emerald-400 text-sm">₹{order.grandTotal}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.status === 'Completed'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : order.status === 'Cancelled'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB 2: PRODUCTS CATALOG MANAGEMENT ==================== */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search product name, category..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Add Product Form Modal / Section */}
              {showAddForm && (
                <form
                  onSubmit={handleCreateProduct}
                  className="p-5 bg-slate-800 border border-blue-500/30 rounded-2xl space-y-4 animate-fadeIn"
                >
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Plus className="w-4 h-4 text-blue-400" />
                    <span>Create & Publish New Hardware Product</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ESP32-S3 Camera Module"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Subcategory (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. WiFi / BLE, Sensors"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Price (₹ INR) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Initial Stock Quantity</label>
                      <input
                        type="number"
                        min="0"
                        value={newStockQty}
                        onChange={(e) => setNewStockQty(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Product Photo</label>
                      <div className="flex items-center space-x-2">
                        <img src={newImage} alt="Preview" className="w-9 h-9 object-cover rounded-lg border border-slate-700 bg-white/5 shrink-0" />
                        <input
                          type="text"
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          placeholder="Image URL"
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                        />
                        <label className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold rounded-xl border border-blue-500/30 cursor-pointer text-xs flex items-center space-x-1 shrink-0 transition-all">
                          <Image className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const res = await validateAndProcessFileUpload(file);
                                if (res.success && res.dataUrl) setNewImage(res.dataUrl);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold text-xs mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Enter component details, datasheet summary, or lab requirements..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-slate-700 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 shadow-xs"
                    >
                      Save Product to Store
                    </button>
                  </div>
                </form>
              )}

              {/* Catalog Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((p) => {
                  const isEditing = editingId === p.id;

                  return (
                    <div
                      key={p.id}
                      className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all hover:border-slate-600"
                    >
                      {isEditing ? (
                        /* Edit Mode Form */
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="block text-slate-400 font-bold">Product Name</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-slate-400 font-bold">Price (₹)</label>
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-400 font-bold">Stock Qty</label>
                              <input
                                type="number"
                                value={editStockQty}
                                onChange={(e) => setEditStockQty(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-slate-400 font-bold">Category</label>
                              <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              >
                                {categories.map((c) => (
                                  <option key={c.id} value={c.name}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-slate-400 font-bold">In-Stock Toggle</label>
                              <select
                                value={editStock ? 'true' : 'false'}
                                onChange={(e) => setEditStock(e.target.value === 'true')}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              >
                                <option value="true">In Stock</option>
                                <option value="false">Out of Stock</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-400 font-bold mb-1">Product Photo</label>
                            <div className="flex items-center space-x-2">
                              <img src={editImage} alt="Preview" className="w-8 h-8 object-cover rounded-lg border border-slate-700 bg-white/5 shrink-0" />
                              <input
                                type="text"
                                value={editImage}
                                onChange={(e) => setEditImage(e.target.value)}
                                placeholder="Photo URL or Upload"
                                className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-xs"
                              />
                              <label className="px-2.5 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-bold rounded-lg border border-blue-500/40 cursor-pointer text-xs flex items-center space-x-1 shrink-0">
                                <Image className="w-3.5 h-3.5" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const res = await validateAndProcessFileUpload(file);
                                      if (res.success && res.dataUrl) setEditImage(res.dataUrl);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="flex items-center justify-end space-x-2 pt-2">
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(p)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Standard Product Display */
                        <>
                          <div className="flex items-start space-x-3">
                            <div className="relative group/img shrink-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-16 h-16 object-cover rounded-xl border border-slate-700 bg-white/5"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImageChangeTarget({
                                    title: `Change Photo for ${p.name}`,
                                    currentUrl: p.image,
                                    onSave: (newUrl) => onUpdateProduct({ ...p, image: newUrl }),
                                  });
                                }}
                                className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-blue-400 text-[10px] font-bold rounded-xl"
                                title="Change Component Photo"
                              >
                                <Image className="w-4 h-4 mb-0.5" />
                                <span>Change</span>
                              </button>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-700 rounded">
                                  {p.category}
                                </span>
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-extrabold rounded ${
                                    p.inStock && (p.stockQuantity ?? 10) > 5
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : p.inStock
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-rose-500/20 text-rose-300'
                                  }`}
                                >
                                  {p.inStock ? `${p.stockQuantity ?? 15} Units` : 'Out of Stock'}
                                </span>
                              </div>

                              <h4 className="font-bold text-sm text-white line-clamp-1 mt-1">{p.name}</h4>
                              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>

                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-extrabold text-emerald-400">₹{p.price}</span>
                                {p.subcategory && (
                                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                                    {p.subcategory}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-all flex items-center space-x-1"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                                <span>Edit Specs</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setImageChangeTarget({
                                    title: `Change Photo: ${p.name}`,
                                    currentUrl: p.image,
                                    onSave: (newUrl) => onUpdateProduct({ ...p, image: newUrl }),
                                  });
                                }}
                                className="px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold rounded-lg transition-all flex items-center space-x-1"
                              >
                                <Image className="w-3.5 h-3.5" />
                                <span>Change Photo</span>
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete product "${p.name}" permanently?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-lg transition-all flex items-center space-x-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: INVENTORY & STOCK MANAGEMENT ==================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Inventory Toolbar with Restock Filters and Add New Item Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <div className="flex items-center space-x-1 text-xs">
                  <button
                    onClick={() => setStockFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      stockFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    All Stock ({products.length})
                  </button>

                  <button
                    onClick={() => setStockFilter('low')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      stockFilter === 'low' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    Low Stock (≤5) ({lowStockProducts.length})
                  </button>

                  <button
                    onClick={() => setStockFilter('out')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      stockFilter === 'out' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    Out of Stock (0) ({outOfStockProducts.length})
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 ring-2 ring-emerald-500/30 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Item to Inventory</span>
                  </button>
                </div>
              </div>

              {/* Add New Item Form inside Inventory View */}
              {showAddForm && (
                <form
                  onSubmit={handleCreateProduct}
                  className="p-5 bg-slate-900/90 border-2 border-emerald-500/40 rounded-2xl space-y-4 animate-fadeIn shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                      <Plus className="w-4.5 h-4.5 text-emerald-400" />
                      <span>Add New Component / Item to Store Stocks</span>
                    </h3>
                    <span className="text-xs text-emerald-400 font-medium">Store Owner Admin Portal</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Item Title / Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ESP32-WROOM-32 Dev Board"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Category *</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Subcategory (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. WiFi & Bluetooth, Sensors"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Price (₹ INR) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Initial Stock Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        value={newStockQty}
                        onChange={(e) => setNewStockQty(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Component Image (Upload or Preset)</label>
                      <div className="space-y-1.5">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const res = await validateAndProcessFileUpload(file, { maxSizeMb: 5 });
                              if (res.success && res.dataUrl) {
                                setNewImage(res.dataUrl);
                              } else if (res.error) {
                                alert(res.error);
                              }
                            }
                          }}
                          className="block w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30 cursor-pointer"
                        />
                        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                          <button
                            type="button"
                            onClick={() => setNewImage('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 rounded border border-slate-700 shrink-0"
                          >
                            Microcontroller
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewImage('https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 rounded border border-slate-700 shrink-0"
                          >
                            Sensor
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewImage('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 rounded border border-slate-700 shrink-0"
                          >
                            Circuit
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewImage('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 rounded border border-slate-700 shrink-0"
                          >
                            Display
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold text-xs mb-1">Item Description & Lab Specs</label>
                    <textarea
                      rows={2}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Enter specs, datasheet notes, or pinout details..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                    >
                      ✓ Save & Add Item to Inventory
                    </button>
                  </div>
                </form>
              )}

              {/* Inventory Stock Table */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-200">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Product Component</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Stock Qty</th>
                        <th className="p-3">Stock Status</th>
                        <th className="p-3 text-right">Quick Stock Adjust & Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredProducts.map((p) => {
                        const stockQty = p.stockQuantity ?? 15;
                        const isLow = p.inStock && stockQty <= 5;
                        const isOut = !p.inStock || stockQty <= 0;

                        return (
                          <tr key={p.id} className="hover:bg-slate-800 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0 bg-white/5"
                                />
                                <div>
                                  <p className="font-bold text-white">{p.name}</p>
                                  <p className="text-[10px] text-slate-400">{p.id}</p>
                                </div>
                              </div>
                            </td>

                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-medium">
                                {p.category}
                              </span>
                            </td>

                            <td className="p-3 font-extrabold text-emerald-400">
                              ₹{p.price}
                            </td>

                            <td className="p-3 font-extrabold text-white">
                              {stockQty} units
                            </td>

                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                  isOut
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : isLow
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {isOut ? 'Out of Stock' : isLow ? 'Low Stock Warning' : 'In Stock'}
                              </span>
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  onClick={() => handleQuickAdjustStock(p, -5)}
                                  className="px-2 py-1 bg-slate-900 hover:bg-slate-700 text-rose-400 font-bold rounded border border-slate-700"
                                  title="Reduce 5 units"
                                >
                                  -5
                                </button>
                                <button
                                  onClick={() => handleQuickAdjustStock(p, -1)}
                                  className="px-2 py-1 bg-slate-900 hover:bg-slate-700 text-slate-300 font-bold rounded border border-slate-700"
                                  title="Reduce 1 unit"
                                >
                                  -1
                                </button>
                                <button
                                  onClick={() => handleQuickAdjustStock(p, 1)}
                                  className="px-2 py-1 bg-slate-900 hover:bg-slate-700 text-slate-300 font-bold rounded border border-slate-700"
                                  title="Add 1 unit"
                                >
                                  +1
                                </button>
                                <button
                                  onClick={() => handleQuickAdjustStock(p, 10)}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-xs mr-2"
                                  title="Restock 10 units"
                                >
                                  +10
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete "${p.name}" from inventory?`)) {
                                      onDeleteProduct(p.id);
                                    }
                                  }}
                                  className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded border border-rose-500/30"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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

          {/* ==================== TAB 4: CATEGORY / SUBCATEGORY MANAGEMENT ==================== */}
          {activeTab === 'categories' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <div>
                  <h3 className="text-sm font-bold text-white">Category & Subcategory Hierarchy</h3>
                  <p className="text-xs text-slate-400">Organize store components into logical lab classifications.</p>
                </div>
                <button
                  onClick={() => setShowAddCatModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Add Category Form Modal */}
              {showAddCatModal && (
                <form
                  onSubmit={handleAddCategory}
                  className="p-4 bg-slate-800 border border-blue-500/30 rounded-2xl space-y-3 text-xs"
                >
                  <h4 className="font-bold text-white text-sm">Add New Component Category</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Category Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Wireless & RF Modules"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Subcategories (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. LoRa, Zigbee, NRF24L01, Bluetooth"
                        value={newCatSubs}
                        onChange={(e) => setNewCatSubs(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Category Description</label>
                    <input
                      type="text"
                      placeholder="Brief description of hardware modules in this group..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddCatModal(false)}
                      className="px-3 py-1 bg-slate-700 text-slate-300 font-bold rounded-lg"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg">
                      Save Category
                    </button>
                  </div>
                </form>
              )}

              {/* Categories Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const productCount = products.filter((p) => p.category === cat.name).length;

                  return (
                    <div key={cat.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                            <Layers className="w-4 h-4 text-blue-400" />
                            <span>{cat.name}</span>
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                          {productCount} products
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subcategories:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subcategories.map((sub, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-700 text-[11px] font-medium">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== TAB 5: ORDERS MANAGEMENT ==================== */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Order Status Filter Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {['All', 'Pending Confirmation', 'Confirmed', 'Dispatched', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        orderStatusFilter === st ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st} ({st === 'All' ? orders.length : orders.filter((o) => o.status === st).length})
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, buyer name, college..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No orders found matching status filter "{orderStatusFilter}".
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm font-extrabold text-blue-400">#{order.orderId}</span>
                            <span className="text-xs text-slate-400">• {new Date(order.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Payment: <span className="font-bold text-white">{order.paymentMethod}</span>
                          </p>
                        </div>

                        {/* Order Status Controller */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-400">Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.orderId, e.target.value as OrderStatus)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold focus:outline-none ${
                              order.status === 'Completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : order.status === 'Cancelled'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            <option value="Pending Confirmation" className="bg-slate-900 text-white">Pending Confirmation</option>
                            <option value="Confirmed" className="bg-slate-900 text-white">Confirmed</option>
                            <option value="Dispatched" className="bg-slate-900 text-white">Dispatched</option>
                            <option value="Completed" className="bg-slate-900 text-white">Completed</option>
                            <option value="Cancelled" className="bg-slate-900 text-white">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Buyer Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-400 uppercase text-[10px]">Buyer Info</p>
                          <p className="font-bold text-white flex items-center"><User className="w-3.5 h-3.5 mr-1 text-blue-400" />{order.buyer.name}</p>
                          <p className="text-slate-300 flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-emerald-400" />{order.buyer.phone}</p>
                          <p className="text-slate-300 flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-cyan-400" />{order.buyer.email}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="font-bold text-slate-400 uppercase text-[10px]">Academic Details</p>
                          <p className="text-slate-200 flex items-center"><Building className="w-3.5 h-3.5 mr-1 text-purple-400" />{order.buyer.collegeName}</p>
                          <p className="text-slate-300 flex items-center"><GraduationCap className="w-3.5 h-3.5 mr-1 text-amber-400" />{order.buyer.department} • {order.buyer.yearOrRollNo}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="font-bold text-slate-400 uppercase text-[10px]">Delivery Campus Address</p>
                          <p className="text-slate-200 flex items-start"><MapPin className="w-3.5 h-3.5 mr-1 text-rose-400 shrink-0 mt-0.5" />{order.buyer.hostelAddress}</p>
                        </div>
                      </div>

                      {/* Order Items Table */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Hardware Items:</p>
                        <div className="divide-y divide-slate-700/60 bg-slate-900/40 rounded-xl p-3 border border-slate-700/60 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-1.5 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-slate-300">{item.quantity}x</span>
                                <span className="text-white font-medium">{item.productName}</span>
                              </div>
                              <span className="font-extrabold text-emerald-400">₹{item.price * item.quantity}</span>
                            </div>
                          ))}

                          <div className="pt-2 flex items-center justify-between font-extrabold text-sm text-white">
                            <span>Grand Total Paid:</span>
                            <span className="text-emerald-400 text-base">₹{order.grandTotal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Notes Section */}
                      <div className="flex items-center justify-between pt-2 text-xs">
                        <div className="text-slate-400 italic">
                          {order.ownerNotes ? `Notes: "${order.ownerNotes}"` : 'No owner notes attached.'}
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete order #${order.orderId}?`)) {
                              onDeleteOrder(order.orderId);
                            }
                          }}
                          className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-lg transition-all flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Order</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 6: CUSTOMER MANAGEMENT ==================== */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Registered Student Buyers Directory</h3>
                  <p className="text-xs text-slate-400">Contact details and transaction history for campus customers.</p>
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-bold text-xs rounded-xl border border-purple-500/30">
                  {customersList.length} total buyers
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customersList.map((cust, idx) => (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{cust.name}</h4>
                        <p className="text-xs text-slate-400">{cust.collegeName} • {cust.department}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                      <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />{cust.phone}</p>
                      <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />{cust.email}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400">Orders: <strong className="text-white">{cust.totalOrders}</strong></span>
                      <span className="text-slate-400">Total Spent: <strong className="text-emerald-400">₹{cust.totalSpent}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 7: RETURNS & REFUNDS MANAGEMENT ==================== */}
          {activeTab === 'returns' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <h3 className="text-sm font-bold text-white">Component Return & Replacement Requests</h3>
                <p className="text-xs text-slate-400">Review student return tickets for defective sensors or incorrect items.</p>
              </div>

              {returnOrdersList.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No pending or historical return requests logged.
                </div>
              ) : (
                <div className="space-y-4">
                  {returnOrdersList.map((ord) => {
                    const req = ord.returnRequest!;

                    return (
                      <div key={ord.orderId} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-2">
                          <div className="text-xs">
                            <span className="font-mono font-bold text-blue-400">Order #{ord.orderId}</span>
                            <span className="text-slate-400"> • Buyer: {ord.buyer.name} ({ord.buyer.phone})</span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              req.status === 'Approved' || req.status === 'Refunded / Replaced'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : req.status === 'Rejected'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 space-y-1">
                          <p><strong>Reason stated:</strong> "{req.reason}"</p>
                          <p className="text-slate-400">Requested date: {req.requestedAt}</p>
                        </div>

                        <div className="flex items-center space-x-2 pt-2 text-xs">
                          <button
                            onClick={() => handleUpdateReturnStatus(ord.orderId, 'Approved', 'Return approved by store owner.')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                          >
                            Approve Return
                          </button>
                          <button
                            onClick={() => handleUpdateReturnStatus(ord.orderId, 'Refunded / Replaced', 'Replacement item dispatched.')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
                          >
                            Mark Refunded / Replaced
                          </button>
                          <button
                            onClick={() => handleUpdateReturnStatus(ord.orderId, 'Rejected', 'Reason invalid.')}
                            className="px-3 py-1.5 bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 font-bold rounded-lg"
                          >
                            Reject Request
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 8: COUPONS & DISCOUNTS ==================== */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <div>
                  <h3 className="text-sm font-bold text-white">Discount Coupons & Campus Offers</h3>
                  <p className="text-xs text-slate-400">Create checkout promotional codes for lab teams.</p>
                </div>
                <button
                  onClick={() => setShowAddCouponModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              {/* Add Coupon Modal Form */}
              {showAddCouponModal && (
                <form onSubmit={handleAddCoupon} className="p-4 bg-slate-800 border border-blue-500/30 rounded-2xl space-y-3 text-xs">
                  <h4 className="font-bold text-white text-sm">Create New Discount Coupon</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CAPSTONE25"
                        value={newCoupCode}
                        onChange={(e) => setNewCoupCode(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Discount Type</label>
                      <select
                        value={newCoupType}
                        onChange={(e) => setNewCoupType(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="fixed">Flat Amount (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Discount Value *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newCoupVal}
                        onChange={(e) => setNewCoupVal(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Min Order Amount (₹)</label>
                      <input
                        type="number"
                        value={newCoupMin}
                        onChange={(e) => setNewCoupMin(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Max Redemption Limit</label>
                      <input
                        type="number"
                        value={newCoupUses}
                        onChange={(e) => setNewCoupUses(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button type="button" onClick={() => setShowAddCouponModal(false)} className="px-3 py-1 bg-slate-700 text-slate-300 font-bold rounded-lg">
                      Cancel
                    </button>
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg">
                      Save Coupon
                    </button>
                  </div>
                </form>
              )}

              {/* Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {coupons.map((c) => (
                  <div key={c.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-sm text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {c.code}
                      </span>
                      <button
                        onClick={() => {
                          setCoupons(coupons.map((item) => item.id === c.id ? { ...item, isActive: !item.isActive } : item));
                        }}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          c.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">{c.description}</p>

                    <div className="text-xs text-slate-400 space-y-0.5 pt-1 border-t border-slate-700/60">
                      <p>Discount: <strong className="text-white">{c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`} OFF</strong></p>
                      <p>Min Order: <strong className="text-white">₹{c.minOrderValue}</strong></p>
                      <p>Used: <strong className="text-white">{c.timesUsed} / {c.maxUses} times</strong></p>
                    </div>

                    <button
                      onClick={() => setCoupons(coupons.filter((item) => item.id !== c.id))}
                      className="w-full py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-lg transition-all"
                    >
                      Delete Coupon
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 9: PROMO BANNERS MANAGEMENT ==================== */}
          {activeTab === 'banners' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <div>
                  <h3 className="text-sm font-bold text-white">Storefront Hero Promotional Banners</h3>
                  <p className="text-xs text-slate-400">Manage announcements on the top store landing page.</p>
                </div>
                <button
                  onClick={() => setShowAddBannerModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Banner</span>
                </button>
              </div>

              {/* Add Banner Form */}
              {showAddBannerModal && (
                <form onSubmit={handleAddBanner} className="p-4 bg-slate-800 border border-blue-500/30 rounded-2xl space-y-3 text-xs">
                  <h4 className="font-bold text-white text-sm">Create New Promo Banner</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Banner Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Free Hostel Express Delivery"
                        value={newBanTitle}
                        onChange={(e) => setNewBanTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Badge Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Limited Offer"
                        value={newBanBadge}
                        onChange={(e) => setNewBanBadge(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Subtitle / Details</label>
                    <input
                      type="text"
                      placeholder="Order hardware components before 2 PM for same-day delivery..."
                      value={newBanSubtitle}
                      onChange={(e) => setNewBanSubtitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button type="button" onClick={() => setShowAddBannerModal(false)} className="px-3 py-1 bg-slate-700 text-slate-300 font-bold rounded-lg">
                      Cancel
                    </button>
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg">
                      Save Banner
                    </button>
                  </div>
                </form>
              )}

              {/* Banners List */}
              <div className="space-y-3">
                {banners.map((b) => (
                  <div key={b.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                        {b.badgeText || 'Promo'}
                      </span>
                      <button
                        onClick={() => {
                          setBanners(banners.map((item) => item.id === b.id ? { ...item, isActive: !item.isActive } : item));
                        }}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          b.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {b.isActive ? 'Live' : 'Hidden'}
                      </button>
                    </div>

                    <h4 className="font-extrabold text-white text-base">{b.title}</h4>
                    <p className="text-xs text-slate-300">{b.subtitle}</p>

                    <div className="flex items-center justify-end pt-2 border-t border-slate-700/60">
                      <button
                        onClick={() => setBanners(banners.filter((item) => item.id !== b.id))}
                        className="px-3 py-1 bg-rose-500/10 text-rose-400 font-bold text-xs rounded-lg"
                      >
                        Remove Banner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 10: REVIEW MODERATION ==================== */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <div className="flex items-center space-x-1 text-xs">
                  {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setReviewStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        reviewStatusFilter === st ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st} ({st === 'All' ? reviews.length : reviews.filter((r) => r.status === st).length})
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredReviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{rev.productName}</span>
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-extrabold">{rev.rating} / 5</span>
                      </div>
                    </div>

                    <p className="text-slate-300 italic">"{rev.comment}"</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-slate-400">
                      <span>By <strong>{rev.reviewerName}</strong> ({rev.reviewerCollege}) • {rev.date}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setReviews(reviews.map((r) => r.id === rev.id ? { ...r, status: 'Approved' } : r))}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setReviews(reviews.map((r) => r.id === rev.id ? { ...r, status: 'Rejected' } : r))}
                          className="px-2.5 py-1 bg-rose-600/20 text-rose-300 font-bold rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 11: PROJECT IDEAS & BOM KITS MANAGEMENT ==================== */}
          {activeTab === 'project_ideas' && (
            <div className="space-y-4">
              {/* Header Bar with Stats and Add Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Project Ideas & BOM Hardware Kits ({projects.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add new engineering project ideas, modify titles, descriptions, domain categories, difficulty levels, budget targets, or upload custom hero images.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsCreatingProjectWithEditorModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Project Idea</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid / List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => {
                  const isEditing = editingProjectId === proj.id;

                  return (
                    <div
                      key={proj.id}
                      className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-slate-600 transition-all"
                    >
                      {isEditing ? (
                        /* Editing Form */
                        <div className="space-y-3 text-xs">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                            <span className="font-extrabold text-amber-400">Editing Project Idea</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleSaveEditProject(proj)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center space-x-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={() => setEditingProjectId(null)}
                                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-lg"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-400">Project Title</label>
                              <input
                                type="text"
                                value={editProjTitle}
                                onChange={(e) => setEditProjTitle(e.target.value)}
                                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-400">Subtitle / Summary</label>
                              <input
                                type="text"
                                value={editProjSubtitle}
                                onChange={(e) => setEditProjSubtitle(e.target.value)}
                                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400">Domain</label>
                                <select
                                  value={editProjDomain}
                                  onChange={(e) => setEditProjDomain(e.target.value)}
                                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs"
                                >
                                  <option value="Sensors">Sensors</option>
                                  <option value="IoT & Cloud">IoT & Cloud</option>
                                  <option value="Robotics">Robotics</option>
                                  <option value="Automation">Automation</option>
                                  <option value="Audio/Visual">Audio/Visual</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400">Difficulty</label>
                                <select
                                  value={editProjDifficulty}
                                  onChange={(e) => setEditProjDifficulty(e.target.value as any)}
                                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs"
                                >
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Advanced">Advanced</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400">Budget (₹)</label>
                                <input
                                  type="number"
                                  value={editProjBudget}
                                  onChange={(e) => setEditProjBudget(Number(e.target.value))}
                                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-400">Hero Image URL</label>
                              <div className="flex space-x-2 mt-1">
                                <input
                                  type="text"
                                  value={editProjImage}
                                  onChange={(e) => setEditProjImage(e.target.value)}
                                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setImageChangeTarget({
                                      title: `Change Photo for ${proj.title}`,
                                      currentUrl: editProjImage,
                                      onSave: (newUrl) => setEditProjImage(newUrl),
                                    })
                                  }
                                  className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg font-bold text-xs"
                                >
                                  Upload / Pick
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-400">Detailed Description</label>
                              <textarea
                                value={editProjDesc}
                                onChange={(e) => setEditProjDesc(e.target.value)}
                                rows={3}
                                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Read-Only View */
                        <>
                          <div className="flex space-x-3">
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0 group/img">
                              <img
                                src={proj.heroImage}
                                alt={proj.title}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() =>
                                  setImageChangeTarget({
                                    title: `Change Photo for ${proj.title}`,
                                    currentUrl: proj.heroImage,
                                    onSave: (newUrl) => {
                                      if (onUpdateProject) {
                                        onUpdateProject({ ...proj, heroImage: newUrl });
                                      }
                                    },
                                  })
                                }
                                className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-amber-400 font-bold text-[10px] transition-all"
                              >
                                <Image className="w-5 h-5 mb-1" />
                                <span>Change Image</span>
                              </button>
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded uppercase">
                                  {proj.domain}
                                </span>
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                                  {proj.difficulty}
                                </span>
                              </div>

                              <h4 className="font-extrabold text-white text-sm truncate" title={proj.title}>
                                {proj.title}
                              </h4>
                              <p className="text-xs text-slate-400 line-clamp-2">
                                {proj.subtitle || proj.description}
                              </p>

                              <div className="flex items-center space-x-3 text-xs pt-1 text-slate-300 font-bold">
                                <span>Est. Budget: <strong className="text-emerald-400">₹{proj.estimatedBudget}</strong></span>
                                <span>Time: <strong>{proj.estimatedHours} hrs</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
                            <span className="text-slate-400 text-[11px]">
                              BOM Components: <strong className="text-slate-200">{proj.bom.length} items</strong>
                            </span>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditorProjectModalTarget(proj)}
                                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg font-bold flex items-center space-x-1"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit Project</span>
                              </button>

                              {onDeleteProject && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete project idea "${proj.title}"?`)) {
                                      onDeleteProject(proj.id);
                                    }
                                  }}
                                  className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-lg"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add New Project Idea Modal */}
              {showAddProjectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                  <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 text-white space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <h3 className="font-extrabold text-base">Add New Project Idea</h3>
                      </div>
                      <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateNewProject} className="space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Project Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Smart IoT Weather Station with ESP32"
                          value={newProjTitle}
                          onChange={(e) => setNewProjTitle(e.target.value)}
                          className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Subtitle / Tagline</label>
                        <input
                          type="text"
                          placeholder="e.g. Real-time temperature & atmospheric pressure telemetry."
                          value={newProjSubtitle}
                          onChange={(e) => setNewProjSubtitle(e.target.value)}
                          className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400">Domain</label>
                          <select
                            value={newProjDomain}
                            onChange={(e) => setNewProjDomain(e.target.value)}
                            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white text-xs"
                          >
                            <option value="Sensors">Sensors</option>
                            <option value="IoT & Cloud">IoT & Cloud</option>
                            <option value="Robotics">Robotics</option>
                            <option value="Automation">Automation</option>
                            <option value="Audio/Visual">Audio/Visual</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400">Difficulty</label>
                          <select
                            value={newProjDifficulty}
                            onChange={(e) => setNewProjDifficulty(e.target.value as any)}
                            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white text-xs"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400">Est. Budget (₹)</label>
                          <input
                            type="number"
                            value={newProjBudget}
                            onChange={(e) => setNewProjBudget(Number(e.target.value))}
                            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Hero Image URL</label>
                        <div className="flex space-x-2 mt-1">
                          <input
                            type="text"
                            value={newProjImage}
                            onChange={(e) => setNewProjImage(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setImageChangeTarget({
                                title: 'Upload or Select Photo for New Project',
                                currentUrl: newProjImage,
                                onSave: (newUrl) => setNewProjImage(newUrl),
                              })
                            }
                            className="px-3 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl font-bold text-xs"
                          >
                            Upload Photo
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Description</label>
                        <textarea
                          value={newProjDesc}
                          onChange={(e) => setNewProjDesc(e.target.value)}
                          placeholder="Describe what the student will build and learn..."
                          rows={3}
                          className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Learning Objectives (comma separated)</label>
                        <input
                          type="text"
                          value={newProjObjectives}
                          onChange={(e) => setNewProjObjectives(e.target.value)}
                          className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setShowAddProjectModal(false)}
                          className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl hover:bg-amber-400"
                        >
                          Publish Project Idea
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Logged in as Store Owner Admin. All catalog edits and price overrides persist locally.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
          >
            Close Admin Portal
          </button>
        </div>

        {/* Image Change Modal */}
        {imageChangeTarget && (
          <ImageChangeModal
            isOpen={!!imageChangeTarget}
            onClose={() => setImageChangeTarget(null)}
            title={imageChangeTarget.title}
            currentImageUrl={imageChangeTarget.currentUrl}
            onSaveImage={(newUrl) => {
              imageChangeTarget.onSave(newUrl);
              setImageChangeTarget(null);
            }}
          />
        )}

        {/* Full Admin Project Editor Modal for Edit */}
        {editorProjectModalTarget && (
          <AdminProjectEditorModal
            isOpen={!!editorProjectModalTarget}
            onClose={() => setEditorProjectModalTarget(null)}
            project={editorProjectModalTarget}
            allProducts={products}
            onSaveProject={(updatedProj) => {
              if (onUpdateProject) {
                onUpdateProject(updatedProj);
              }
              setEditorProjectModalTarget(null);
            }}
          />
        )}

        {/* Full Admin Project Editor Modal for Create */}
        {isCreatingProjectWithEditorModal && (
          <AdminProjectEditorModal
            isOpen={isCreatingProjectWithEditorModal}
            onClose={() => setIsCreatingProjectWithEditorModal(false)}
            project={null}
            allProducts={products}
            onSaveProject={(newProj) => {
              if (onAddProject) {
                onAddProject(newProj);
              }
              setIsCreatingProjectWithEditorModal(false);
            }}
          />
        )}

      </div>
    </div>
  );
};
