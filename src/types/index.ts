export interface MultiLinkItem {
  id: string;
  type: 'instagram' | 'tiktok' | 'maps' | 'phone' | 'website' | 'facebook' | 'custom';
  label: string;
  url: string;
  active: boolean;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  desc: string;
  bannerImage: string;
  logoImage?: string;
  themeColor: string;
  phone: string;
  currency: string;
  currencySymbol: string;
  paymentNotes: string;
  links: MultiLinkItem[];
  pageViews: number;
  active?: boolean;
  plan?: 'gratis' | 'mensual' | 'anual';
  planExpiresAt?: string;
  createdAt: string;
}

export interface PlatformPayment {
  id: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  plan: 'Mensual ($19)' | 'Anual ($190)' | 'Personalizado';
  amount: number;
  currency: string;
  method: 'Pago Móvil' | 'Zelle' | 'Binance USDT' | 'Efectivo Divisas' | 'Stripe';
  reference?: string;
  notes?: string;
  status: 'completado' | 'pendiente';
  createdAt: string;
}

export interface PlatformMetrics {
  mrr: number;
  totalRevenue: number;
  totalGmv: number;
  totalOrders: number;
  activeStores: number;
  totalStores: number;
}

export interface Category {
  id: string;
  businessId: string;
  name: string;
  order: number;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  image: string;
  description?: string;
  featured?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  businessId: string;
  items: OrderItem[];
  total: number;
  customerNote?: string;
  status: 'nuevo' | 'en_proceso' | 'completado' | 'cancelado';
  createdAt: string;
  whatsappMessage?: string;
}

export interface CartState {
  [productId: string]: number;
}
