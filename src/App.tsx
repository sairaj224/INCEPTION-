import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_PROJECTS, MOCK_COMMUNITY_POSTS } from './data/mockData';
import { Project, Product, CartItem, AIRecommendation, CommunityPost, UserProfile, PlacedOrder, OrderStatus } from './types';
import { Header } from './components/Header';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailView } from './components/ProjectDetailView';
import { SingleProductDetailView } from './components/SingleProductDetailView';
import { ProjectFinderModal } from './components/ProjectFinderModal';
import { MarketplaceView } from './components/MarketplaceView';
import { CommunityShowcase } from './components/CommunityShowcase';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AdminInventoryModal } from './components/AdminInventoryModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ContactSupportModal } from './components/ContactSupportModal';
import { WatchlistModal } from './components/WatchlistModal';
import { BuyerLoginModal } from './components/BuyerLoginModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { CookieSettingsModal } from './components/CookieSettingsModal';
import { LegalModal } from './components/LegalModal';
import { CacheSettingsModal } from './components/CacheSettingsModal';
import { SitemapModal } from './components/SitemapModal';
import { ErrorLogModal } from './components/ErrorLogModal';
import { SupabaseModal } from './components/SupabaseModal';
import { Footer } from './components/Footer';
import { LearningHubMain } from './components/LearningHub/LearningHubMain';
import { CookiePreferences } from './types';
import { AppLogger } from './lib/logger';
import { createSlug, updateProductSchemaJsonLd } from './lib/seo';
import { subscribeToProducts, syncAllProductsToFirestore, seedProductsToFirestoreIfEmpty, subscribeToUserOrders, subscribeToAllOrders } from './lib/firebase';
import { isSupabaseConfigured, fetchSupabaseProducts, fetchSupabaseProjects, saveSupabaseProduct, saveSupabaseProject, createSupabaseOrder, saveSupabaseUserProfile } from './lib/supabase';
import { Search, Sparkles, Filter, IndianRupee, Cpu, ShieldAlert, User, LogIn, UserCheck, Database } from 'lucide-react';

const PRODUCTS_STORAGE_KEY = 'inception_college_products';
const PROJECTS_STORAGE_KEY = 'inception_college_projects';
const PROFILE_STORAGE_KEY = 'inception_user_profile';
const ORDERS_STORAGE_KEY = 'inception_orders_list';
const WATCHLIST_PROJECTS_KEY = 'inception_watchlist_projects';
const WATCHLIST_PRODUCTS_KEY = 'inception_watchlist_products';
const ADMIN_AUTH_STORAGE_KEY = 'inception_admin_authenticated';
const COOKIES_STORAGE_KEY = 'inception_cookie_preferences';
const THEME_STORAGE_KEY = 'inception_theme_preference';

export default function App() {
  const [activeTab, setActiveTab] = useState<'projects' | 'marketplace' | 'learn'>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // User Role State ('student' vs 'owner') strictly tied to authentication
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [userRole, setUserRole] = useState<'student' | 'owner'>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true' ? 'owner' : 'student';
    } catch {
      return 'student';
    }
  });

  // Dynamic Products State with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved products', e);
    }
    return MOCK_PRODUCTS;
  });

  // Dynamic Project Ideas State with localStorage persistence
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved projects', e);
    }
    return MOCK_PROJECTS;
  });

  // User Profile State with localStorage persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.isLoggedIn) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved profile', e);
    }
    return {
      id: '',
      name: '',
      email: '',
      phone: '',
      collegeName: '',
      department: '',
      yearOrRollNo: '',
      hostelAddress: '',
      isLoggedIn: false,
    };
  });

  // Placed Orders State with localStorage persistence & Firestore syncing
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved orders', e);
    }
    return [];
  });

  // Pending action after auth (e.g. user clicked Add to Cart or Buy Now before logging in)
  const [pendingAuthAction, setPendingAuthAction] = useState<{
    type: 'addToCart' | 'buyNow' | 'addBom';
    product?: Product;
    quantity?: number;
    items?: { product: Product; quantity: number }[];
  } | null>(null);

  // Cart & Owned Components State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [ownedProductIds, setOwnedProductIds] = useState<Set<string>>(new Set(['prod-breadboard', 'prod-jumpers'])); // Pre-owned basic breadboard
  const [isStudentVerified, setIsStudentVerified] = useState<boolean>(true);

  // Modals & Watchlist State
  const [isFinderOpen, setIsFinderOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSubOpen, setIsSubOpen] = useState<boolean>(false);
  const [isAdminInventoryOpen, setIsAdminInventoryOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isBuyerLoginOpen, setIsBuyerLoginOpen] = useState<boolean>(false);
  const [buyerLoginMessage, setBuyerLoginMessage] = useState<string>('');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [adminLoginMessage, setAdminLoginMessage] = useState<string>('');
  const [supportTargetOrderId, setSupportTargetOrderId] = useState<string | undefined>(undefined);

  // Cookie & Privacy Preferences State
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(() => {
    try {
      const saved = localStorage.getItem(COOKIES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load cookie preferences', e);
    }
    return {
      essential: true,
      analytics: true,
      cachingPerformance: true,
      marketing: true,
      hasConsented: false,
    };
  });

  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy'>('terms');
  const [isCacheSettingsOpen, setIsCacheSettingsOpen] = useState<boolean>(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const [isErrorLogOpen, setIsErrorLogOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  // Theme Preference State ('dark' | 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      console.error('Failed to load theme preference', e);
    }
    return 'dark'; // Default sleek engineering dark/slate aesthetic
  });

  // Sync theme with HTML document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initialize global error listener, SEO structured data, and Firestore real-time sync
  useEffect(() => {
    AppLogger.initializeGlobalErrorListeners();
    updateProductSchemaJsonLd(products);
  }, [products]);

  // Real-time sync for products from Firestore
  useEffect(() => {
    seedProductsToFirestoreIfEmpty(MOCK_PRODUCTS).catch((err) => {
      console.warn('Firestore initial seeding warning:', err);
    });

    const unsubscribe = subscribeToProducts((firestoreProducts) => {
      if (firestoreProducts && firestoreProducts.length > 0) {
        setProducts(firestoreProducts);
      }
    });

    // Supabase load on mount if configured
    if (isSupabaseConfigured()) {
      fetchSupabaseProducts()
        .then((supProds) => {
          if (supProds && supProds.length > 0) {
            setProducts(supProds);
          }
        })
        .catch((err) => {
          console.warn('Supabase products fetch warning:', err);
        });

      fetchSupabaseProjects()
        .then((supProjs) => {
          if (supProjs && supProjs.length > 0) {
            setProjects(supProjs);
          }
        })
        .catch((err) => {
          console.warn('Supabase projects fetch warning:', err);
        });
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Real-time sync for orders from Firestore based on logged-in user or store owner role
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (userRole === 'owner') {
      unsubscribe = subscribeToAllOrders((allOrders) => {
        if (allOrders) setOrders(allOrders);
      });
    } else if (userProfile.id && userProfile.isLoggedIn) {
      unsubscribe = subscribeToUserOrders(userProfile.id, (userOrders) => {
        if (userOrders) setOrders(userOrders);
      });
    }
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userProfile.id, userProfile.isLoggedIn, userRole]);

  const handleSaveCookiePreferences = (prefs: CookiePreferences) => {
    setCookiePreferences(prefs);
    try {
      localStorage.setItem(COOKIES_STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error('Failed to save cookie preferences', e);
    }
  };

  const handleOpenLegalTerms = () => {
    setLegalModalTab('terms');
    setIsLegalModalOpen(true);
  };

  const handleOpenLegalPrivacy = () => {
    setLegalModalTab('privacy');
    setIsLegalModalOpen(true);
  };

  const handleClearAllCache = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    setProducts(MOCK_PRODUCTS);
    setOrders([]);
    setWatchlistProjectIds(new Set(['proj-iot-env']));
    setWatchlistProductIds(new Set(['prod-esp32']));
    handleSaveCookiePreferences({
      essential: true,
      analytics: true,
      cachingPerformance: true,
      marketing: true,
      hasConsented: false,
    });
  };

  const handleForceRefreshCatalog = () => {
    setProducts(MOCK_PRODUCTS);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    } catch (e) {
      console.error(e);
    }
  };


  const handleOpenBuyerLogin = (msg?: string) => {
    setBuyerLoginMessage(msg || 'Log in or create a student buyer account to complete your purchase and claim campus discounts.');
    setIsBuyerLoginOpen(true);
  };

  const handleOpenAdminLogin = (msg?: string) => {
    setAdminLoginMessage(msg || 'Log in with Store Owner credentials to access inventory control & price editing.');
    setIsAdminLoginOpen(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setUserRole('owner');
    try {
      localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAdminInventoryOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setUserRole('student');
    try {
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setIsAdminInventoryOpen(false);
  };

  // Watchlist Persistence State
  const [watchlistProjectIds, setWatchlistProjectIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_PROJECTS_KEY);
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load watchlist projects', e);
    }
    return new Set(['proj-iot-env']); // Pre-saved default
  });

  const [watchlistProductIds, setWatchlistProductIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_PRODUCTS_KEY);
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load watchlist products', e);
    }
    return new Set(['prod-esp32']); // Pre-saved default
  });

  const handleToggleWatchlistProject = (projectId: string) => {
    setWatchlistProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      try {
        localStorage.setItem(WATCHLIST_PROJECTS_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error('Failed to save watchlist projects', e);
      }
      return next;
    });
  };

  const handleToggleWatchlistProduct = (productId: string) => {
    setWatchlistProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      try {
        localStorage.setItem(WATCHLIST_PRODUCTS_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error('Failed to save watchlist products', e);
      }
      return next;
    });
  };

  const handleClearWatchlist = () => {
    setWatchlistProjectIds(new Set());
    setWatchlistProductIds(new Set());
    localStorage.removeItem(WATCHLIST_PROJECTS_KEY);
    localStorage.removeItem(WATCHLIST_PRODUCTS_KEY);
  };

  const handleOpenSupport = (orderId?: string) => {
    setSupportTargetOrderId(orderId);
    setIsSupportOpen(true);
  };

  // Community Posts
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);

  // Filtering State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<number>(1500);

  // Helper to persist products to state, localStorage & Cloud Firestore / Supabase safely
  const updateAndPersistProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    syncAllProductsToFirestore(newProducts);
    if (isSupabaseConfigured()) {
      newProducts.forEach((p) => saveSupabaseProduct(p));
    }
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
    } catch (e) {
      console.warn('LocalStorage quota limit reached when persisting products. Attempting payload optimization...', e);
      try {
        // Strip heavy base64 images (>50KB) to fit within browser localStorage quota
        const optimizedProducts = newProducts.map((p) => {
          if (p.image && p.image.startsWith('data:') && p.image.length > 50000) {
            return {
              ...p,
              image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
            };
          }
          return p;
        });
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(optimizedProducts));
      } catch (err) {
        console.warn('LocalStorage quota still exceeded. State retained safely in application memory.', err);
      }
    }
  };

  // Helper to persist project ideas to state & localStorage / Supabase safely
  const updateAndPersistProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    if (isSupabaseConfigured()) {
      newProjects.forEach((p) => saveSupabaseProject(p));
    }
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(newProjects));
    } catch (e) {
      console.warn('LocalStorage quota limit reached when persisting projects.', e);
    }
  };

  const handleUpdateProject = (updated: Project) => {
    const next = projects.map((p) => (p.id === updated.id ? updated : p));
    updateAndPersistProjects(next);
    if (selectedProject?.id === updated.id) {
      setSelectedProject(updated);
    }
  };

  const handleAddProject = (newProj: Project) => {
    const next = [newProj, ...projects];
    updateAndPersistProjects(next);
  };

  const handleDeleteProject = (projId: string) => {
    const next = projects.filter((p) => p.id !== projId);
    updateAndPersistProjects(next);
    if (selectedProject?.id === projId) {
      setSelectedProject(null);
    }
  };

  const handleResetProjects = () => {
    updateAndPersistProjects(MOCK_PROJECTS);
    localStorage.removeItem(PROJECTS_STORAGE_KEY);
  };

  const handleChangeProjectPhoto = (projectId: string, newPhotoUrl: string) => {
    const next = projects.map((p) =>
      p.id === projectId ? { ...p, heroImage: newPhotoUrl } : p
    );
    updateAndPersistProjects(next);
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => (prev ? { ...prev, heroImage: newPhotoUrl } : null));
    }
  };

  // Helper to persist profile
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    if (isSupabaseConfigured()) {
      saveSupabaseUserProfile(updatedProfile);
    }
    if (updatedProfile.isLoggedIn) {
      setUserRole('student');
      setIsAdminAuthenticated(false);
      try {
        localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
    }
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  // Helper to persist orders
  const updateAndPersistOrders = (newOrders: PlacedOrder[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  };

  const handlePlaceOrder = (newOrder: PlacedOrder) => {
    const updated = [newOrder, ...orders];
    updateAndPersistOrders(updated);
    if (isSupabaseConfigured()) {
      createSupabaseOrder({
        id: newOrder.orderId,
        userEmail: newOrder.buyer?.email || 'guest@student.edu',
        items: newOrder.items || [],
        totalAmount: newOrder.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0,
        deliveryMethod: newOrder.buyer?.hostelAddress ? 'hostel' : 'pickup',
        hostelRoom: newOrder.buyer?.hostelAddress || '',
      });
    }
  };

  const handleCancelOrder = (orderId: string, reason?: string) => {
    const updated = orders.map((o) =>
      o.orderId === orderId
        ? {
            ...o,
            status: 'Cancelled' as OrderStatus,
            cancellationReason: reason || 'Cancelled by request',
            cancelledBy: userRole === 'owner' ? ('owner' as const) : ('student' as const),
          }
        : o
    );
    updateAndPersistOrders(updated);
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, notes?: string) => {
    const updated = orders.map((o) =>
      o.orderId === orderId
        ? { ...o, status: newStatus, ownerNotes: notes !== undefined ? notes : o.ownerNotes }
        : o
    );
    updateAndPersistOrders(updated);
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.orderId !== orderId);
    updateAndPersistOrders(updated);
  };

  // Product Management Handlers for Store Owner / Admin
  const handleUpdateProduct = (updated: Product) => {
    const next = products.map((p) => (p.id === updated.id ? updated : p));
    updateAndPersistProducts(next);
  };

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    const next = products.map((p) => (p.id === productId ? { ...p, price: newPrice } : p));
    updateAndPersistProducts(next);
  };

  const handleAddProduct = (newProd: Product) => {
    const next = [newProd, ...products];
    updateAndPersistProducts(next);
  };

  const handleDeleteProduct = (prodId: string) => {
    const next = products.filter((p) => p.id !== prodId);
    updateAndPersistProducts(next);
  };

  const handleResetProducts = () => {
    updateAndPersistProducts(MOCK_PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  };

  // Dynamic Products Map (calculates project BOM totals dynamically using live prices)
  const productsMap = new Map<string, Product>();
  products.forEach((p) => productsMap.set(p.id, p));

  // Toggle Owned Product
  const handleToggleOwnedProduct = (productId: string) => {
    setOwnedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product, quantity = 1) => {
    if (!userProfile.isLoggedIn) {
      setPendingAuthAction({ type: 'addToCart', product, quantity });
      setBuyerLoginMessage('Please verify your email with OTP and complete your details to add components to your cart.');
      setIsBuyerLoginOpen(true);
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  // Add Entire Filtered BOM to Cart
  const handleAddBomToCart = (items: { product: Product; quantity: number }[]) => {
    if (!userProfile.isLoggedIn) {
      setPendingAuthAction({ type: 'addBom', items });
      setBuyerLoginMessage('Please verify your email with OTP and complete your details to add project kit to cart.');
      setIsBuyerLoginOpen(true);
      return;
    }
    items.forEach((item) => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.product.id === item.product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === item.product.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        }
        return [...prev, { product: item.product, quantity: item.quantity }];
      });
    });
    setIsCartOpen(true);
  };

  const handleAddProjectKitToCart = (project: Project) => {
    const itemsToAdd = project.bom
      .map((b) => {
        const prod = productsMap.get(b.productId);
        if (prod) return { product: prod, quantity: b.quantity };
        return null;
      })
      .filter(Boolean) as { product: Product; quantity: number }[];

    if (itemsToAdd.length > 0) {
      handleAddBomToCart(itemsToAdd);
    }
  };

  // Handle AI Recommendation Selection
  const handleSelectRecommendedProject = (rec: AIRecommendation) => {
    const recTitle = (rec.title || '').toLowerCase();
    const matched = projects.find(
      (p) => {
        const pTitle = (p.title || '').toLowerCase();
        return pTitle.includes(recTitle) || recTitle.includes(pTitle);
      }
    );

    if (matched) {
      setSelectedProject(matched);
    } else {
      const customProj: Project = {
        id: 'proj-ai-' + Date.now(),
        title: rec.title,
        subtitle: rec.summary,
        difficulty: rec.difficulty,
        estimatedHours: 2.5,
        estimatedBudget: rec.budget,
        domain: 'Sensors',
        heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        description: `${rec.summary} ${rec.whyRecommended}`,
        learningObjectives: [rec.learningOutcome, 'Master component compatibility and circuit logic'],
        bom: [
          { productId: 'prod-esp32', quantity: 1 },
          { productId: 'prod-mq2', quantity: 1 },
          { productId: 'prod-breadboard', quantity: 1 },
          { productId: 'prod-jumpers', quantity: 1 },
        ],
        quiz: projects[0]?.quiz || MOCK_PROJECTS[0].quiz,
        pinoutTable: projects[0]?.pinoutTable || MOCK_PROJECTS[0].pinoutTable,
        codeSnippet: projects[0]?.codeSnippet || MOCK_PROJECTS[0].codeSnippet,
        simulationConfig: projects[0]?.simulationConfig || MOCK_PROJECTS[0].simulationConfig,
        facultyApproved: true,
        instructorName: 'Inception AI Guide',
        eWasteScore: { reusablePercent: 92, recyclablePackaging: true, carbonFootprint: 'Low' },
      };
      setSelectedProject(customProj);
    }
  };

  // Filter Projects
  const filteredProjects = projects.filter((proj) => {
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch =
      (proj.title || '').toLowerCase().includes(q) ||
      (proj.description || '').toLowerCase().includes(q);
    const matchesDiff = selectedDifficulty === 'All' || proj.difficulty === selectedDifficulty;
    const matchesDomain = selectedDomain === 'All' || proj.domain === selectedDomain;
    const matchesBudget = proj.estimatedBudget <= maxBudgetFilter;
    return matchesSearch && matchesDiff && matchesDomain && matchesBudget;
  });

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden font-sans antialiased flex flex-col justify-between selection:bg-blue-500 selection:text-white transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div>
        {/* App Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedProject(null);
            setSelectedProduct(null);
          }}
          cartCount={cartTotalCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenFinder={() => setIsFinderOpen(true)}
          onOpenSubscription={() => setIsSubOpen(true)}
          isStudentVerified={isStudentVerified}
          userRole={userRole}
          setUserRole={setUserRole}
          onOpenAdminInventory={() => {
            if (!isAdminAuthenticated) {
              handleOpenAdminLogin("Please authenticate as Store Owner to open the Admin Inventory & Prices Dashboard.");
            } else {
              setIsAdminInventoryOpen(true);
            }
          }}
          userProfile={userProfile}
          onOpenProfile={() => {
            if (!userProfile.isLoggedIn) {
              handleOpenBuyerLogin("Sign in to view your college buyer account profile and orders.");
            } else {
              setIsProfileOpen(true);
            }
          }}
          onOpenBuyerLogin={handleOpenBuyerLogin}
          isAdminAuthenticated={isAdminAuthenticated}
          onOpenAdminLogin={handleOpenAdminLogin}
          onAdminLogout={handleAdminLogout}
          onOpenSupport={() => handleOpenSupport()}
          watchlistCount={watchlistProjectIds.size + watchlistProductIds.size}
          onOpenWatchlist={() => setIsWatchlistOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Active Role Banner */}
        {isAdminAuthenticated ? (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-200 font-medium">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>STORE OWNER ADMIN PORTAL ACTIVE:</strong> You are logged in with Admin credentials. Manage prices, inventory, and confirm student orders.
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAdminInventoryOpen(true)}
                className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400 text-[11px] transition-colors shadow-sm"
              >
                Open Admin Dashboard
              </button>
              <button
                onClick={handleAdminLogout}
                className="px-2 py-1 bg-slate-900 hover:bg-rose-900/40 text-rose-300 rounded text-[11px] border border-slate-700 transition-colors"
              >
                Logout Admin
              </button>
            </div>
          </div>
        ) : userProfile.isLoggedIn ? (
          <div className="bg-blue-600/10 border-b border-blue-500/20 px-4 py-2 flex items-center justify-between text-xs text-blue-300 font-medium">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Campus Buyer Account: <strong>{userProfile.name}</strong> ({userProfile.collegeName}) — <strong>10% Student Discount Active</strong>
              </span>
            </div>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="text-blue-400 hover:underline text-[11px] font-bold flex items-center gap-1"
            >
              <span>View Buyer Profile & Orders</span>
              <span>→</span>
            </button>
          </div>
        ) : null}

        {/* Main Workspace Render */}
        <main className="pb-16">
          {selectedProduct ? (
            <SingleProductDetailView
              product={selectedProduct}
              allProducts={products}
              allProjects={projects}
              onBack={() => setSelectedProduct(null)}
              onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
              onBuyNow={(prod, qty) => {
                if (!userProfile.isLoggedIn) {
                  setPendingAuthAction({ type: 'buyNow', product: prod, quantity: qty });
                  setBuyerLoginMessage('Please verify your email OTP and enter your delivery details to proceed to express checkout.');
                  setIsBuyerLoginOpen(true);
                  return;
                }
                handleAddToCart(prod, qty);
                setIsCartOpen(true);
              }}
              onSelectProject={(proj) => {
                setSelectedProduct(null);
                setSelectedProject(proj);
              }}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              isWatched={watchlistProductIds.has(selectedProduct.id)}
              onToggleWatchlist={handleToggleWatchlistProduct}
              userRole={userRole}
              onUpdateProduct={handleUpdateProduct}
            />
          ) : selectedProject ? (
            <ProjectDetailView
              project={selectedProject}
              productsMap={productsMap}
              onBack={() => setSelectedProject(null)}
              ownedProductIds={ownedProductIds}
              onToggleOwnedProduct={handleToggleOwnedProduct}
              onAddBomToCart={handleAddBomToCart}
              isWatched={watchlistProjectIds.has(selectedProject.id)}
              onToggleWatchlist={handleToggleWatchlistProject}
              onChangePhoto={isAdminAuthenticated ? (projId, newPhotoUrl) => handleChangeProjectPhoto(projId, newPhotoUrl) : undefined}
              userRole={userRole}
              isAdminAuthenticated={isAdminAuthenticated}
              onUpdateProject={handleUpdateProject}
              allProducts={products}
            />
          ) : activeTab === 'projects' ? (
            /* Projects Directory View */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              
              {/* Hero AI Callout Banner */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-sm text-white">
                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                    <span>AI-Powered Engineering Education Platform</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Turn Electronics Shopping into Real Learning
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    Recommend projects by budget, deduct components you already own, customize BOMs with AI, and test live circuit simulations before ordering.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 pt-2">
                    <button
                      onClick={() => setIsFinderOpen(true)}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all transform active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-blue-200 fill-blue-200" />
                      <span>"I Don't Know What to Build" AI Flow</span>
                    </button>

                    <button
                      onClick={() => setIsSubOpen(true)}
                      className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all"
                    >
                      Verify College ID (.edu) for 10% Off
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm text-slate-800 dark:text-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search projects (e.g. Smoke, Radar, Plant)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                    />
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                    >
                      <option value="All">All Difficulty Levels</option>
                      <option value="Beginner">Beginner (1-2 hrs)</option>
                      <option value="Intermediate">Intermediate (2-4 hrs)</option>
                      <option value="Advanced">Advanced (4+ hrs)</option>
                    </select>
                  </div>

                  {/* Domain Filter */}
                  <div>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                    >
                      <option value="All">All Domains</option>
                      <option value="Sensors">Sensors & Safety</option>
                      <option value="IoT & Cloud">IoT & Cloud</option>
                      <option value="Robotics">Robotics</option>
                      <option value="Automation">Automation</option>
                    </select>
                  </div>

                  {/* Max Budget Filter Slider & Input */}
                  <div className="flex flex-col justify-center px-2">
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Max Budget:</span>
                      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 focus-within:ring-1 focus-within:ring-blue-500">
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">₹</span>
                        <input
                          type="number"
                          min="0"
                          max="10000"
                          step="50"
                          value={maxBudgetFilter}
                          onChange={(e) => setMaxBudgetFilter(Math.max(0, Number(e.target.value)))}
                          className="w-16 bg-transparent font-bold text-blue-600 dark:text-blue-400 font-mono text-xs focus:outline-none text-right"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="3000"
                      step="50"
                      value={maxBudgetFilter}
                      onChange={(e) => setMaxBudgetFilter(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((proj) => {
                  const ownedCount = proj.bom.filter((b) => ownedProductIds.has(b.productId)).length;

                  return (
                    <ProjectCard
                      key={proj.id}
                      project={proj}
                      onSelectProject={(p) => setSelectedProject(p)}
                      ownedProductsCount={ownedCount}
                      isWatched={watchlistProjectIds.has(proj.id)}
                      onToggleWatchlist={handleToggleWatchlistProject}
                      onChangePhoto={isAdminAuthenticated ? (projId, newPhotoUrl) => handleChangeProjectPhoto(projId, newPhotoUrl) : undefined}
                    />
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'learn' ? (
            <LearningHubMain onBackToDashboard={() => setActiveTab('projects')} />
          ) : (
            <MarketplaceView
              products={products}
              onAddToCart={(prod) => handleAddToCart(prod, 1)}
              userRole={userRole}
              onOpenAdminModal={() => setIsAdminInventoryOpen(true)}
              onUpdateProductPrice={handleUpdateProductPrice}
              onUpdateProduct={handleUpdateProduct}
              watchlistProductIds={watchlistProductIds}
              onToggleWatchlistProduct={handleToggleWatchlistProduct}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
            />
          )}
        </main>
      </div>

      {/* Professional Footer */}
      <Footer
        onOpenLegalTerms={handleOpenLegalTerms}
        onOpenLegalPrivacy={handleOpenLegalPrivacy}
        onOpenCookieSettings={() => setIsCookieSettingsOpen(true)}
        onOpenCacheSettings={() => setIsCacheSettingsOpen(true)}
        onOpenSitemap={() => setIsSitemapOpen(true)}
        onOpenErrorLogs={() => setIsErrorLogOpen(true)}
        onOpenAdminInventory={() => setIsAdminInventoryOpen(true)}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner
        preferences={cookiePreferences}
        onSavePreferences={handleSaveCookiePreferences}
        onOpenPreferencesModal={() => setIsCookieSettingsOpen(true)}
      />

      {/* Cookie & Privacy Settings Modal */}
      <CookieSettingsModal
        isOpen={isCookieSettingsOpen}
        onClose={() => setIsCookieSettingsOpen(false)}
        preferences={cookiePreferences}
        onSavePreferences={handleSaveCookiePreferences}
      />

      {/* Terms & Conditions / Privacy Policy Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

      {/* Local Caching & Performance Settings Modal */}
      <CacheSettingsModal
        isOpen={isCacheSettingsOpen}
        onClose={() => setIsCacheSettingsOpen(false)}
        productsCount={products.length}
        projectsCount={MOCK_PROJECTS.length}
        ordersCount={orders.length}
        onClearAllCache={handleClearAllCache}
        onForceRefreshCatalog={handleForceRefreshCatalog}
      />

      {/* Sitemap & SEO Index Modal */}
      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
        products={products}
        projects={MOCK_PROJECTS}
      />

      {/* System Diagnostics & Error Logs Modal */}
      <ErrorLogModal
        isOpen={isErrorLogOpen}
        onClose={() => setIsErrorLogOpen(false)}
      />

      {/* Supabase Connection & Setup Guide Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        products={products}
        projects={projects}
      />

      {/* AI Project Finder Modal */}
      <ProjectFinderModal
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        onSelectRecommendedProject={handleSelectRecommendedProject}
      />

      {/* Shopping Cart & Razorpay Modal */}
      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={(prodId) => setCartItems(cartItems.filter((i) => i.product.id !== prodId))}
        onClearCart={() => setCartItems([])}
        isStudentVerified={isStudentVerified}
        userProfile={userProfile}
        onPlaceOrder={handlePlaceOrder}
        onUpdateQuantity={handleUpdateCartQuantity}
        onOpenSupport={handleOpenSupport}
        onCancelOrder={handleCancelOrder}
        onOpenBuyerLogin={handleOpenBuyerLogin}
      />

      {/* Dedicated Buyer Login & Registration Modal */}
      <BuyerLoginModal
        isOpen={isBuyerLoginOpen}
        onClose={() => {
          setIsBuyerLoginOpen(false);
          setPendingAuthAction(null);
        }}
        userProfile={userProfile}
        onLoginSuccess={(updatedProfile) => {
          handleUpdateProfile(updatedProfile);
          setIsBuyerLoginOpen(false);
          if (pendingAuthAction) {
            if (pendingAuthAction.type === 'addToCart' && pendingAuthAction.product) {
              const prod = pendingAuthAction.product;
              const qty = pendingAuthAction.quantity || 1;
              setCartItems((prev) => {
                const existing = prev.find((i) => i.product.id === prod.id);
                if (existing) {
                  return prev.map((i) => (i.product.id === prod.id ? { ...i, quantity: i.quantity + qty } : i));
                }
                return [...prev, { product: prod, quantity: qty }];
              });
            } else if (pendingAuthAction.type === 'buyNow' && pendingAuthAction.product) {
              const prod = pendingAuthAction.product;
              const qty = pendingAuthAction.quantity || 1;
              setCartItems((prev) => {
                const existing = prev.find((i) => i.product.id === prod.id);
                if (existing) {
                  return prev.map((i) => (i.product.id === prod.id ? { ...i, quantity: i.quantity + qty } : i));
                }
                return [...prev, { product: prod, quantity: qty }];
              });
              setIsCartOpen(true);
            } else if (pendingAuthAction.type === 'addBom' && pendingAuthAction.items) {
              pendingAuthAction.items.forEach((item) => {
                setCartItems((prev) => {
                  const existing = prev.find((i) => i.product.id === item.product.id);
                  if (existing) {
                    return prev.map((i) => (i.product.id === item.product.id ? { ...i, quantity: i.quantity + item.quantity } : i));
                  }
                  return [...prev, { product: item.product, quantity: item.quantity }];
                });
              });
              setIsCartOpen(true);
            }
            setPendingAuthAction(null);
          } else if (cartItems.length > 0) {
            setIsCartOpen(true);
          }
        }}
        contextualMessage={buyerLoginMessage}
        onContinueAsGuest={() => {
          setIsBuyerLoginOpen(false);
          setPendingAuthAction(null);
          if (cartItems.length > 0) {
            setIsCartOpen(true);
          }
        }}
      />

      {/* Dedicated Store Owner & Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onAdminLoginSuccess={() => {
          handleAdminLoginSuccess();
          setIsAdminLoginOpen(false);
        }}
        contextualMessage={adminLoginMessage}
      />

      {/* Subscription & College ID Verification Modal */}
      <SubscriptionModal
        isOpen={isSubOpen}
        onClose={() => setIsSubOpen(false)}
        isStudentVerified={isStudentVerified}
        onVerifyStudent={() => {
          setIsStudentVerified(true);
          setIsSubOpen(false);
        }}
      />

      {/* College Store Owner & Admin Price / Inventory Modal */}
      <AdminInventoryModal
        isOpen={isAdminInventoryOpen}
        onClose={() => setIsAdminInventoryOpen(false)}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onAdminLogout={handleAdminLogout}
        projects={projects}
        onUpdateProject={handleUpdateProject}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Buyer Account & College Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        studentOrders={orders.filter((o) => o.buyer.email === userProfile.email || o.buyer.phone === userProfile.phone)}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenAdminInventory={() => {
          setIsProfileOpen(false);
          setIsAdminInventoryOpen(true);
        }}
        onCancelOrder={handleCancelOrder}
        onOpenSupport={handleOpenSupport}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
      />

      {/* Contact Support & Ticket Modal */}
      <ContactSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        orders={orders}
        initialOrderId={supportTargetOrderId}
        userProfile={userProfile}
      />

      {/* Saved Watchlist Modal */}
      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistProjectIds={watchlistProjectIds}
        watchlistProductIds={watchlistProductIds}
        projects={MOCK_PROJECTS}
        products={products}
        onToggleWatchlistProject={handleToggleWatchlistProject}
        onToggleWatchlistProduct={handleToggleWatchlistProduct}
        onSelectProject={(p) => setSelectedProject(p)}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
        onAddProjectKitToCart={handleAddProjectKitToCart}
        onClearWatchlist={handleClearWatchlist}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setSelectedProject(null);
        }}
      />

      {/* Bottom Right Floating AI Finder Button & Speech Bubble */}
      <div
        id="floating-ai-finder-container"
        className={`fixed right-3 sm:right-5 z-40 flex flex-col items-end group max-w-[calc(100vw-1.5rem)] transition-all duration-300 ${
          !cookiePreferences.hasConsented
            ? 'bottom-28 sm:bottom-32 md:bottom-24'
            : 'bottom-3 sm:bottom-5'
        }`}
      >
        {/* Message Speech Bubble Popup */}
        <div
          id="floating-ai-finder-bubble"
          onClick={() => setIsFinderOpen(true)}
          className="mb-1.5 max-w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow-lg border border-cyan-300/60 cursor-pointer animate-bounce hover:scale-105 transition-all flex items-center space-x-1.5 relative z-40"
          title="Got ideas? Explore them here!"
        >
          <Sparkles className="w-3 h-3 text-cyan-200 fill-cyan-200 animate-pulse shrink-0" />
          <span className="truncate">Got ideas? Explore them here!</span>
          {/* Speech Bubble Arrow Tail */}
          <div className="absolute -bottom-1 right-5 w-2 h-2 bg-indigo-600 rotate-45 border-r border-b border-cyan-300/60"></div>
        </div>

        {/* Floating AI Finder Trigger Button (Compact Small Size) */}
        <button
          id="floating-ai-finder-btn"
          onClick={() => setIsFinderOpen(true)}
          className="flex items-center space-x-1.5 h-8 px-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg hover:shadow-cyan-500/30 border border-cyan-300/50 transition-all transform hover:scale-105 active:scale-95 group/btn cursor-pointer"
          title="Open AI Project Finder Assistant"
          aria-label="Open AI Finder"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200 fill-cyan-200 animate-pulse transition-transform group-hover/btn:rotate-12" />
          <span className="font-bold tracking-wide">AI Finder</span>
          <span className="px-1 py-0.2 text-[8px] font-black bg-cyan-400 text-slate-950 rounded-full uppercase">
            Smart
          </span>
        </button>
      </div>
    </div>
  );
}
