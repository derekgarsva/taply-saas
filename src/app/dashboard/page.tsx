'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Business, Product, Category, Order, MultiLinkItem } from '@/types';
import QRCodeModal from '@/components/storefront/QRCodeModal';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedGroup } from '@/components/motion';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Sliders,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  Check,
  Copy,
  TrendingUp,
  Users,
  DollarSign,
  QrCode,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Store
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#00594C] rounded-full animate-spin" />
            <p className="text-sm font-semibold text-gray-600">Cargando panel de control...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'panaderia-la-estrella';

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'branding'>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Modals state
  const [productModal, setProductModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    product: Partial<Product>;
  }>({
    open: false,
    mode: 'create',
    product: {
      name: '',
      category: '',
      price: 0,
      compareAtPrice: 0,
      available: true,
      image: '',
      description: '',
      featured: false,
    },
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/${storeSlug}`);
        if (res.ok) {
          const data = await res.json();
          setBusiness(data.business);
          setProducts(data.products || []);
          setCategories(data.categories || []);

          // Fetch orders
          const ordersRes = await fetch(`/api/orders?businessId=${data.business.id}`);
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            setOrders(ordersData);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [storeSlug]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  // Stats calculation
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + (ord.status !== 'cancelado' ? ord.total : 0), 0);
  }, [orders]);

  const conversionRate = useMemo(() => {
    if (!business?.pageViews || business.pageViews === 0) return 0;
    return Math.min(100, ((orders.length / business.pageViews) * 100)).toFixed(1);
  }, [business, orders]);

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !productModal.product.name?.trim()) {
      showToastMsg('Ingresa el nombre del producto');
      return;
    }

    try {
      const payload = {
        ...productModal.product,
        businessId: business.id,
        price: Number(productModal.product.price) || 0,
        compareAtPrice: productModal.product.compareAtPrice ? Number(productModal.product.compareAtPrice) : undefined,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        setProducts(prev => {
          const idx = prev.findIndex(p => p.id === saved.id);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = saved;
            return updated;
          }
          return [saved, ...prev];
        });
        showToastMsg(productModal.mode === 'create' ? '¡Producto creado!' : '¡Producto actualizado!');
        setProductModal({ open: false, mode: 'create', product: {} });
      }
    } catch {
      showToastMsg('Error al guardar producto');
    }
  };

  const handleToggleProductStock = async (product: Product) => {
    if (!business) return;
    const newStatus = !product.available;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          businessId: business.id,
          available: newStatus,
        }),
      });

      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, available: newStatus } : p));
        showToastMsg(newStatus ? `${product.name} activado` : `${product.name} marcado agotado`);
      }
    } catch {}
  };

  const handleDeleteProduct = async (id: string) => {
    if (!business || !confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const res = await fetch(`/api/products?businessId=${business.id}&productId=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToastMsg('Producto eliminado');
        setProductModal({ open: false, mode: 'create', product: {} });
      }
    } catch {
      showToastMsg('Error al eliminar');
    }
  };

  // Category CRUD
  const handleAddCategory = async () => {
    if (!business || !newCategoryName.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          name: newCategoryName.trim(),
        }),
      });
      if (res.ok) {
        const cat = await res.json();
        setCategories(prev => [...prev, cat]);
        setNewCategoryName('');
        showToastMsg(`Categoría "${cat.name}" añadida`);
      }
    } catch {
      showToastMsg('Error al agregar categoría');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!business || !confirm('¿Eliminar esta categoría? Los productos asociados permanecerán')) return;
    try {
      const res = await fetch(`/api/categories?businessId=${business.id}&categoryId=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        showToastMsg('Categoría eliminada');
      }
    } catch {}
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!business) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          orderId,
          status,
        }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        showToastMsg(`Pedido marcado como: ${status}`);
      }
    } catch {}
  };

  // Business settings update
  const handleSaveBusinessSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    try {
      const res = await fetch('/api/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business),
      });
      if (res.ok) {
        const updated = await res.json();
        setBusiness(updated);
        showToastMsg('¡Ajustes de tienda guardados!');
      }
    } catch {
      showToastMsg('Error al guardar ajustes');
    } finally {
      setSaving(false);
    }
  };

  const copyStoreUrl = () => {
    if (!business) return;
    const url = `${window.location.origin}/${business.slug}`;
    navigator.clipboard.writeText(url);
    showToastMsg('¡Enlace del catálogo copiado!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#00594C] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-6 rounded-3xl shadow-sm border border-gray-200 text-center">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Tienda no encontrada</h2>
          <p className="text-xs text-gray-500 mt-1 mb-4">No se pudo cargar la información para "{storeSlug}".</p>
          <Link href="/onboarding" className="inline-block py-2.5 px-4 bg-[#00594C] text-white rounded-xl text-xs font-bold">
            Crear Nueva Tienda
          </Link>
        </div>
      </div>
    );
  }

  const liveStoreUrl = `/${business.slug}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans pb-24">
      {/* ══ TOP BAR / HEADER ══ */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#00594C] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                T
              </span>
              <span className="font-extrabold text-base tracking-tight text-gray-900 hidden sm:inline">
                Taply <span className="text-xs font-bold text-[#00594C] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Panel</span>
              </span>
            </Link>

            <span className="text-gray-300 hidden sm:inline">|</span>

            {/* Store title badge */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs sm:text-sm text-gray-800 truncate max-w-[140px] sm:max-w-[200px]">
                {business.name}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyStoreUrl}
              className="h-9 px-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Copiar Link</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQR(true)}
              className="h-9 px-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Código QR</span>
            </button>

            <a
              href={liveStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3.5 rounded-full bg-[#00594C] text-white hover:bg-[#00463C] active:scale-95 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Catálogo</span>
            </a>
          </div>
        </div>

        {/* ══ NAVIGATION TABS CON SLIDING PILL ══ */}
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 py-1.5">
          {[
            { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
            { id: 'products', label: `Productos (${products.length})`, icon: Package },
            { id: 'categories', label: `Categorías (${categories.length})`, icon: FolderTree },
            { id: 'orders', label: `Pedidos WhatsApp (${orders.length})`, icon: ShoppingBag },
            { id: 'branding', label: 'Marca y Cobros', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors duration-150 z-10 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-dashboard-tab-pill"
                    className="absolute inset-0 bg-gray-900 rounded-xl shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ══ MAIN CONTAINER ══ */}
      <main className="max-w-5xl mx-auto px-4 pt-6">

        {/* ════ TAB 1: OVERVIEW ════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Store Link Promo Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#00594C] to-[#014137] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-200 uppercase">
                  TU ENLACE PÚBLICO
                </span>
                <h3 className="text-xl font-extrabold mt-0.5">
                  taply.app/{business.slug}
                </h3>
                <p className="text-xs text-emerald-100 mt-1">
                  Coloca este enlace en tu perfil de Instagram, TikTok o código QR de tus mesas.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyStoreUrl}
                  className="h-10 px-4 rounded-full bg-white text-gray-900 font-bold text-xs flex items-center gap-2 hover:bg-gray-100 active:scale-95 transition-all shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-gray-700" />
                  <span>Copiar Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQR(true)}
                  className="h-10 px-4 rounded-full bg-white/20 text-white font-bold text-xs flex items-center gap-2 hover:bg-white/30 active:scale-95 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Descargar QR</span>
                </button>
              </div>
            </div>

            {/* KPI Cards con AnimatedGroup */}
            <AnimatedGroup
              variant="fade-up"
              stagger={0.06}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-semibold">Ventas Estimadas</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {business.currencySymbol}{totalRevenue.toFixed(2)}
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  En pedidos por WhatsApp
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-semibold">Pedidos Recibidos</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {orders.length}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  Checkout instantáneo
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-semibold">Visitas al Catálogo</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {business.pageViews}
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Clientes que abrieron el link
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-semibold">Conversión a WhatsApp</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {conversionRate}%
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Ratio visitas / pedidos
                </span>
              </div>
            </AnimatedGroup>

            {/* Recent Orders Preview */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base">Últimos Pedidos por WhatsApp</h4>
                  <p className="text-xs text-gray-500">Pedidos registrados con el botón deslizable</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#00594C] hover:underline"
                >
                  Ver todos →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  No hay pedidos registrados aún. ¡Abre tu catálogo y haz una orden de prueba!
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.slice(0, 3).map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900">#{ord.id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            ord.status === 'completado' ? 'bg-emerald-50 text-emerald-700' :
                            ord.status === 'en_proceso' ? 'bg-blue-50 text-blue-700' :
                            ord.status === 'cancelado' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-sm text-gray-900">
                          {business.currencySymbol}{ord.total.toFixed(2)}
                        </span>
                        <span className="block text-[10px] text-gray-400">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ TAB 2: PRODUCTS ════ */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-fade-in">
            {/* Header with Search and New Product button */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar productos por nombre o descripción..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-700"
                >
                  <option value="Todas">Todas las categorías</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setProductModal({
                  open: true,
                  mode: 'create',
                  product: {
                    name: '',
                    category: categories[0]?.name || 'General',
                    price: 1.0,
                    available: true,
                    image: '',
                    description: '',
                    featured: false,
                  },
                })}
                className="h-10 px-4 rounded-xl bg-[#00594C] text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-xs whitespace-nowrap"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Nuevo Producto</span>
              </button>
            </div>

            {/* Product Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {products
                .filter(p => {
                  const matchSearch = productSearch === '' || p.name.toLowerCase().includes(productSearch.toLowerCase());
                  const matchCat = categoryFilter === 'Todas' || p.category === categoryFilter;
                  return matchSearch && matchCat;
                })
                .map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 bg-white border border-gray-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0 bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-gray-900 truncate">{product.name}</h4>
                          {product.featured && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">
                              TOP
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                            {product.category}
                          </span>
                          <span className="text-sm font-extrabold text-[#00594C]">
                            {business.currencySymbol}{product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Stock Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleProductStock(product)}
                        className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all ${
                          product.available
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {product.available ? 'En Stock' : 'Agotado'}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => setProductModal({
                          open: true,
                          mode: 'edit',
                          product: { ...product },
                        })}
                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ════ TAB 3: CATEGORIES ════ */}
        {activeTab === 'categories' && (
          <div className="space-y-4 animate-fade-in max-w-xl">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
              <h4 className="font-extrabold text-gray-900 text-base mb-1">Categorías del Catálogo</h4>
              <p className="text-xs text-gray-500 mb-4">
                Organiza las pestañas horizontales de tu catálogo.
              </p>

              {/* Add category input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Ej. Bebidas, Desayunos, Combos..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="h-11 px-4 rounded-xl bg-[#00594C] text-white text-xs font-bold active:scale-95 shadow-xs"
                >
                  + Agregar
                </button>
              </div>

              {/* Categories list */}
              <div className="divide-y divide-gray-100">
                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat.name).length;
                  return (
                    <div key={cat.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-gray-900">{cat.name}</span>
                        <span className="text-[11px] text-gray-400 ml-2">({count} productos)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 text-xs font-semibold"
                      >
                        Eliminar
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ════ TAB 4: ORDERS ════ */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base">Registro de Pedidos WhatsApp</h4>
                  <p className="text-xs text-gray-500">
                    Controla el despacho de los pedidos generados por tus clientes
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  Total: {orders.length} pedidos
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  No hay pedidos registrados todavía.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900">Orden #{order.id}</span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#00594C]">
                            {business.currencySymbol}{order.total.toFixed(2)}
                          </span>

                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="h-8 px-2 text-xs font-bold rounded-lg border border-gray-200 bg-gray-50 text-gray-800"
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="en_proceso">En Proceso</option>
                            <option value="completado">Completado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2">
                        <ul className="text-xs text-gray-700 space-y-1">
                          {order.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>{it.quantity}x {it.name}</span>
                              <span className="text-gray-400">{business.currencySymbol}{(it.price * it.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ TAB 5: BRANDING & SETTINGS ════ */}
        {activeTab === 'branding' && (
          <form onSubmit={handleSaveBusinessSettings} className="space-y-5 animate-fade-in max-w-2xl">
            {/* Info and Cover */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <div>
                <h4 className="font-extrabold text-gray-900 text-base">Identidad de Marca y Portada</h4>
                <p className="text-xs text-gray-500">Personaliza la presentación de tu catálogo</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre del Negocio</label>
                <input
                  type="text"
                  value={business.name}
                  onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                  className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Rubro / Subtítulo</label>
                  <input
                    type="text"
                    value={business.category}
                    onChange={(e) => setBusiness({ ...business, category: e.target.value })}
                    className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ciudad / Ubicación</label>
                  <input
                    type="text"
                    value={business.city}
                    onChange={(e) => setBusiness({ ...business, city: e.target.value })}
                    className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción del Negocio</label>
                <textarea
                  rows={3}
                  value={business.desc}
                  onChange={(e) => setBusiness({ ...business, desc: e.target.value })}
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Foto de Portada (URL)</label>
                <div className="flex gap-3 items-center">
                  <img
                    src={business.bannerImage}
                    alt="Portada"
                    className="w-14 h-14 object-cover rounded-xl border border-gray-200 flex-shrink-0 bg-gray-100"
                  />
                  <input
                    type="text"
                    value={business.bannerImage}
                    onChange={(e) => setBusiness({ ...business, bannerImage: e.target.value })}
                    className="flex-1 h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                  />
                </div>
              </div>

              {/* Accent Theme Color */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Color de Marca</label>
                <div className="flex items-center gap-2">
                  {['#00594C', '#DC2626', '#2563EB', '#7C3AED', '#D97706', '#18181B'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBusiness({ ...business, themeColor: c })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-95 ${
                        business.themeColor === c ? 'border-gray-900 scale-110 shadow-xs' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={business.themeColor}
                    onChange={(e) => setBusiness({ ...business, themeColor: e.target.value })}
                    className="w-8 h-8 p-0 border border-gray-200 rounded-full cursor-pointer ml-2"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp and Payment Details */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <div>
                <h4 className="font-extrabold text-gray-900 text-base">WhatsApp y Cobros</h4>
                <p className="text-xs text-gray-500">Datos que se adjuntan al mensaje de pedido</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Número de WhatsApp (con código de país)</label>
                <input
                  type="text"
                  value={business.phone}
                  onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                  placeholder="Ej. 584146001234"
                  className="w-full h-11 px-3.5 text-xs font-mono font-semibold bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Para Venezuela: 58414... o 58412... (sin signo +)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notas de Pago (Pago Móvil / Zelle / Efectivo)</label>
                <textarea
                  rows={4}
                  value={business.paymentNotes}
                  onChange={(e) => setBusiness({ ...business, paymentNotes: e.target.value })}
                  className="w-full p-3 text-xs font-mono bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 rounded-2xl bg-[#00594C] text-white text-xs font-extrabold flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Guardar Todos los Cambios'}</span>
            </button>
          </form>
        )}
      </main>

      {/* ══ MODAL: CREATE / EDIT PRODUCT ══ */}
      <AnimatePresence>
        {productModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setProductModal({ open: false, mode: 'create', product: {} })}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-base">
                  {productModal.mode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
                </h3>
                <button
                  type="button"
                  onClick={() => setProductModal({ open: false, mode: 'create', product: {} })}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Foto del Producto (URL)</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={productModal.product.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80'}
                      alt="Previa"
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 bg-gray-50 flex-shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="https://..."
                      value={productModal.product.image || ''}
                      onChange={(e) => setProductModal({
                        ...productModal,
                        product: { ...productModal.product, image: e.target.value }
                      })}
                      className="flex-1 h-10 px-3 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    placeholder="Ej. Golfeado Meloso"
                    value={productModal.product.name || ''}
                    onChange={(e) => setProductModal({
                      ...productModal,
                      product: { ...productModal.product, name: e.target.value }
                    })}
                    className="w-full h-10 px-3 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Categoría</label>
                    <select
                      value={productModal.product.category || categories[0]?.name || 'General'}
                      onChange={(e) => setProductModal({
                        ...productModal,
                        product: { ...productModal.product, category: e.target.value }
                      })}
                      className="w-full h-10 px-2 text-xs border border-gray-200 rounded-xl bg-white outline-none focus:border-[#00594C]"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Precio (${business.currency})</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="3.50"
                      value={productModal.product.price ?? ''}
                      onChange={(e) => setProductModal({
                        ...productModal,
                        product: { ...productModal.product, price: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full h-10 px-3 text-xs font-bold border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción (Opcional)</label>
                  <textarea
                    rows={2}
                    placeholder="Ingredientes, porciones, detalles..."
                    value={productModal.product.description || ''}
                    onChange={(e) => setProductModal({
                      ...productModal,
                      product: { ...productModal.product, description: e.target.value }
                    })}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productModal.product.available !== false}
                      onChange={(e) => setProductModal({
                        ...productModal,
                        product: { ...productModal.product, available: e.target.checked }
                      })}
                      className="w-4 h-4 accent-[#00594C]"
                    />
                    <span>Producto disponible para pedidos</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(productModal.product.featured)}
                      onChange={(e) => setProductModal({
                        ...productModal,
                        product: { ...productModal.product, featured: e.target.checked }
                      })}
                      className="w-4 h-4 accent-[#00594C]"
                    />
                    <span>Marcar como Popular / Destacado</span>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full h-11 bg-[#00594C] text-white font-extrabold rounded-xl text-xs active:scale-98 transition-transform"
                  >
                    {productModal.mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ QR CODE MODAL ══ */}
      {showQR && (
        <QRCodeModal
          businessName={business.name}
          url={typeof window !== 'undefined' ? `${window.location.origin}/${business.slug}` : `https://taply.app/${business.slug}`}
          onClose={() => setShowQR(false)}
          accentColor={business.themeColor}
        />
      )}

      {/* ══ TOAST NOTIFICATION ══ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 15, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#18181B] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-none"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
