import { Business, Category, Product, Order, MultiLinkItem } from '@/types';

// In-memory global store with pre-seeded sample businesses
interface StoreData {
  businesses: Record<string, Business>;
  categories: Record<string, Category[]>;
  products: Record<string, Product[]>;
  orders: Record<string, Order[]>;
}

// Global persistence for serverless dev/prod
const globalForData = global as unknown as { taplyStore?: StoreData };

const initialBusinesses: Record<string, Business> = {
  'panaderia-la-estrella': {
    id: 'biz_estrella_1',
    slug: 'panaderia-la-estrella',
    name: 'Panadería La Estrella',
    category: 'PANADERÍA ARTESANAL',
    city: 'Maracaibo, Zulia',
    desc: 'Pan recién horneado cada día en el corazón de Maracaibo. Tradición, masa madre y el auténtico sabor que acompaña tus mañanas.',
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
    themeColor: '#00594C',
    phone: '584146001234',
    currency: 'USD',
    currencySymbol: '$',
    paymentNotes: 'Datos de pago:\n• Pago Móvil: Banesco (0134) | V-19.823.111 | 0414-6001234\n• Zelle: pagos@laestrella.com\n• Efectivo en divisas al retirar',
    links: [
      { id: 'l1', type: 'instagram', label: 'Instagram @laestrellamcb', url: 'https://instagram.com', active: true },
      { id: 'l2', type: 'maps', label: 'Ver en Google Maps', url: 'https://maps.google.com', active: true },
      { id: 'l3', type: 'phone', label: 'Llamar al local', url: 'tel:+584146001234', active: true },
    ],
    pageViews: 1420,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  'burger-station': {
    id: 'biz_burger_2',
    slug: 'burger-station',
    name: 'Burger Station 🍔',
    category: 'SMASH BURGERS',
    city: 'Caracas, Las Mercedes',
    desc: 'Smash burgers crujientes con queso cheddar fundido y papas sazonadas. Sabor callejero en su máxima expresión.',
    bannerImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    themeColor: '#DC2626',
    phone: '584121234567',
    currency: 'USD',
    currencySymbol: '$',
    paymentNotes: '• Pago Móvil: Mercantil (0105) | J-40891234 | 0412-1234567\n• Zelle: info@burgerstation.com\n• Binance USDT: Pay ID 89231823',
    links: [
      { id: 'l1', type: 'instagram', label: '@burgerstation.ccs', url: 'https://instagram.com', active: true },
      { id: 'l2', type: 'tiktok', label: 'TikTok @burgerstation', url: 'https://tiktok.com', active: true },
      { id: 'l3', type: 'maps', label: 'Local Las Mercedes', url: 'https://maps.google.com', active: true },
    ],
    pageViews: 2850,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  }
};

const initialCategories: Record<string, Category[]> = {
  biz_estrella_1: [
    { id: 'cat_1', businessId: 'biz_estrella_1', name: 'Especiales', order: 1 },
    { id: 'cat_2', businessId: 'biz_estrella_1', name: 'Panes', order: 2 },
    { id: 'cat_3', businessId: 'biz_estrella_1', name: 'Dulces', order: 3 },
    { id: 'cat_4', businessId: 'biz_estrella_1', name: 'Salados', order: 4 },
  ],
  biz_burger_2: [
    { id: 'cat_b1', businessId: 'biz_burger_2', name: 'Smash Burgers', order: 1 },
    { id: 'cat_b2', businessId: 'biz_burger_2', name: 'Acompañantes', order: 2 },
    { id: 'cat_b3', businessId: 'biz_burger_2', name: 'Bebidas', order: 3 },
  ]
};

const initialProducts: Record<string, Product[]> = {
  biz_estrella_1: [
    {
      id: 'p1',
      businessId: 'biz_estrella_1',
      name: 'Pan de Jamón Tradicional',
      category: 'Especiales',
      price: 30.00,
      compareAtPrice: 35.00,
      available: true,
      featured: true,
      description: 'Elaborado con masa dulce fermentada, jamón ahumado premium, tocineta, pasas maceradas y aceitunas rellenas.',
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p2',
      businessId: 'biz_estrella_1',
      name: 'Acema Andina',
      category: 'Panes',
      price: 2.50,
      available: true,
      description: 'Pan dulce aromatizado con canela, anís chiquito y papelón rallado. Ideal con café con leche.',
      image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p3',
      businessId: 'biz_estrella_1',
      name: 'Pan Francés Crocante',
      category: 'Panes',
      price: 1.00,
      available: true,
      description: 'Corteza dorada y crujiente con miga aireada y suave. Horneado cada 2 horas.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p4',
      businessId: 'biz_estrella_1',
      name: 'Golfeado Meloso con Queso de Mano',
      category: 'Dulces',
      price: 3.50,
      available: true,
      featured: true,
      description: 'Espiral de masa dulce bañado en melao de papelón caliente con generoso queso blanco rallado.',
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p5',
      businessId: 'biz_estrella_1',
      name: 'Cachito de Jamón y Queso Crema',
      category: 'Salados',
      price: 4.00,
      available: false, // Agotado para demostrar el efecto de notificación
      description: 'Clásico desayuno venezolano con masa tierna de mantequilla y abundante jamón picado.',
      image: 'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=600&q=80',
    },
  ],
  biz_burger_2: [
    {
      id: 'pb1',
      businessId: 'biz_burger_2',
      name: 'Double Bacon Smash',
      category: 'Smash Burgers',
      price: 8.50,
      available: true,
      featured: true,
      description: 'Dos carnes de 90g con costra caramelizada, doble queso cheddar, tocineta crujiente y salsa secreta.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'pb2',
      businessId: 'biz_burger_2',
      name: 'Truffle Mushroom Burger',
      category: 'Smash Burgers',
      price: 9.50,
      available: true,
      description: 'Carne smashed, champiñones salteados en mantequilla de hierbas, queso suizo y mayonesa trufada.',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'pb3',
      businessId: 'biz_burger_2',
      name: 'Papas Rústicas con Cheddar y Tocineta',
      category: 'Acompañantes',
      price: 4.00,
      available: true,
      description: 'Corte natural sazonadas con paprika ahumada y salsa de queso cheddar casera.',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    }
  ]
};

const initialOrders: Record<string, Order[]> = {
  biz_estrella_1: [
    {
      id: 'ord_101',
      businessId: 'biz_estrella_1',
      items: [
        { productId: 'p1', name: 'Pan de Jamón Tradicional', price: 30.00, quantity: 1 },
        { productId: 'p4', name: 'Golfeado Meloso con Queso de Mano', price: 3.50, quantity: 2 },
      ],
      total: 37.00,
      status: 'completado',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      customerNote: 'Entregar en el lobby del edificio',
    },
    {
      id: 'ord_102',
      businessId: 'biz_estrella_1',
      items: [
        { productId: 'p2', name: 'Acema Andina', price: 2.50, quantity: 4 },
        { productId: 'p3', name: 'Pan Francés Crocante', price: 1.00, quantity: 5 },
      ],
      total: 15.00,
      status: 'en_proceso',
      createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    }
  ]
};

function getStore(): StoreData {
  if (!globalForData.taplyStore) {
    globalForData.taplyStore = {
      businesses: { ...initialBusinesses },
      categories: { ...initialCategories },
      products: { ...initialProducts },
      orders: { ...initialOrders },
    };
  }
  return globalForData.taplyStore;
}

// ── Businesses Queries ──
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const store = getStore();
  const biz = Object.values(store.businesses).find(b => b.slug.toLowerCase() === slug.toLowerCase());
  return biz ? { ...biz } : null;
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const store = getStore();
  return store.businesses[id] ? { ...store.businesses[id] } : null;
}

export async function getAllBusinesses(): Promise<Business[]> {
  const store = getStore();
  return Object.values(store.businesses);
}

export async function updateBusiness(id: string, updates: Partial<Business>): Promise<Business | null> {
  const store = getStore();
  if (!store.businesses[id]) {
    // If id not found, look up by slug or first business
    const foundId = Object.keys(store.businesses)[0];
    if (!foundId) return null;
    id = foundId;
  }
  store.businesses[id] = { ...store.businesses[id], ...updates };
  return { ...store.businesses[id] };
}

export async function createBusiness(data: Omit<Business, 'id' | 'pageViews' | 'createdAt'>): Promise<Business> {
  const store = getStore();
  const id = 'biz_' + Math.random().toString(36).substring(2, 9);
  const newBiz: Business = {
    ...data,
    id,
    pageViews: 1,
    createdAt: new Date().toISOString(),
  };
  store.businesses[data.slug] = newBiz;
  store.categories[id] = [
    { id: 'cat_' + Math.random().toString(36).substring(2, 6), businessId: id, name: 'General', order: 1 }
  ];
  store.products[id] = [];
  store.orders[id] = [];
  return newBiz;
}

export async function recordPageView(businessId: string): Promise<void> {
  const store = getStore();
  if (store.businesses[businessId]) {
    store.businesses[businessId].pageViews = (store.businesses[businessId].pageViews || 0) + 1;
  }
}

// ── Products Queries ──
export async function getProductsByBusinessId(businessId: string): Promise<Product[]> {
  const store = getStore();
  return store.products[businessId] ? [...store.products[businessId]] : [];
}

export async function saveProduct(businessId: string, productData: Partial<Product> & { name: string; price: number }): Promise<Product> {
  const store = getStore();
  if (!store.products[businessId]) {
    store.products[businessId] = [];
  }

  if (productData.id) {
    const index = store.products[businessId].findIndex(p => p.id === productData.id);
    if (index !== -1) {
      const updated = {
        ...store.products[businessId][index],
        ...productData,
      } as Product;
      store.products[businessId][index] = updated;
      return updated;
    }
  }

  const newProduct: Product = {
    id: 'prod_' + Math.random().toString(36).substring(2, 9),
    businessId,
    name: productData.name,
    category: productData.category || 'General',
    price: Number(productData.price) || 0,
    compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : undefined,
    available: productData.available !== false,
    image: productData.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    description: productData.description || '',
    featured: Boolean(productData.featured),
  };

  store.products[businessId].unshift(newProduct);
  return newProduct;
}

export async function deleteProduct(businessId: string, productId: string): Promise<boolean> {
  const store = getStore();
  if (!store.products[businessId]) return false;
  store.products[businessId] = store.products[businessId].filter(p => p.id !== productId);
  return true;
}

// ── Categories Queries ──
export async function getCategoriesByBusinessId(businessId: string): Promise<Category[]> {
  const store = getStore();
  return store.categories[businessId] ? [...store.categories[businessId]] : [];
}

export async function addCategory(businessId: string, name: string): Promise<Category> {
  const store = getStore();
  if (!store.categories[businessId]) {
    store.categories[businessId] = [];
  }
  const existing = store.categories[businessId].find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;

  const newCat: Category = {
    id: 'cat_' + Math.random().toString(36).substring(2, 7),
    businessId,
    name,
    order: store.categories[businessId].length + 1,
  };
  store.categories[businessId].push(newCat);
  return newCat;
}

export async function deleteCategory(businessId: string, categoryId: string): Promise<boolean> {
  const store = getStore();
  if (!store.categories[businessId]) return false;
  store.categories[businessId] = store.categories[businessId].filter(c => c.id !== categoryId);
  return true;
}

// ── Orders Queries ──
export async function createOrder(data: {
  businessId: string;
  items: Array<{ productId: string; name: string; price: number; quantity: number }>;
  total: number;
  customerNote?: string;
  whatsappMessage?: string;
}): Promise<Order> {
  const store = getStore();
  if (!store.orders[data.businessId]) {
    store.orders[data.businessId] = [];
  }
  const newOrder: Order = {
    id: 'ord_' + Math.floor(1000 + Math.random() * 9000),
    businessId: data.businessId,
    items: data.items,
    total: data.total,
    customerNote: data.customerNote,
    whatsappMessage: data.whatsappMessage,
    status: 'nuevo',
    createdAt: new Date().toISOString(),
  };
  store.orders[data.businessId].unshift(newOrder);
  return newOrder;
}

export async function getOrdersByBusinessId(businessId: string): Promise<Order[]> {
  const store = getStore();
  return store.orders[businessId] ? [...store.orders[businessId]] : [];
}

export async function updateOrderStatus(businessId: string, orderId: string, status: Order['status']): Promise<Order | null> {
  const store = getStore();
  const orders = store.orders[businessId];
  if (!orders) return null;
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;
  order.status = status;
  return { ...order };
}
