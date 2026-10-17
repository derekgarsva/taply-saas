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
  Store,
  Upload,
  Image as ImageIcon,
  Crown,
  Zap,
  CreditCard,
  ShieldCheck,
  Star,
  Images,
  Calendar,
  ArrowUpRight,
  BarChart3,
} from 'lucide-react';
import DashboardCardNav from '@/components/navigation/DashboardCardNav';
import LineChart, { LineChartDatum, LineChartSeries } from '@/components/ui/line-chart';

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
  const [showPlanModal, setShowPlanModal] = useState(false);

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

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (url: string) => void,
    folder: string = 'products'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onComplete(data.url);
          setToast('Imagen subida correctamente');
          return;
        }
      }

      // Fallback to local DataURL
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          onComplete(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          onComplete(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMultipleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: string = 'products'
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) continue;
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', folder);

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              uploadedUrls.push(data.url);
              continue;
            }
          }

          // Fallback to local DataURL
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = (uploadEvent) => resolve(uploadEvent.target?.result as string);
            reader.readAsDataURL(file);
          });
          uploadedUrls.push(dataUrl);
        } catch {
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = (uploadEvent) => resolve(uploadEvent.target?.result as string);
            reader.readAsDataURL(file);
          });
          uploadedUrls.push(dataUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        setProductModal((prev) => {
          const current = prev.product.images || (prev.product.image ? [prev.product.image] : []);
          const merged = [...current, ...uploadedUrls];
          return {
            ...prev,
            product: {
              ...prev.product,
              images: merged,
              image: merged[0] || '',
            },
          };
        });
        showToastMsg(`¡${uploadedUrls.length} imagen(es) añadida(s)!`);
      }
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveProductImage = (indexToRemove: number) => {
    setProductModal((prev) => {
      const current = prev.product.images || (prev.product.image ? [prev.product.image] : []);
      const filtered = current.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        product: {
          ...prev.product,
          images: filtered,
          image: filtered[0] || '',
        },
      };
    });
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setProductModal((prev) => {
      const current = prev.product.images || (prev.product.image ? [prev.product.image] : []);
      if (indexToPrimary === 0 || !current[indexToPrimary]) return prev;
      const item = current[indexToPrimary];
      const rest = current.filter((_, idx) => idx !== indexToPrimary);
      const reordered = [item, ...rest];
      return {
        ...prev,
        product: {
          ...prev.product,
          images: reordered,
          image: reordered[0],
        },
      };
    });
    showToastMsg('Foto principal actualizada');
  };

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

  // ── Time range filter for Owner Dashboard ──
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('7d');

  const numDays = useMemo(() => {
    if (timeRange === '7d') return 7;
    if (timeRange === '14d') return 14;
    return 30;
  }, [timeRange]);

  // Aggregated metrics & chart data for selected time range
  const { periodOrders, periodRevenue, periodAvgTicket, chartData } = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (numDays - 1), 0, 0, 0);

    const filteredOrders = orders.filter((ord) => {
      if (ord.status === 'cancelado') return false;
      const orderDate = new Date(ord.createdAt);
      return !isNaN(orderDate.getTime()) && orderDate >= cutoffDate;
    });

    const rev = filteredOrders.reduce((sum, ord) => sum + ord.total, 0);
    const avgTicket = filteredOrders.length > 0 ? rev / filteredOrders.length : 0;

    const daysArr: LineChartDatum[] = [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}-${mm}-${dd}`;

      const dayOrders = filteredOrders.filter((ord) => {
        const od = new Date(ord.createdAt);
        const oKey = `${od.getFullYear()}-${String(od.getMonth() + 1).padStart(2, '0')}-${String(od.getDate()).padStart(2, '0')}`;
        return oKey === dateKey;
      });

      const daySales = dayOrders.reduce((sum, ord) => sum + ord.total, 0);
      const dayCount = dayOrders.length;

      const isToday = i === 0;
      const dayName = daysOfWeek[d.getDay()];
      const dayNum = d.getDate();
      const monthName = months[d.getMonth()];

      let axisLabel = `${dayNum} ${monthName}`;
      if (numDays === 7) {
        axisLabel = isToday ? 'Hoy' : dayName;
      } else if (numDays === 14) {
        axisLabel = i % 2 === 0 ? (isToday ? 'Hoy' : `${dayNum} ${monthName}`) : '';
      } else {
        axisLabel = i % 5 === 0 ? (isToday ? 'Hoy' : `${dayNum} ${monthName}`) : '';
      }

      daysArr.push({
        key: dateKey,
        label: `${dayName} ${dayNum} de ${monthName}`,
        axisLabel,
        values: {
          ventas: daySales,
          pedidos: dayCount,
        },
      });
    }

    return {
      periodOrders: filteredOrders,
      periodRevenue: rev,
      periodAvgTicket: avgTicket,
      chartData: daysArr,
    };
  }, [orders, numDays]);

  const periodConversionRate = useMemo(() => {
    if (!business?.pageViews || business.pageViews === 0) return '0.0';
    const viewsInWindow = Math.max(1, Math.round((business.pageViews * numDays) / 30));
    return Math.min(100, (periodOrders.length / viewsInWindow) * 100).toFixed(1);
  }, [business?.pageViews, numDays, periodOrders.length]);

  const chartSeries: LineChartSeries[] = useMemo(() => [
    {
      key: 'ventas',
      label: `Ventas (${business?.currencySymbol || '$'})`,
      color: '#00594C',
      area: true,
    },
    {
      key: 'pedidos',
      label: 'Pedidos WhatsApp',
      color: '#0284c7',
      dashed: true,
    },
  ], [business?.currencySymbol]);

  const currentPlanLabel = useMemo(() => {
    if (!business?.plan) return 'Plan Inicial ($12)';
    const p = business.plan.toLowerCase();
    if (p.includes('big') || p.includes('34') || p.includes('37')) return 'Big Taply ($34)';
    if (p.includes('anual')) return 'Plan Anual';
    return 'Plan Inicial ($12)';
  }, [business?.plan]);

  const isBigPlan = useMemo(() => {
    return currentPlanLabel.includes('Big') || currentPlanLabel.includes('34') || currentPlanLabel.includes('37');
  }, [currentPlanLabel]);

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !productModal.product.name?.trim()) {
      showToastMsg('Ingresa el nombre del producto');
      return;
    }

    try {
      const imagesArr = productModal.product.images || (productModal.product.image ? [productModal.product.image] : []);
      const payload = {
        ...productModal.product,
        businessId: business.id,
        price: Number(productModal.product.price) || 0,
        compareAtPrice: productModal.product.compareAtPrice ? Number(productModal.product.compareAtPrice) : undefined,
        images: imagesArr,
        image: imagesArr[0] || productModal.product.image || '',
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
      } else {
        const errData = await res.json().catch(() => ({}));
        showToastMsg(errData.error || 'Error al guardar producto');
        if (errData.limitReached) {
          setShowPlanModal(true);
        }
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
      {/* ══ 1. ADAPTED DASHBOARD CARDNAV (REACTBITS FLOATING TRANSLUCENT CARD WITH STORE MENUS) ══ */}
      <DashboardCardNav
        business={business}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productsCount={products.length}
        categoriesCount={categories.length}
        ordersCount={orders.length}
        currentPlanLabel={currentPlanLabel}
        onCopyLink={copyStoreUrl}
        onOpenQR={() => setShowQR(true)}
        onOpenPlan={() => setShowPlanModal(true)}
        liveStoreUrl={liveStoreUrl}
      />

      {/* ══ MAIN CONTAINER ══ */}
      <main className="max-w-5xl mx-auto px-4 pt-3 sm:pt-4">

        {/* ══ BESPOKE HORIZONTAL SEGMENTED TABS (FAST IN-PAGE NAVIGATION) ══ */}
        <div className="mb-6 overflow-x-auto no-scrollbar py-1">
          <nav className="inline-flex items-center gap-1.5 p-1.5 bg-white/80 backdrop-blur-md border border-gray-200/90 rounded-2xl sm:rounded-full shadow-2xs min-w-full sm:min-w-0">
            {[
              { id: 'overview' as const, label: 'Resumen', icon: LayoutDashboard, count: null },
              { id: 'products' as const, label: 'Productos', icon: Package, count: products.length },
              { id: 'categories' as const, label: 'Categorías', icon: FolderTree, count: categories.length },
              { id: 'orders' as const, label: 'Pedidos WhatsApp', icon: ShoppingBag, count: orders.length },
              { id: 'branding' as const, label: 'Marca y Cobros', icon: Sliders, count: null },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all whitespace-nowrap select-none flex-shrink-0 ${
                    isActive
                      ? 'text-gray-950 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dashboard-main-tab-pill"
                      className="absolute inset-0 bg-white rounded-xl sm:rounded-full border border-black/5 shadow-2xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00594C]' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

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

            {/* ══ COMMERCIAL INTELLIGENCE & TIME RANGE SELECTOR (7d | 14d | 30d) ══ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#00594C]" />
                  <h3 className="text-lg font-black tracking-tight text-gray-950">Inteligencia Comercial</h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    En Vivo
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Métricas registradas automáticamente mediante pedidos por WhatsApp y tráfico a tu catálogo
                </p>
              </div>

              {/* Time Range Selector: 7d | 14d | 30d */}
              <div className="flex items-center p-1 bg-gray-200/60 border border-gray-200 rounded-2xl self-start sm:self-auto shadow-2xs">
                {(['7d', '14d', '30d'] as const).map((range) => {
                  const isSelected = timeRange === range;
                  const label = range === '7d' ? '7 días' : range === '14d' ? '14 días' : '30 días';
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setTimeRange(range)}
                      className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected ? 'text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="active-time-range-pill"
                          className="absolute inset-0 bg-white rounded-xl border border-black/5"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ══ PERIOD KPI METRIC CARDS ══ */}
            <AnimatedGroup
              variant="fade-up"
              stagger={0.05}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {/* Ventas del Período */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-gray-500 mb-2.5">
                  <span className="text-xs font-bold text-gray-600">Ventas ({timeRange === '7d' ? '7d' : timeRange === '14d' ? '14d' : '30d'})</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00594C] flex items-center justify-center font-bold">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                  {business.currencySymbol}{periodRevenue.toFixed(2)}
                </div>
                <span className="text-[11px] text-gray-500 font-medium mt-1.5 block">
                  En {periodOrders.length} {periodOrders.length === 1 ? 'pedido confirmado' : 'pedidos confirmados'}
                </span>
              </div>

              {/* Pedidos Recibidos */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-gray-500 mb-2.5">
                  <span className="text-xs font-bold text-gray-600">Pedidos WhatsApp</span>
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                  {periodOrders.length}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1.5 block">
                  Checkout con 1 deslizamiento
                </span>
              </div>

              {/* Ticket Promedio */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-gray-500 mb-2.5">
                  <span className="text-xs font-bold text-gray-600">Ticket Promedio</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                  {business.currencySymbol}{periodAvgTicket.toFixed(2)}
                </div>
                <span className="text-[11px] text-gray-500 font-medium mt-1.5 block">
                  Promedio por orden de compra
                </span>
              </div>

              {/* Tasa de Conversión */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-gray-500 mb-2.5">
                  <span className="text-xs font-bold text-gray-600">Conversión</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                  {periodConversionRate}%
                </div>
                <span className="text-[11px] text-gray-500 font-medium mt-1.5 block">
                  Visitas que iniciaron pedido
                </span>
              </div>
            </AnimatedGroup>

            {/* ══ ARC UI LINE CHART CARD ══ */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="font-extrabold text-gray-950 text-base flex items-center gap-2">
                    Evolución de Ventas y Pedidos
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      Últimos {numDays} días
                    </span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Gráfico interactivo con cubic-spline, crosshair dinámico y desglose diario
                  </p>
                </div>
                <div className="text-xs font-bold text-gray-500 flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00594C]" />
                    Ventas ({business.currencySymbol})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                    Pedidos WhatsApp
                  </span>
                </div>
              </div>

              <div className="w-full pt-2">
                <LineChart
                  data={chartData}
                  series={chartSeries}
                  label="Ventas y Pedidos Diarios"
                  unit={business.currencySymbol}
                  height={240}
                  formatValue={(val, s) =>
                    s.key === 'ventas'
                      ? `${business.currencySymbol}${val.toFixed(2)}`
                      : `${Math.round(val)} pedidos`
                  }
                />
              </div>
            </div>

            {/* Subscription & Current Plan Card */}
            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isBigPlan ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-[#00594C]'
                }`}>
                  {isBigPlan ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Plan Activo:</span>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {currentPlanLabel}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      Suscripción Activa • 0% Comisiones
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {isBigPlan
                      ? `Disfrutas de catálogo ilimitado y atención directa con el fundador. (${products.length} productos activos).`
                      : `Catálogo de hasta 100 productos (${products.length}/100 cargados). Si superas los 100 o requieres soporte VIP puedes cambiar a Big Taply.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(true)}
                  className="w-full md:w-auto h-10 px-4 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Cambiar de Plan</span>
                </button>
              </div>
            </div>

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
                onClick={() => {
                  if (products.length >= 100 && !isBigPlan) {
                    showToastMsg('Has alcanzado el límite de 100 productos del Plan Inicial ($12).');
                    setShowPlanModal(true);
                    return;
                  }
                  setProductModal({
                    open: true,
                    mode: 'create',
                    product: {
                      name: '',
                      category: categories[0]?.name || 'General',
                      price: 1.0,
                      available: true,
                      image: '',
                      images: [],
                      description: '',
                      featured: false,
                    },
                  });
                }}
                className="h-10 px-4 rounded-xl bg-[#00594C] text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-xs whitespace-nowrap"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Nuevo Producto</span>
              </button>
            </div>

            {/* Product Limit Warning Banner for Plan Inicial */}
            {products.length >= 100 && !isBigPlan && (
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center flex-shrink-0">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-amber-950">
                      Límite de 100 productos alcanzado (Plan Inicial)
                    </h5>
                    <p className="text-[11px] text-amber-800">
                      Tienes {products.length}/100 productos. Para desbloquear catálogo ilimitado, solicita el plan Big Taply al fundador.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPlanModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#00594C] text-white text-xs font-bold whitespace-nowrap active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Mejorar a Big Taply ($37)</span>
                </button>
              </div>
            )}

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
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                        {product.images && product.images.length > 1 && (
                          <div className="absolute bottom-1 right-1 bg-black/65 backdrop-blur-xs text-white text-[8px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5 shadow-2xs">
                            <Images className="w-2.5 h-2.5" />
                            <span>{product.images.length}</span>
                          </div>
                        )}
                      </div>
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
                        onClick={() => {
                          const prodImages = Array.isArray(product.images) && product.images.length > 0
                            ? product.images
                            : (product.image ? [product.image] : []);
                          setProductModal({
                            open: true,
                            mode: 'edit',
                            product: {
                              ...product,
                              images: prodImages,
                              image: prodImages[0] || product.image || '',
                            },
                          });
                        }}
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
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Foto de Portada del Catálogo</label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="relative w-28 h-20 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 shadow-2xs">
                    {business.bannerImage ? (
                      <img
                        src={business.bannerImage}
                        alt="Portada"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs active:scale-98 transition-all">
                      <Upload className={`w-3.5 h-3.5 ${uploadingImage ? 'animate-spin' : ''}`} />
                      <span>{uploadingImage ? 'Subiendo...' : business.bannerImage ? 'Cambiar Foto de Portada' : 'Adjuntar Foto de Portada'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImage}
                        onChange={(e) =>
                          handleFileUpload(e, (url) => setBusiness({ ...business, bannerImage: url }), 'banners')
                        }
                      />
                    </label>
                    <p className="text-[11px] text-gray-400">
                      Sube una imagen desde tu dispositivo (JPG, PNG, WebP).
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Símbolo de Moneda</label>
                  <input
                    type="text"
                    value={business.currencySymbol || '$'}
                    onChange={(e) => setBusiness({ ...business, currencySymbol: e.target.value })}
                    placeholder="Ej. $, Bs, €"
                    className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Código de Moneda</label>
                  <input
                    type="text"
                    value={business.currency || 'USD'}
                    onChange={(e) => setBusiness({ ...business, currency: e.target.value })}
                    placeholder="Ej. USD, VES, EUR"
                    className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
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

            {/* Plan and Subscription Section */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base">Plan y Facturación</h4>
                  <p className="text-xs text-gray-500">Administra tu suscripción mensual en Taply</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {currentPlanLabel}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-900">
                    {isBigPlan ? 'Catálogo Ilimitado + Soporte Prioritario VIP' : 'Plan Inicial: hasta 100 productos (0% Comisiones)'}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {isBigPlan
                      ? '¿Deseas cambiar al Plan Inicial ($12/mes)? Puedes solicitarlo al fundador en cualquier momento.'
                      : '¿Necesitas más de 100 productos? Mejora al plan Big Taply ($37) para soporte VIP y catálogo ilimitado.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPlanModal(true)}
                  className="h-9 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs flex-shrink-0"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Gestionar Plan</span>
                </button>
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
                {/* Multi-Image Manager for Product */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Fotos del Producto{' '}
                      {(productModal.product.images || (productModal.product.image ? [productModal.product.image] : [])).length > 0 && (
                        <span className="text-[#00594C] font-extrabold">
                          ({(productModal.product.images || (productModal.product.image ? [productModal.product.image] : [])).length})
                        </span>
                      )}
                    </label>
                    <span className="text-[10px] text-gray-400">
                      Sube una o varias fotos
                    </span>
                  </div>

                  {(() => {
                    const currentImages = productModal.product.images || (productModal.product.image ? [productModal.product.image] : []);
                    return currentImages.length > 0 ? (
                      <div className="space-y-2 mb-2">
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {currentImages.map((imgUrl, imgIdx) => (
                            <div
                              key={imgIdx}
                              className={`group relative aspect-square rounded-xl overflow-hidden border bg-gray-50 shadow-2xs ${
                                imgIdx === 0
                                  ? 'border-[#00594C] ring-2 ring-[#00594C]/25'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Foto ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                              />

                              {/* Primary Badge or Make Primary */}
                              {imgIdx === 0 ? (
                                <div className="absolute top-1 left-1 bg-[#00594C] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5 pointer-events-none">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>1ª</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(imgIdx)}
                                  className="absolute top-1 left-1 bg-black/65 hover:bg-[#00594C] text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Marcar como foto principal"
                                >
                                  1ª
                                </button>
                              )}

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveProductImage(imgIdx)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 active:scale-90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs text-xs font-bold"
                                title="Eliminar foto"
                              >
                                ✕
                              </button>
                            </div>
                          ))}

                          {/* Add More Photos Card */}
                          <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#00594C] bg-gray-50/50 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors text-gray-500 hover:text-[#00594C]">
                            <Plus className="w-4 h-4" />
                            <span className="text-[10px] font-extrabold">Sumar</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingImage}
                              onChange={(e) => handleMultipleFileUpload(e, 'products')}
                            />
                          </label>
                        </div>

                        {uploadingImage && (
                          <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 animate-pulse">
                            <Upload className="w-3 h-3 animate-spin" />
                            <span>Subiendo fotos a tu catálogo...</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      /* Zero images initial uploader */
                      <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-300 hover:border-[#00594C] rounded-2xl bg-gray-50/50 hover:bg-emerald-50/30 cursor-pointer transition-all mb-2 text-center group">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-emerald-100 text-gray-400 group-hover:text-[#00594C] flex items-center justify-center mb-1.5 transition-colors">
                          <Upload className={`w-5 h-5 ${uploadingImage ? 'animate-spin' : ''}`} />
                        </div>
                        <span className="text-xs font-bold text-gray-800">
                          {uploadingImage ? 'Subiendo fotos...' : 'Subir fotos del producto'}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5">
                          Puedes seleccionar varias fotos a la vez (JPG, PNG, WebP)
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={(e) => handleMultipleFileUpload(e, 'products')}
                        />
                      </label>
                    );
                  })()}
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
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Precio ({business.currencySymbol}{business.currency})</label>
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Precio Antes / Tachado (Opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ej. 4.99 (muestra descuento tachado)"
                    value={productModal.product.compareAtPrice ?? ''}
                    onChange={(e) => setProductModal({
                      ...productModal,
                      product: { ...productModal.product, compareAtPrice: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full h-10 px-3 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                  />
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

      {/* ══ PLAN MANAGEMENT MODAL ══ */}
      <AnimatePresence>
        {showPlanModal && business && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowPlanModal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base leading-tight">
                      Planes y Suscripción Taply
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Gestiona tu suscripción activa para {business.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Plans Comparison */}
              <div className="mt-4 space-y-3">
                {/* Plan Inicial */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  !isBigPlan
                    ? 'border-[#00594C] bg-emerald-50/40 ring-2 ring-[#00594C]/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900">Plan Inicial</span>
                        {!isBigPlan && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00594C] text-white">
                            Tu Plan Actual
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Para marcas y tiendas con hasta 100 productos en catálogo.
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-black text-gray-900">$12</span>
                      <span className="text-[11px] text-gray-400 font-medium">/mes</span>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Hasta 100 productos activos en catálogo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Checkout WhatsApp instantáneo (0% comisiones)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Generador QR para mesas y mostrador</span>
                    </li>
                  </ul>

                  {isBigPlan ? (
                    <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-[11px] text-gray-500">
                        Si bajas a este plan, abonas tu suscripción de <strong>$12</strong> correspondiente a la nueva mensualidad.
                      </p>
                      <a
                        href={`https://wa.me/584243087887?text=${encodeURIComponent(
                          `Hola Derek, soy el dueño de *${business.name}* (taply.app/${business.slug}). Actualmente estoy en el plan Big Taply y deseo cambiar al *Plan Inicial ($12/mes)*. Entiendo que pagaré los $12 de mi suscripción mensual. ¿Me indicas los datos para el pago?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold whitespace-nowrap active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                      >
                        <span>Bajar a Inicial ($12)</span>
                      </a>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Estás disfrutando de este plan actualmente.</span>
                    </div>
                  )}
                </div>

                {/* Big Taply */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isBigPlan
                    ? 'border-[#00594C] bg-emerald-50/40 ring-2 ring-[#00594C]/10'
                    : 'border-amber-300 bg-amber-50/30'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900">Big Taply</span>
                        {isBigPlan ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00594C] text-white">
                            Tu Plan Actual
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Para catálogos grandes, inventarios masivos y marcas líderes.
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-black text-gray-900">$37</span>
                      <span className="text-[11px] text-gray-400 font-medium">/mes</span>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="font-bold text-gray-900">Catálogo de productos ILIMITADO (&gt;100 productos)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Soporte prioritario VIP 1 a 1 directo con el fundador</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Checkout ultra-rápido por WhatsApp + 0% comisiones</span>
                    </li>
                  </ul>

                  {!isBigPlan ? (
                    <div className="mt-3.5 pt-3 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-[11px] text-amber-900">
                        Para pasar de Inicial a Big Taply, se abonan <strong>$37</strong> para activación inmediata.
                      </p>
                      <a
                        href={`https://wa.me/584243087887?text=${encodeURIComponent(
                          `Hola Derek, soy el dueño de *${business.name}* (taply.app/${business.slug}). Actualmente estoy en el *Plan Inicial ($12/mes)* y deseo mejorar al plan *Big Taply ($37)* para tener productos ilimitados y soporte prioritario. ¿Me indicas los datos para transferir los $37?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-[#00594C] hover:bg-[#00463C] text-white text-xs font-extrabold whitespace-nowrap active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-300" />
                        <span>Mejorar a Big Taply ($37)</span>
                      </a>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tienes acceso completo a todas las funciones ilimitadas.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Founder WhatsApp Direct Info Box */}
              <div className="mt-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between gap-3">
                <div className="text-[11px] text-gray-500 leading-relaxed">
                  <span className="font-bold text-gray-800 block">Atención directa con el Fundador</span>
                  Activaciones y cambios de plan procesados en minutos vía Pago Móvil, Zelle o Binance.
                </div>
                <a
                  href={`https://wa.me/584243087887?text=${encodeURIComponent(
                    `Hola Derek, soy el dueño de *${business.name}* (taply.app/${business.slug}). Tengo una consulta sobre mi plan de suscripción en Taply.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 text-[11px] font-bold flex-shrink-0 active:scale-95 transition-all"
                >
                  WhatsApp: +58 424 3087887
                </a>
              </div>
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
