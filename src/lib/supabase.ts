import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Project } from '../types';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return clientInstance;
};

// Default fallback detail guide if missing in DB
const DEFAULT_DETAIL_GUIDE = {
  whyDoINeedThis: 'Essential component for electronic circuits & microcontrollers.',
  howDoesItWork: 'Operates via signals and power input supplied by the main circuit.',
  whatIfIDontUseIt: 'The circuit will lack the necessary functionality.',
  realLifeApplications: ['Consumer Electronics', 'IoT Devices', 'Automation'],
  alternativeComponents: ['Generic Equivalent Module'],
};

// Fetch Products from Supabase
export async function fetchSupabaseProducts(): Promise<Product[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.warn('Supabase products fetch warning:', error.message);
      return null;
    }
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory || 'General',
        price: Number(item.price),
        image: item.image,
        description: item.description || '',
        inStock: Boolean(item.in_stock ?? item.inStock ?? true),
        stockQuantity: Number(item.stock_quantity ?? item.stockQuantity ?? 15),
        specs: item.specs || {},
        pinout: item.pinout || [],
        detailGuide: item.detail_guide || item.detailGuide || DEFAULT_DETAIL_GUIDE,
        isPopular: Boolean(item.is_popular ?? item.isPopular ?? false),
        rating: Number(item.rating || 4.5),
        reviewCount: Number(item.review_count ?? item.reviews_count ?? 10),
        reviews: item.reviews || [],
      }));
    }
  } catch (err) {
    console.error('Failed to fetch from Supabase products:', err);
  }
  return null;
}

// Upsert Product to Supabase
export async function saveSupabaseProduct(product: Product): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const dbPayload = {
      id: product.id,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      price: product.price,
      image: product.image,
      description: product.description,
      in_stock: product.inStock,
      stock_quantity: product.stockQuantity || 10,
      specs: product.specs,
      pinout: product.pinout || [],
      detail_guide: product.detailGuide,
      is_popular: product.isPopular || false,
      rating: product.rating || 4.5,
      review_count: product.reviewCount || 10,
      reviews: product.reviews || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('products').upsert(dbPayload, { onConflict: 'id' });
    if (error) {
      console.error('Error saving product to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase product save exception:', err);
    return false;
  }
}

// Fetch Projects from Supabase
export async function fetchSupabaseProjects(): Promise<Project[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) {
      console.warn('Supabase projects fetch warning:', error.message);
      return null;
    }
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        domain: item.domain,
        difficulty: item.difficulty,
        estimatedHours: Number(item.estimated_hours || item.estimatedHours || 3),
        estimatedBudget: Number(item.estimated_budget || item.estimatedBudget || 800),
        heroImage: item.hero_image || item.heroImage,
        description: item.description,
        learningObjectives: item.learning_objectives || item.learningObjectives || [],
        bom: item.bom || [],
        quiz: item.quiz || [],
        pinoutTable: item.pinout_table || item.pinoutTable || [],
        codeSnippet: item.code_snippet || item.codeSnippet,
        simulationConfig: item.simulation_config || item.simulationConfig,
        eWasteScore: item.e_waste_score || item.eWasteScore,
        facultyApproved: item.faculty_approved ?? item.facultyApproved ?? true,
        instructorName: item.instructor_name || item.instructorName,
      }));
    }
  } catch (err) {
    console.error('Failed to fetch projects from Supabase:', err);
  }
  return null;
}

// Upsert Project to Supabase
export async function saveSupabaseProject(project: Project): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const dbPayload = {
      id: project.id,
      title: project.title,
      subtitle: project.subtitle,
      domain: project.domain,
      difficulty: project.difficulty,
      estimated_hours: project.estimatedHours,
      estimated_budget: project.estimatedBudget,
      hero_image: project.heroImage,
      description: project.description,
      learning_objectives: project.learningObjectives,
      bom: project.bom,
      quiz: project.quiz,
      pinout_table: project.pinoutTable,
      code_snippet: project.codeSnippet,
      simulation_config: project.simulationConfig,
      e_waste_score: project.eWasteScore,
      faculty_approved: project.facultyApproved,
      instructor_name: project.instructorName,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('projects').upsert(dbPayload, { onConflict: 'id' });
    if (error) {
      console.error('Error saving project to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase project save exception:', err);
    return false;
  }
}

// Save New Order to Supabase
export async function createSupabaseOrder(orderData: Record<string, any>): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('orders').insert([
      {
        id: orderData.id || 'ord-' + Date.now(),
        user_email: orderData.userEmail || orderData.email || 'guest@student.edu',
        items: orderData.items || [],
        total_amount: orderData.totalAmount || orderData.total || 0,
        delivery_method: orderData.deliveryMethod || 'hostel',
        hostel_room: orderData.hostelRoom || '',
        status: 'placed',
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.error('Error inserting order to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase order creation exception:', err);
    return false;
  }
}
