import { Business, Category, Product, Order, MultiLinkItem, PlatformPayment, PlatformMetrics } from '@/types';

// In-memory global store with pre-seeded sample businesses
interface StoreData {
  businesses: Record<string, Business>;
  categories: Record<string, Category[]>;
  products: Record<string, Product[]>;
  orders: Record<string, Order[]>;
  payments: PlatformPayment[];
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
    active: true,
    plan: 'Plan Inicial ($12)',
    ownerEmail: 'dueno@laestrella.com',
    ownerPin: '543543',
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
    active: true,
    plan: 'Big Taply ($34)',
    ownerEmail: 'dueno@burgerstation.com',
    ownerPin: '543543',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  }
};

const initialPayments: PlatformPayment[] = [
  {
    id: 'pay_101',
    businessId: 'biz_burger_2',
    businessName: 'Burger Station 🍔',
    businessSlug: 'burger-station',
    plan: 'Anual ($190)',
    amount: 190,
    currency: 'USD',
    method: 'Zelle',
    reference: 'ZEL-894218',
    status: 'completado',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'pay_102',
    businessId: 'biz_estrella_1',
    businessName: 'Panadería La Estrella',
    businessSlug: 'panaderia-la-estrella',
    plan: 'Mensual ($19)',
    amount: 19,
    currency: 'USD',
    method: 'Pago Móvil',
    reference: 'PM-0134-9921',
    status: 'completado',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'pay_103',
    businessId: 'biz_estrella_1',
    businessName: 'Panadería La Estrella',
    businessSlug: 'panaderia-la-estrella',
    plan: 'Mensual ($19)',
    amount: 19,
    currency: 'USD',
    method: 'Pago Móvil',
    reference: 'PM-0134-5831',
    status: 'completado',
    createdAt: new Date(Date.now() - 32 * 86400000).toISOString(),
  }
];

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
      images: [
        'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=600&q=80',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=600&q=80',
      ],
    },
    {
      id: 'p6',
      businessId: 'biz_estrella_1',
      name: 'Queso de Mano Artesanal Extra Fresco',
      category: 'Salados',
      price: 5.50,
      available: true,
      featured: true,
      description: 'Rueda de queso de mano artesanal llanero, jugoso, suave y con la salinidad perfecta para acompañar cachapas, arepas y golfeados.',
      image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
      ],
    },
    {
      id: 'p7',
      businessId: 'biz_estrella_1',
      name: 'Hogaza Campesina de Masa Madre',
      category: 'Panes',
      price: 4.50,
      available: true,
      description: 'Fermentación lenta de 24 horas con masa madre viva. Corteza rústica caramelizada y miga alveolada con toque sutil de acidez natural.',
      image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80',
      ],
    },
    {
      id: 'p8',
      businessId: 'biz_estrella_1',
      name: 'Tarta Vasca Cremosa de Queso',
      category: 'Dulces',
      price: 6.00,
      available: true,
      description: 'Tarta de queso horneada a alta temperatura con superficie tostada y corazón ultra cremoso que se derrite al corte.',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80',
      ],
    },
    {
      id: 'p9',
      businessId: 'biz_estrella_1',
      name: 'Croissant Almendrado de Mantequilla',
      category: 'Dulces',
      price: 3.80,
      available: true,
      description: 'Hojaldre 100% mantequilla europea relleno de crema frangipane de almendras tostadas y cubierto de almendras laminadas y azúcar glas.',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80',
      ],
    },
    {
      id: 'p10',
      businessId: 'biz_estrella_1',
      name: 'Palmeritas Crujientes Caramelizadas',
      category: 'Dulces',
      price: 2.00,
      available: true,
      description: 'Clásicas palmeras de hojaldre crujiente con borde de azúcar morena caramelizada al horno. Paquete de 4 unidades.',
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      ],
    },
    {
      id: 'pb4',
      businessId: 'biz_burger_2',
      name: 'BBQ Crispy Chicken Burger',
      category: 'Smash Burgers',
      price: 8.00,
      available: true,
      featured: true,
      description: 'Pechuga de pollo crujiente empanizada al estilo Nashville, salsa barbacoa ahumada, pepinillos encurtidos y ensalada coleslaw fresca.',
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      ],
    },
    {
      id: 'pb5',
      businessId: 'biz_burger_2',
      name: 'Oklahoma Fried Onion Smash',
      category: 'Smash Burgers',
      price: 9.00,
      available: true,
      description: 'Doble smash prensado sobre fina cebolla dulce que se carameliza en la plancha caliente, queso americano derretido y salsa mostaza dulce.',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      ],
    },
    {
      id: 'pb6',
      businessId: 'biz_burger_2',
      name: 'Papas Trufadas al Parmesano',
      category: 'Acompañantes',
      price: 4.50,
      available: true,
      description: 'Papas fritas corte fino salteadas con aceite de trufa blanca, lluvia abundante de queso parmesano reggiano recién rallado y perejil fresco.',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
      ],
    },
    {
      id: 'pb7',
      businessId: 'biz_burger_2',
      name: 'Aros de Cebolla Crocantes con Dip Ranch',
      category: 'Acompañantes',
      price: 3.80,
      available: true,
      description: 'Aros de cebolla morada rebozados en panko crujiente de cerveza artesanal, acompañados de salsa ranch casera con hierbas.',
      image: 'https://images.unsplash.com/photo-1639024471287-035186f55280?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1639024471287-035186f55280?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
      ],
    },
    {
      id: 'pb8',
      businessId: 'biz_burger_2',
      name: 'Malteada Cremosa de Vainilla & Caramelo',
      category: 'Bebidas',
      price: 5.00,
      available: true,
      description: 'Helado artesanal batido con leche entera cremosa, remolino de caramelo salado, crema chantilly fresca y trozos de galleta.',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
      ],
    },
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
      payments: [...initialPayments],
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

export async function getAllBusinessesWithStats(): Promise<Array<Business & { productCount: number; orderCount: number; totalSales: number }>> {
  const store = getStore();
  const businesses = Object.values(store.businesses);
  return businesses.map(b => {
    const products = store.products[b.id] || [];
    const orders = store.orders[b.id] || [];
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      ...b,
      productCount: products.length,
      orderCount: orders.length,
      totalSales,
    };
  });
}

export async function updateBusiness(id: string, updates: Partial<Business>): Promise<Business | null> {
  const store = getStore();
  let key = id;
  if (!store.businesses[key]) {
    const foundEntry = Object.entries(store.businesses).find(([k, b]) => b.id === id || b.slug === id || k === id);
    if (foundEntry) {
      key = foundEntry[0];
    } else {
      return null;
    }
  }
  store.businesses[key] = { ...store.businesses[key], ...updates };
  return { ...store.businesses[key] };
}

export async function toggleBusinessStatus(id: string): Promise<Business | null> {
  const store = getStore();
  const biz = store.businesses[id] || Object.values(store.businesses).find(b => b.id === id || b.slug === id);
  if (!biz) return null;
  biz.active = biz.active === false ? true : false;
  return { ...biz };
}

export async function setBusinessActive(id: string, active: boolean): Promise<Business | null> {
  const store = getStore();
  const biz = store.businesses[id] || Object.values(store.businesses).find(b => b.id === id || b.slug === id);
  if (!biz) return null;
  biz.active = active;
  return { ...biz };
}

export async function createBusiness(data: Omit<Business, 'id' | 'pageViews' | 'createdAt' | 'active'> & { active?: boolean }): Promise<Business> {
  const store = getStore();
  const id = 'biz_' + Math.random().toString(36).substring(2, 9);
  const newBiz: Business = {
    ...data,
    id,
    active: true,
    plan: data.plan || 'mensual',
    pageViews: 1,
    ownerEmail: data.ownerEmail || '',
    ownerPin: data.ownerPin || '1234',
    createdAt: new Date().toISOString(),
  };
  store.businesses[data.slug] = newBiz;
  store.categories[id] = [
    { id: 'cat_' + Math.random().toString(36).substring(2, 6), businessId: id, name: 'Favoritos', order: 1 }
  ];
  // Seed with 2 starter products so the store isn't empty!
  store.products[id] = [
    {
      id: 'prod_' + Math.random().toString(36).substring(2, 7),
      businessId: id,
      name: 'Combo Especial de Bienvenida',
      category: 'Favoritos',
      price: 12.50,
      compareAtPrice: 15.00,
      available: true,
      featured: true,
      description: 'Nuestra combinación estrella preparada con ingredientes frescos para deleitar a tus clientes.',
      image: data.bannerImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'prod_' + Math.random().toString(36).substring(2, 7),
      businessId: id,
      name: 'Producto Clásico de la Casa',
      category: 'Favoritos',
      price: 5.00,
      available: true,
      featured: false,
      description: 'El favorito de todos los días. Sabor artesanal y calidad garantizada.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    }
  ];
  store.orders[id] = [];
  return newBiz;
}

// ── SuperAdmin Platform Queries ──
export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  const store = getStore();
  const allStores = Object.values(store.businesses);
  const activeStores = allStores.filter(b => b.active !== false);
  const allOrders = Object.values(store.orders).flat();
  const totalGmv = allOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const totalRevenue = (store.payments || []).reduce((sum, p) => sum + (p.status === 'completado' ? p.amount : 0), 0);
  const mrr = activeStores.reduce((sum, b) => {
    const plan = (b.plan || '').toLowerCase();
    if (plan.includes('big') || plan.includes('34') || plan.includes('37')) return sum + 34;
    if (plan.includes('anual')) return sum + Math.round(190 / 12);
    if (plan.includes('inicial') || plan.includes('12')) return sum + 12;
    return sum + 12;
  }, 0);

  return {
    mrr,
    totalRevenue,
    totalGmv,
    totalOrders: allOrders.length,
    activeStores: activeStores.length,
    totalStores: allStores.length,
  };
}

export async function getPlatformPayments(): Promise<PlatformPayment[]> {
  const store = getStore();
  return store.payments ? [...store.payments] : [];
}

export async function addPlatformPayment(data: Omit<PlatformPayment, 'id' | 'createdAt'>): Promise<PlatformPayment> {
  const store = getStore();
  if (!store.payments) store.payments = [];
  const newPayment: PlatformPayment = {
    ...data,
    id: 'pay_' + Math.random().toString(36).substring(2, 8),
    createdAt: new Date().toISOString(),
  };
  store.payments.unshift(newPayment);
  return newPayment;
}

export async function deletePlatformPayment(paymentId: string): Promise<boolean> {
  const store = getStore();
  if (!store.payments) return false;
  store.payments = store.payments.filter(p => p.id !== paymentId);
  return true;
}

export async function resetPlatformMetricsAndPayments(): Promise<boolean> {
  const store = getStore();
  store.payments = [];
  store.orders = {};
  Object.values(store.businesses).forEach(b => {
    b.pageViews = 0;
  });
  return true;
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
    image: productData.image || (productData.images && productData.images[0]) || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    images: productData.images && productData.images.length > 0 ? productData.images : (productData.image ? [productData.image] : ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80']),
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

export async function restoreMockDemoStore(slugOrId: string): Promise<boolean> {
  const store = getStore();
  const clean = slugOrId.toLowerCase().trim();
  const biz = Object.values(store.businesses).find(
    b => b.slug.toLowerCase() === clean || b.id === clean
  );
  if (!biz) return false;

  const bizId = biz.id;
  if (initialCategories[bizId]) {
    store.categories[bizId] = JSON.parse(JSON.stringify(initialCategories[bizId]));
  }
  if (initialProducts[bizId]) {
    store.products[bizId] = JSON.parse(JSON.stringify(initialProducts[bizId]));
  }

  // Restore core business parameters (protecting slug, PIN 543543, active state)
  if (initialBusinesses[biz.slug]) {
    store.businesses[biz.slug] = {
      ...initialBusinesses[biz.slug],
      ownerPin: '543543',
      active: true,
    };
  }
  return true;
}
