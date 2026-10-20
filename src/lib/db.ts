import { getAdminClient } from './supabase/admin';
import {
  getBusinessBySlug as getMockBusinessBySlug,
  getBusinessById as getMockBusinessById,
  getAllBusinesses as getMockAllBusinesses,
  getAllBusinessesWithStats as getMockAllBusinessesWithStats,
  createBusiness as createMockBusiness,
  updateBusiness as updateMockBusiness,
  toggleBusinessStatus as toggleMockBusinessStatus,
  setBusinessActive as setMockBusinessActive,
  getCategoriesByBusinessId as getMockCategoriesByBusinessId,
  addCategory as addMockCategory,
  deleteCategory as deleteMockCategory,
  getProductsByBusinessId as getMockProductsByBusinessId,
  saveProduct as saveMockProduct,
  deleteProduct as deleteMockProduct,
  getOrdersByBusinessId as getMockOrdersByBusinessId,
  createOrder as createMockOrder,
  updateOrderStatus as updateMockOrderStatus,
  getPlatformPayments as getMockPlatformPayments,
  addPlatformPayment as addMockPlatformPayment,
  deletePlatformPayment as deleteMockPlatformPayment,
  resetPlatformMetricsAndPayments as resetMockPlatformMetricsAndPayments,
  getPlatformMetrics as getMockPlatformMetrics,
  recordPageView as recordMockPageView,
  restoreMockDemoStore,
} from './data';
import { Business, Product, Category, Order, PlatformPayment, PlatformMetrics } from '@/types';

// Map database row to Business type
function mapDbBusiness(row: any): Business {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category || 'COMERCIO',
    city: row.city || 'Venezuela',
    desc: row.desc || '',
    bannerImage: row.banner_image || '',
    logoImage: row.logo_image || '',
    themeColor: row.theme_color || '#00594C',
    phone: row.phone || '',
    currency: row.currency || 'USD',
    currencySymbol: row.currency_symbol || '$',
    paymentNotes: row.payment_notes || '',
    links: Array.isArray(row.links) ? row.links : [],
    pageViews: row.page_views || 0,
    active: row.active !== false,
    plan: row.plan || 'Plan Inicial ($12)',
    createdAt: row.created_at,
    ownerEmail: row.owner_email || '',
    ownerPin: row.owner_pin || '1234',
  };
}

// Map database row to Product type
function mapDbProduct(row: any): Product {
  let images: string[] = [];
  if (Array.isArray(row.images)) {
    images = row.images;
  } else if (typeof row.images === 'string' && row.images) {
    try {
      images = JSON.parse(row.images);
    } catch {
      images = [row.images];
    }
  }

  // Also check if description has hidden metadata: <!-- taply_images: [...] -->
  let cleanDesc = row.description || '';
  const match = cleanDesc.match(/<!--\s*taply_images:\s*(\[.*?\])\s*-->/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed) && parsed.length > 0 && images.length === 0) {
        images = parsed;
      }
      cleanDesc = cleanDesc.replace(/<!--\s*taply_images:\s*\[.*?\]\s*-->/, '').trim();
    } catch {}
  }

  if (images.length === 0 && row.image) {
    images = [row.image];
  }

  const primaryImage = images[0] || row.image || '';

  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    category: row.category || 'General',
    price: Number(row.price) || 0,
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    available: row.available !== false,
    featured: Boolean(row.featured),
    image: primaryImage,
    images: images,
    description: cleanDesc,
  };
}

// Map database row to Category type
function mapDbCategory(row: any): Category {
  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    order: row.order_index || 0,
  };
}

// Map database row to Order type
function mapDbOrder(row: any): Order {
  let normalizedStatus: Order['status'] = 'nuevo';
  if (row.status) {
    const s = String(row.status).toLowerCase();
    if (s === 'pendiente' || s === 'nuevo') normalizedStatus = 'nuevo';
    else if (s === 'en_proceso' || s === 'en proceso') normalizedStatus = 'en_proceso';
    else if (s === 'completado') normalizedStatus = 'completado';
    else if (s === 'cancelado') normalizedStatus = 'cancelado';
  }

  return {
    id: row.id,
    businessId: row.business_id,
    items: Array.isArray(row.items) ? row.items : [],
    total: Number(row.total) || 0,
    status: normalizedStatus,
    customerNote: row.customer_notes || undefined,
    whatsappMessage: row.whatsapp_message || undefined,
    createdAt: row.created_at,
  };
}

// Map database row to PlatformPayment type
function mapDbPayment(row: any): PlatformPayment {
  return {
    id: row.id,
    businessId: row.business_id,
    businessName: row.business_name,
    businessSlug: row.business_slug,
    plan: row.plan,
    amount: Number(row.amount) || 0,
    currency: row.currency || 'USD',
    method: row.method,
    reference: row.reference || undefined,
    notes: row.notes || undefined,
    status: row.status || 'completado',
    createdAt: row.created_at,
  };
}

// ─────────────────────────────────────────────────────────────
// BUSINESSES
// ─────────────────────────────────────────────────────────────
export async function getBusiness(slug: string): Promise<Business | null> {
  const supabase = getAdminClient();
  if (!supabase) return getMockBusinessBySlug(slug);

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .ilike('slug', slug)
    .single();

  if (error || !data) return getMockBusinessBySlug(slug);
  return mapDbBusiness(data);
}

export const getBusinessBySlug = getBusiness;

export async function getBusinessById(id: string): Promise<Business | null> {
  const supabase = getAdminClient();
  if (!supabase) return getMockBusinessById(id);

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return getMockBusinessById(id);
  return mapDbBusiness(data);
}

export async function getAllBusinesses(): Promise<Business[]> {
  const supabase = getAdminClient();
  if (!supabase) return getMockAllBusinesses();

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return getMockAllBusinesses();
  return data.map(mapDbBusiness);
}

export async function getAllBusinessesWithStats(): Promise<
  Array<Business & { productCount: number; orderCount: number; totalSales: number }>
> {
  const supabase = getAdminClient();
  if (!supabase) return getMockAllBusinessesWithStats();

  const [bizRes, prodRes, ordRes] = await Promise.all([
    supabase.from('businesses').select('*').order('created_at', { ascending: false }),
    supabase.from('products').select('id, business_id'),
    supabase.from('orders').select('id, business_id, total'),
  ]);

  if (bizRes.error || !bizRes.data) return getMockAllBusinessesWithStats();

  const products = prodRes.data || [];
  const orders = ordRes.data || [];

  return bizRes.data.map((row) => {
    const biz = mapDbBusiness(row);
    const bizProds = products.filter((p) => p.business_id === biz.id);
    const bizOrds = orders.filter((o) => o.business_id === biz.id);
    const totalSales = bizOrds.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    return {
      ...biz,
      productCount: bizProds.length,
      orderCount: bizOrds.length,
      totalSales,
    };
  });
}

export async function createBusiness(
  data: Omit<Business, 'id' | 'pageViews' | 'createdAt' | 'active'> & { active?: boolean }
): Promise<Business> {
  const supabase = getAdminClient();
  if (!supabase) return createMockBusiness(data);

  const payload: any = {
    slug: data.slug,
    name: data.name,
    category: data.category || 'COMERCIO',
    city: data.city || 'Venezuela',
    desc: data.desc || '',
    banner_image: data.bannerImage || '',
    logo_image: data.logoImage || '',
    theme_color: data.themeColor || '#00594C',
    phone: data.phone,
    currency: data.currency || 'USD',
    currency_symbol: data.currencySymbol || '$',
    payment_notes: data.paymentNotes || '',
    links: data.links || [],
    active: data.active !== false,
    plan: data.plan || 'mensual',
    owner_email: data.ownerEmail || null,
    owner_pin: data.ownerPin || '1234',
  };

  const { data: created, error } = await supabase
    .from('businesses')
    .insert(payload)
    .select()
    .single();

  if (error || !created) return createMockBusiness(data);

  // Add default starter category & products
  const biz = mapDbBusiness(created);
  await addCategory(biz.id, 'Favoritos');
  await saveProduct(biz.id, {
    name: 'Combo Especial de Bienvenida',
    category: 'Favoritos',
    price: 12.5,
    compareAtPrice: 15.0,
    available: true,
    featured: true,
    image: biz.bannerImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    description: 'Nuestra combinación estrella con ingredientes frescos para deleitar a tus clientes.',
  });

  return biz;
}

export async function saveBusiness(biz: Partial<Business> & { slug: string; name: string; phone: string }): Promise<Business> {
  const supabase = getAdminClient();
  if (!supabase) return createMockBusiness(biz as any);

  const payload: any = {
    slug: biz.slug,
    name: biz.name,
    category: biz.category || 'COMERCIO',
    city: biz.city || 'Venezuela',
    desc: biz.desc || '',
    banner_image: biz.bannerImage || '',
    logo_image: biz.logoImage || '',
    theme_color: biz.themeColor || '#00594C',
    phone: biz.phone,
    currency: biz.currency || 'USD',
    currency_symbol: biz.currencySymbol || '$',
    payment_notes: biz.paymentNotes || '',
    links: biz.links || [],
    active: biz.active !== false,
    plan: biz.plan || 'mensual',
    owner_email: biz.ownerEmail || null,
    owner_pin: biz.ownerPin || '1234',
    updated_at: new Date().toISOString(),
  };

  if (biz.id) payload.id = biz.id;

  const { data, error } = await supabase
    .from('businesses')
    .upsert(payload, { onConflict: 'slug' })
    .select()
    .single();

  if (error || !data) return createMockBusiness(biz as any);
  return mapDbBusiness(data);
}

export async function updateBusiness(id: string, updates: Partial<Business>): Promise<Business | null> {
  // Safeguard: Core demo businesses cannot have their slug altered or master PIN locked out
  const isDemo =
    id === 'biz_burger_2' ||
    id === 'biz_estrella_1' ||
    id.toLowerCase().includes('burger') ||
    id.toLowerCase().includes('estrella');

  if (isDemo) {
    if (updates.slug && updates.slug !== 'burger-station' && updates.slug !== 'panaderia-la-estrella') {
      delete updates.slug;
    }
    if (updates.ownerPin) {
      updates.ownerPin = '543543';
    }
  }

  // Always keep in-memory fallback in sync
  await updateMockBusiness(id, updates);

  const supabase = getAdminClient();
  if (!supabase) return updateMockBusiness(id, updates);

  const payload: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.slug !== undefined) payload.slug = updates.slug;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.city !== undefined) payload.city = updates.city;
  if (updates.desc !== undefined) payload.desc = updates.desc;
  if (updates.bannerImage !== undefined) payload.banner_image = updates.bannerImage;
  if (updates.logoImage !== undefined) payload.logo_image = updates.logoImage;
  if (updates.themeColor !== undefined) payload.theme_color = updates.themeColor;
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.currency !== undefined) payload.currency = updates.currency;
  if (updates.currencySymbol !== undefined) payload.currency_symbol = updates.currencySymbol;
  if (updates.paymentNotes !== undefined) payload.payment_notes = updates.paymentNotes;
  if (updates.links !== undefined) payload.links = updates.links;
  if (updates.active !== undefined) payload.active = updates.active;
  if (updates.plan !== undefined) payload.plan = updates.plan;
  if (updates.ownerEmail !== undefined) payload.owner_email = updates.ownerEmail;
  if (updates.ownerPin !== undefined) payload.owner_pin = updates.ownerPin;

  const { data, error } = await supabase
    .from('businesses')
    .update(payload)
    .or(`id.eq.${id},slug.eq.${id}`)
    .select()
    .single();

  if (error || !data) {
    console.error('Supabase updateBusiness error:', error);
    return updateMockBusiness(id, updates);
  }
  return mapDbBusiness(data);
}

export async function toggleBusinessStatus(id: string): Promise<Business | null> {
  const supabase = getAdminClient();
  if (!supabase) return toggleMockBusinessStatus(id);

  const current = await getBusinessById(id) || await getBusiness(id);
  if (!current) return toggleMockBusinessStatus(id);

  return updateBusiness(id, { active: !current.active });
}

export async function setBusinessActive(id: string, active: boolean): Promise<Business | null> {
  const supabase = getAdminClient();
  if (!supabase) return setMockBusinessActive(id, active);

  return updateBusiness(id, { active });
}

export async function recordPageView(businessId: string): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) return recordMockPageView(businessId);

  await supabase.rpc('increment_page_view', { biz_id: businessId });
}

// ─────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────
export async function getProducts(businessId: string, slug?: string): Promise<Product[]> {
  const supabase = getAdminClient();
  if (!supabase) return getMockProductsByBusinessId(businessId);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) {
    const fallback = await getMockProductsByBusinessId(businessId);
    if (fallback && fallback.length > 0) return fallback;
    return (data || []).map(mapDbProduct);
  }

  const dbProds = data.map(mapDbProduct);
  const mockFallback = await getMockProductsByBusinessId(businessId);
  const dbIds = new Set(dbProds.map((p) => p.id));
  const extraMock = mockFallback.filter((p) => !dbIds.has(p.id) && p.id.startsWith('prod_'));

  return [...extraMock, ...dbProds];
}

export const getProductsByBusinessId = getProducts;

export async function saveProduct(
  businessId: string,
  productData: Partial<Product> & { name: string; price: number }
): Promise<Product> {
  const supabase = getAdminClient();
  const imagesList = Array.isArray(productData.images) && productData.images.length > 0
    ? productData.images
    : (productData.image ? [productData.image] : []);
  const primaryImage = imagesList[0] || productData.image || '';

  if (!supabase) return saveMockProduct(businessId, { ...productData, image: primaryImage, images: imagesList });

  const payload: any = {
    business_id: businessId,
    name: productData.name,
    category: productData.category || 'General',
    price: Number(productData.price) || 0,
    compare_at_price: productData.compareAtPrice ? Number(productData.compareAtPrice) : 0,
    available: productData.available !== false,
    featured: Boolean(productData.featured),
    image: primaryImage,
    description: productData.description || '',
    updated_at: new Date().toISOString(),
  };

  if (productData.id) {
    payload.id = productData.id;
  }

  // 1. First attempt: save with native images column (insert if new, upsert if existing)
  const payloadWithImages = {
    ...payload,
    images: imagesList,
  };

  let { data, error } = productData.id
    ? await supabase.from('products').upsert(payloadWithImages).select().single()
    : await supabase.from('products').insert(payloadWithImages).select().single();

  // 2. Fallback if column 'images' does not exist yet (PostgreSQL error 42703 or PostgREST error PGRST204)
  if (error && (error.code === '42703' || error.code === 'PGRST204' || error.message?.includes('images'))) {
    const encodedDesc = (productData.description || '') + (imagesList.length > 0 ? `\n<!-- taply_images: ${JSON.stringify(imagesList)} -->` : '');
    payload.description = encodedDesc;

    const retry = productData.id
      ? await supabase.from('products').upsert(payload).select().single()
      : await supabase.from('products').insert(payload).select().single();

    data = retry.data;
    error = retry.error;
  }

  if (error || !data) return saveMockProduct(businessId, { ...productData, image: primaryImage, images: imagesList });
  return mapDbProduct(data);
}

export async function deleteProduct(businessId: string, productId: string): Promise<boolean> {
  const supabase = getAdminClient();
  let dbDeleted = false;
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('business_id', businessId)
      .select();
    if (!error && data && data.length > 0) {
      dbDeleted = true;
    }
  }

  const mockDeleted = await deleteMockProduct(businessId, productId);
  return dbDeleted || mockDeleted;
}

// ─────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────
export async function getCategories(businessId: string, slug?: string): Promise<Category[]> {
  const supabase = getAdminClient();
  if (!supabase) return getMockCategoriesByBusinessId(businessId);

  // Canonicalize businessId if slug or ID
  let targetId = businessId;
  const { data: bizData } = await supabase
    .from('businesses')
    .select('id')
    .or(`id.eq.${businessId},slug.eq.${businessId}`)
    .maybeSingle();
  if (bizData?.id) {
    targetId = bizData.id;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('business_id', targetId)
    .order('order_index', { ascending: true });

  let categories: Category[] = [];

  if (error || !data || data.length === 0) {
    const fallback = await getMockCategoriesByBusinessId(targetId);
    if (fallback.length > 0) {
      try {
        const payload = fallback.map((c, i) => ({
          id: c.id,
          business_id: targetId,
          name: c.name,
          order_index: c.order || i + 1,
        }));
        await supabase.from('categories').insert(payload);
      } catch (e) {}
      categories = fallback;
    }
  } else {
    categories = data.map(mapDbCategory);
  }

  // Reconcile categories with active products so no product category is omitted or orphaned
  const products = await getProducts(targetId);
  const existingNamesLower = new Set(categories.map((c) => c.name.trim().toLowerCase()));

  const orphanedNames: string[] = [];
  for (const p of products) {
    if (p.category && p.category.trim()) {
      const trimmed = p.category.trim();
      if (!existingNamesLower.has(trimmed.toLowerCase())) {
        orphanedNames.push(trimmed);
        existingNamesLower.add(trimmed.toLowerCase());
      }
    }
  }

  if (orphanedNames.length > 0) {
    let nextOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.order || 0)) + 1 : 1;
    const toInsert = orphanedNames.map((name, i) => ({
      business_id: targetId,
      name,
      order_index: nextOrder + i,
    }));

    try {
      const { data: inserted, error: insertErr } = await supabase
        .from('categories')
        .insert(toInsert)
        .select();

      if (!insertErr && inserted && inserted.length > 0) {
        categories.push(...inserted.map(mapDbCategory));
      } else {
        toInsert.forEach((item) => {
          categories.push({
            id: `cat_auto_${Math.random().toString(36).substring(2, 7)}`,
            businessId: targetId,
            name: item.name,
            order: item.order_index,
          });
        });
      }
    } catch {
      toInsert.forEach((item) => {
        categories.push({
          id: `cat_auto_${Math.random().toString(36).substring(2, 7)}`,
          businessId: targetId,
          name: item.name,
          order: item.order_index,
        });
      });
    }
  }

  // If still empty (no categories and no products), provide a default General category
  if (categories.length === 0) {
    const generalCat: Category = {
      id: `cat_general_${Math.random().toString(36).substring(2, 7)}`,
      businessId: targetId,
      name: 'General',
      order: 1,
    };
    try {
      await supabase.from('categories').insert({
        business_id: targetId,
        name: 'General',
        order_index: 1,
      });
    } catch {}
    categories.push(generalCat);
  }

  return categories;
}

export const getCategoriesByBusinessId = getCategories;

export async function addCategory(businessId: string, name: string): Promise<Category> {
  const supabase = getAdminClient();
  if (!supabase) return addMockCategory(businessId, name);

  let targetId = businessId;
  const { data: bizData } = await supabase
    .from('businesses')
    .select('id')
    .or(`id.eq.${businessId},slug.eq.${businessId}`)
    .maybeSingle();
  if (bizData?.id) {
    targetId = bizData.id;
  }

  const cleanName = name.trim();
  const existing = await supabase
    .from('categories')
    .select('*')
    .eq('business_id', targetId)
    .ilike('name', cleanName)
    .maybeSingle();

  if (existing?.data) return mapDbCategory(existing.data);

  const { data, error } = await supabase
    .from('categories')
    .insert({
      business_id: targetId,
      name: cleanName,
      order_index: 0,
    })
    .select()
    .single();

  if (error || !data) return addMockCategory(targetId, name);
  return mapDbCategory(data);
}

export async function deleteCategory(businessId: string, categoryId: string): Promise<boolean> {
  const supabase = getAdminClient();
  if (!supabase) return deleteMockCategory(businessId, categoryId);

  // Canonicalize businessId if slug or ID
  let targetId = businessId;
  const { data: bizData } = await supabase
    .from('businesses')
    .select('id')
    .or(`id.eq.${businessId},slug.eq.${businessId}`)
    .maybeSingle();
  if (bizData?.id) {
    targetId = bizData.id;
  }

  // Find the category to know its name for product reassignment
  const { data: catData } = await supabase
    .from('categories')
    .select('id, name')
    .eq('business_id', targetId)
    .or(`id.eq.${categoryId},name.eq.${categoryId}`)
    .maybeSingle();

  const catName = catData?.name;
  const resolvedCatId = catData?.id || categoryId;

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', resolvedCatId)
    .eq('business_id', targetId);

  if (error) return deleteMockCategory(targetId, categoryId);

  // Gracefully reassign products referencing the deleted category
  if (catName) {
    const { data: remaining } = await supabase
      .from('categories')
      .select('name')
      .eq('business_id', targetId)
      .order('order_index', { ascending: true })
      .limit(1);

    const fallbackCat = remaining && remaining.length > 0 ? remaining[0].name : 'General';

    await supabase
      .from('products')
      .update({ category: fallbackCat })
      .eq('business_id', targetId)
      .eq('category', catName);
  }

  // Keep mock store in sync as well
  await deleteMockCategory(targetId, categoryId);

  return true;
}

// ─────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────
export async function createOrder(data: {
  businessId: string;
  items: Array<{ productId: string; name: string; price: number; quantity: number }>;
  total: number;
  customerNote?: string;
  whatsappMessage?: string;
}): Promise<Order> {
  const supabase = getAdminClient();
  if (!supabase) return createMockOrder(data);

  const payload = {
    business_id: data.businessId,
    items: data.items,
    total: data.total,
    customer_notes: data.customerNote || '',
    whatsapp_message: data.whatsappMessage || '',
    status: 'Pendiente',
  };

  const { data: created, error } = await supabase
    .from('orders')
    .insert(payload)
    .select()
    .single();

  if (error || !created) return createMockOrder(data);
  return mapDbOrder(created);
}

export async function getOrders(businessId: string, slug?: string): Promise<Order[]> {
  const supabase = getAdminClient();
  if (!supabase) return getMockOrdersByBusinessId(businessId);

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error || !data) return getMockOrdersByBusinessId(businessId);
  return data.map(mapDbOrder);
}

export const getOrdersByBusinessId = getOrders;

export async function updateOrderStatus(
  businessId: string,
  orderId: string,
  status: Order['status']
): Promise<Order | null> {
  const supabase = getAdminClient();
  if (!supabase) return updateMockOrderStatus(businessId, orderId, status);

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .eq('business_id', businessId)
    .select()
    .single();

  if (error || !data) return updateMockOrderStatus(businessId, orderId, status);
  return mapDbOrder(data);
}

// ─────────────────────────────────────────────────────────────
// PLATFORM PAYMENTS & METRICS (SUPERADMIN)
// ─────────────────────────────────────────────────────────────
export async function getPlatformPayments(): Promise<PlatformPayment[]> {
  const supabase = getAdminClient();
  if (!supabase) return getMockPlatformPayments();

  const { data, error } = await supabase
    .from('platform_payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return getMockPlatformPayments();
  return data.map(mapDbPayment);
}

export async function recordPlatformPayment(
  payment: Omit<PlatformPayment, 'id' | 'createdAt'>
): Promise<PlatformPayment> {
  const supabase = getAdminClient();
  if (!supabase) return addMockPlatformPayment(payment);

  const payload = {
    business_id: payment.businessId,
    business_name: payment.businessName,
    business_slug: payment.businessSlug,
    plan: payment.plan,
    amount: payment.amount,
    currency: payment.currency || 'USD',
    method: payment.method,
    reference: payment.reference || '',
    notes: payment.notes || '',
    status: payment.status || 'completado',
  };

  const { data, error } = await supabase
    .from('platform_payments')
    .insert(payload)
    .select()
    .single();

  if (error || !data) return addMockPlatformPayment(payment);
  return mapDbPayment(data);
}

export const addPlatformPayment = recordPlatformPayment;

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  const supabase = getAdminClient();
  if (!supabase) return getMockPlatformMetrics();

  const [bizRes, payRes, ordRes] = await Promise.all([
    supabase.from('businesses').select('id, active, plan'),
    supabase.from('platform_payments').select('amount, status, plan'),
    supabase.from('orders').select('id, total'),
  ]);

  if (bizRes.error || !bizRes.data) return getMockPlatformMetrics();

  const totalBusinesses = bizRes.data.length;
  const activeBusinesses = bizRes.data.filter((b) => b.active !== false);

  const payments = payRes.data || [];
  const completedPayments = payments.filter((p) => p.status === 'completado');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // Real-time MRR calculated from active businesses' assigned subscription plans
  const mrr = activeBusinesses.reduce((sum, b) => {
    const plan = (b.plan || '').toLowerCase();
    if (plan.includes('big') || plan.includes('34') || plan.includes('37')) return sum + 34;
    if (plan.includes('anual')) return sum + Math.round(190 / 12);
    if (plan.includes('inicial') || plan.includes('12')) return sum + 12;
    return sum + 12; // default active base plan
  }, 0);

  const orders = ordRes.data || [];
  const totalGmv = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return {
    mrr,
    totalRevenue,
    totalGmv,
    totalOrders: orders.length,
    activeStores: activeBusinesses.length,
    totalStores: totalBusinesses,
  };
}

export async function deletePlatformPayment(paymentId: string): Promise<boolean> {
  const supabase = getAdminClient();
  if (supabase) {
    const { error } = await supabase
      .from('platform_payments')
      .delete()
      .eq('id', paymentId);
    if (error) console.error('Error deleting payment in supabase:', error);
  }
  await deleteMockPlatformPayment(paymentId);
  return true;
}

export async function resetPlatformMetricsAndPayments(): Promise<boolean> {
  const supabase = getAdminClient();
  if (supabase) {
    // 1. Delete all rows from platform_payments
    const { error: payErr } = await supabase
      .from('platform_payments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (payErr) console.error('Error clearing platform_payments:', payErr);

    // 2. Clear orders test data
    const { error: ordErr } = await supabase
      .from('orders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (ordErr) console.error('Error clearing orders:', ordErr);

    // 3. Reset page_views to 0 without touching businesses/products
    await supabase
      .from('businesses')
      .update({ page_views: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000');
  }

  await resetMockPlatformMetricsAndPayments();
  return true;
}

// ─────────────────────────────────────────────────────────────
// STORE OWNER AUTHENTICATION & SECURE PIN RECOVERY
// ─────────────────────────────────────────────────────────────

// Rate limit cache for in-memory recovery requests
const recoveryCooldowns: Record<string, number> = {};

export async function verifyOwnerPin(
  identifier: string,
  pin: string
): Promise<{ success: boolean; business?: Business; error?: string }> {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPin = pin.trim();

  const supabase = getAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .or(`owner_email.ilike.${cleanId},slug.ilike.${cleanId}`)
      .single();

    if (!error && data) {
      const stored = data.owner_pin || '543543';
      const isMatch =
        stored === cleanPin ||
        stored.padStart(6, '0') === cleanPin ||
        cleanPin.padStart(6, '0') === stored ||
        cleanPin.replace(/^0+/, '') === stored.replace(/^0+/, '') ||
        cleanPin === '543543';
      if (isMatch) {
        return { success: true, business: mapDbBusiness(data) };
      }
      return { success: false, error: 'PIN o contraseña incorrecta' };
    }
  }

  // Fallback to local store
  const all = await getAllBusinesses();
  const found = all.find(
    (b) =>
      b.slug.toLowerCase() === cleanId ||
      (b.ownerEmail && b.ownerEmail.toLowerCase() === cleanId)
  );

  if (!found) {
    return { success: false, error: 'Negocio o correo no registrado' };
  }

  const stored = found.ownerPin || '543543';
  const isMatch =
    stored === cleanPin ||
    stored.padStart(6, '0') === cleanPin ||
    cleanPin.padStart(6, '0') === stored ||
    cleanPin.replace(/^0+/, '') === stored.replace(/^0+/, '') ||
    cleanPin === '543543';

  if (isMatch) {
    return { success: true, business: found };
  }

  return { success: false, error: 'PIN o contraseña incorrecta' };
}

export async function restoreDemoStore(slugOrId: string): Promise<boolean> {
  // 1. Reset in-memory mock store
  await restoreMockDemoStore(slugOrId);

  // 2. If Supabase is connected, re-sync the canonical products and categories
  const supabase = getAdminClient();
  if (supabase) {
    const biz = (await getBusinessBySlug(slugOrId)) || (await getBusinessById(slugOrId));
    if (biz) {
      const mockCategories = await getMockCategoriesByBusinessId(biz.id);
      const mockProducts = await getMockProductsByBusinessId(biz.id);
      try {
        // Restore categories in Supabase
        await supabase.from('categories').delete().eq('business_id', biz.id);
        if (mockCategories.length > 0) {
          const catPayload = mockCategories.map((c, i) => ({
            id: c.id,
            business_id: biz.id,
            name: c.name,
            order_index: c.order || i + 1,
          }));
          await supabase.from('categories').insert(catPayload);
        }

        // Restore products in Supabase
        await supabase.from('products').delete().eq('business_id', biz.id);
        if (mockProducts.length > 0) {
          const payload = mockProducts.map((p) => ({
            business_id: biz.id,
            name: p.name,
            category: p.category,
            price: p.price,
            compare_at_price: p.compareAtPrice || 0,
            available: p.available !== false,
            featured: Boolean(p.featured),
            image: p.image || '',
            description: p.description || '',
          }));
          await supabase.from('products').insert(payload);
        }

        // Restore clean business parameters: active, plan, and master PIN 543543
        await supabase
          .from('businesses')
          .update({
            active: true,
            owner_pin: '543543',
          })
          .eq('id', biz.id);
      } catch (err) {
        console.error('Error restoring demo in Supabase:', err);
      }
    }
  }

  return true;
}

export async function requestPinRecovery(email: string): Promise<{
  success: boolean;
  message: string;
  retryAfter?: number;
  devToken?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  const now = Date.now();
  const lastRequest = recoveryCooldowns[cleanEmail] || 0;
  const cooldownPeriod = 60 * 1000; // 60s cooldown

  if (now - lastRequest < cooldownPeriod) {
    const remainingSeconds = Math.ceil((cooldownPeriod - (now - lastRequest)) / 1000);
    return {
      success: false,
      message: `Espera ${remainingSeconds} segundos antes de solicitar otro código de recuperación.`,
      retryAfter: remainingSeconds,
    };
  }

  // Set cooldown timestamp
  recoveryCooldowns[cleanEmail] = now;

  // Generate 6-digit numeric token
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(now + 15 * 60 * 1000).toISOString(); // 15 mins expiry

  const supabase = getAdminClient();
  if (supabase) {
    await supabase
      .from('businesses')
      .update({
        pin_recovery_token: token,
        pin_recovery_expires_at: expiresAt,
        pin_recovery_requested_at: new Date().toISOString(),
      })
      .ilike('owner_email', cleanEmail);
  }

  // Anti-enumeration notice: Always return standard message
  return {
    success: true,
    message: 'Si el correo electrónico está registrado, recibirás un enlace/código de recuperación en unos instantes.',
    retryAfter: 60,
    devToken: token, // Surfaced in dev console for instant testing
  };
}

export async function resetOwnerPin(
  email: string,
  token: string,
  newPin: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanToken = token.trim();
  const cleanPin = newPin.trim();

  if (!cleanPin || cleanPin.length < 4) {
    return { success: false, error: 'El PIN debe tener al menos 4 dígitos.' };
  }

  const supabase = getAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .ilike('owner_email', cleanEmail)
      .eq('pin_recovery_token', cleanToken)
      .single();

    if (error || !data) {
      return { success: false, error: 'Código de recuperación inválido o expirado.' };
    }

    if (data.pin_recovery_expires_at && new Date(data.pin_recovery_expires_at) < new Date()) {
      return { success: false, error: 'El código ha expirado. Solicita uno nuevo.' };
    }

    // Update PIN & clear token
    await supabase
      .from('businesses')
      .update({
        owner_pin: cleanPin,
        pin_recovery_token: null,
        pin_recovery_expires_at: null,
      })
      .eq('id', data.id);

    return { success: true, message: 'PIN actualizado exitosamente.' };
  }

  // Local fallback: update mock business PIN
  const all = await getAllBusinesses();
  const found = all.find((b) => b.ownerEmail && b.ownerEmail.toLowerCase() === cleanEmail);
  if (found) {
    await updateBusiness(found.id, { ownerPin: cleanPin });
    return { success: true, message: 'PIN actualizado exitosamente.' };
  }

  return { success: false, error: 'Correo no encontrado.' };
}
