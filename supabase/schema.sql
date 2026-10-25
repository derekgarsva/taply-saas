-- ==============================================================================
-- TAPLY SAAS - DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Multi-Tenant WhatsApp Storefront & E-Commerce Infrastructure
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE: businesses (Comercios / Tiendas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.businesses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  owner_email TEXT,
  owner_pin TEXT DEFAULT '1234',
  pin_recovery_token TEXT,
  pin_recovery_expires_at TIMESTAMPTZ,
  pin_recovery_requested_at TIMESTAMPTZ,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'COMERCIO',
  city TEXT DEFAULT 'Venezuela',
  "desc" TEXT DEFAULT '',
  banner_image TEXT DEFAULT '',
  logo_image TEXT DEFAULT '',
  theme_color TEXT DEFAULT '#00594C',
  phone TEXT NOT NULL,
  currency TEXT DEFAULT 'USD',
  currency_symbol TEXT DEFAULT '$',
  payment_notes TEXT DEFAULT '',
  links JSONB DEFAULT '[]'::jsonb,
  page_views INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  plan TEXT DEFAULT 'Plan Inicial ($12)',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TABLE: categories (Categorías de Productos por Tienda)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. TABLE: products (Catálogo de Productos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  compare_at_price NUMERIC(10, 2) DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  image TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- In existing databases, run:
-- ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- ==============================================================================
-- 5. TABLE: orders (Pedidos de WhatsApp registrados en CRM)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'Pendiente', -- 'Pendiente' | 'En Preparación' | 'Entregado' | 'Cancelado'
  whatsapp_message TEXT DEFAULT '',
  delivery_type TEXT DEFAULT 'delivery',
  customer_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. TABLE: platform_payments (Registro de Cobros de Membresías en SuperAdmin)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.platform_payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  business_id TEXT REFERENCES public.businesses(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  business_slug TEXT NOT NULL,
  plan TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  method TEXT NOT NULL,
  reference TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'completado',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. INDEXES (Para búsquedas ultrarrápidas en móvil < 50ms)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_email ON public.businesses(owner_email);
CREATE INDEX IF NOT EXISTS idx_orders_business ON public.orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_business_created ON public.orders(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_business ON public.categories(business_id);
CREATE INDEX IF NOT EXISTS idx_products_business ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_business_available ON public.products(business_id, available);
CREATE INDEX IF NOT EXISTS idx_platform_payments_created ON public.platform_payments(created_at DESC);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_payments ENABLE ROW LEVEL SECURITY;

-- 8.1 Public Storefront Read Access (Cualquier cliente puede ver la tienda y catálogo activo)
CREATE POLICY "Public Read Active Businesses" ON public.businesses
  FOR SELECT USING (active = true);

CREATE POLICY "Public Read Categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public Read Available Products" ON public.products
  FOR SELECT USING (true);

-- 8.2 Public Client Order Creation (Clientes crean pedido al confirmar por WhatsApp)
CREATE POLICY "Public Create Orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- 8.3 Store Owner Isolation (Dueño solo administra lo suyo)
CREATE POLICY "Owner Manage Business" ON public.businesses
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Owner Manage Categories" ON public.categories
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Owner Manage Products" ON public.products
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Owner Manage Orders" ON public.orders
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

-- 8.4 Service Role / Admin Bypass (SuperAdmin y Next.js API Routes con Service Role)
-- Las peticiones desde Next.js API usando la Service Key tienen acceso irrestricto

-- ==============================================================================
-- 9. STORAGE BUCKET: store-assets (Para fotos de productos, logos y banners)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-assets', 'store-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Política de lectura pública de imágenes
CREATE POLICY "Public Access store-assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'store-assets');

-- Política de subida de imágenes para usuarios autenticados
CREATE POLICY "Authenticated Upload store-assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'store-assets' AND auth.role() = 'authenticated'
  );

-- ==============================================================================
-- 10. SEED DATA INICIAL (Panadería La Estrella y Burger Station)
-- ==============================================================================
INSERT INTO public.businesses (
  id, slug, name, category, city, "desc", banner_image, logo_image, theme_color, phone, currency, currency_symbol, payment_notes, links, page_views, active, plan
) VALUES (
  'biz_estrella_1',
  'panaderia-la-estrella',
  'Panadería La Estrella',
  'PANADERÍA ARTESANAL',
  'Maracaibo, Zulia',
  'Pan recién horneado cada día en el corazón de Maracaibo. Tradición, masa madre y el auténtico sabor que acompaña tus mañanas.',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
  '#00594C',
  '584146001234',
  'USD',
  '$',
  'Datos de pago:\n• Pago Móvil: Banesco (0134) | V-19.823.111 | 0414-6001234\n• Zelle: pagos@laestrella.com\n• Efectivo en divisas al retirar',
  '[{"id":"l1","type":"instagram","label":"Instagram @laestrellamcb","url":"https://instagram.com","active":true},{"id":"l2","type":"maps","label":"Ver en Google Maps","url":"https://maps.google.com","active":true},{"id":"l3","type":"phone","label":"Llamar al local","url":"tel:+584146001234","active":true}]'::jsonb,
  1420,
  true,
  'Plan Inicial ($12)'
), (
  'biz_burger_2',
  'burger-station',
  'Burger Station 🍔',
  'SMASH BURGERS',
  'Caracas, Las Mercedes',
  'Smash burgers crujientes con queso cheddar fundido y papas sazonadas. Sabor callejero en su máxima expresión.',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
  '#DC2626',
  '584121234567',
  'USD',
  '$',
  '• Pago Móvil: Mercantil (0105) | J-40891234 | 0412-1234567\n• Zelle: info@burgerstation.com\n• Binance USDT: Pay ID 89231823',
  '[{"id":"l1","type":"instagram","label":"@burgerstation.ccs","url":"https://instagram.com","active":true},{"id":"l2","type":"tiktok","label":"TikTok @burgerstation","url":"https://tiktok.com","active":true},{"id":"l3","type":"maps","label":"Local Las Mercedes","url":"https://maps.google.com","active":true}]'::jsonb,
  2850,
  true,
  'Big Taply ($34)'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Categorías Panadería
INSERT INTO public.categories (id, business_id, name, order_index) VALUES
  ('cat_panaderia', 'biz_estrella_1', 'Panadería', 1),
  ('cat_pasteleria', 'biz_estrella_1', 'Pastelería', 2),
  ('cat_bebidas', 'biz_estrella_1', 'Bebidas', 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Productos Panadería
INSERT INTO public.products (id, business_id, name, category, price, compare_at_price, available, featured, image, description) VALUES
  ('p_jamon', 'biz_estrella_1', 'Pan de Jamón Navideño', 'Panadería', 30.00, 35.00, true, true, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80', 'El clásico venezolano preparado con jamón ahumado premium, tocineta crujiente, pasas jugosas y aceitunas rellenas.'),
  ('p_golfeado', 'biz_estrella_1', 'Golfeado Meloso con Queso de Mano', 'Panadería', 3.50, 4.00, true, true, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', 'Horneado lentamente con papelón aromático, toque suave de anís dulce y coronado con abundante queso de mano fresco.'),
  ('p_cachito', 'biz_estrella_1', 'Cachito de Jamón Artesanal', 'Panadería', 2.00, 0, true, false, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', 'Masa suave y dorada rellena con jamón seleccionado finamente picado.'),
  ('p_quesadilla', 'biz_estrella_1', 'Quesadilla Tradicional Zuliana', 'Pastelería', 2.50, 0, true, false, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', 'Masa dulce rellena con auténtico queso blanco rallado criollo y especias tradicionales.'),
  ('p_marquesa', 'biz_estrella_1', 'Marquesa de Chocolate 70%', 'Pastelería', 4.50, 5.00, true, true, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80', 'Capas intercaladas de galletas María crujientes y pudín cremoso de cacao puro venezolano.')
ON CONFLICT (id) DO NOTHING;

-- Seed Pagos Iniciales en SuperAdmin
INSERT INTO public.platform_payments (id, business_id, business_name, business_slug, plan, amount, currency, method, reference, notes, status) VALUES
  ('pay_1', 'biz_estrella_1', 'Panadería La Estrella', 'panaderia-la-estrella', 'Plan Inicial ($12)', 12.00, 'USD', 'Pago Móvil', 'PM-8921-391', 'Membresía mes en curso', 'completado'),
  ('pay_2', 'biz_burger_2', 'Burger Station 🍔', 'burger-station', 'Big Taply ($34)', 34.00, 'USD', 'Binance USDT', 'TXID-992381283', 'Membresía mensual catálogo grande', 'completado')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 9. EXTENSIÓN: COLUMNA DE STOCK Y RPC ATÓMICO DE PAGO Y DESCUENTO DE STOCK
-- ==============================================================================
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 100;

CREATE OR REPLACE FUNCTION public.confirm_order_and_deduct_stock(
  p_business_id TEXT,
  p_order_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_item JSONB;
  v_prod_id TEXT;
  v_qty INTEGER;
BEGIN
  -- 1. Buscar y bloquear orden pendiente
  SELECT * INTO v_order FROM public.orders
  WHERE id = p_order_id AND business_id = p_business_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada');
  END IF;

  -- 2. Actualizar estado a 'pagado'
  UPDATE public.orders
  SET status = 'pagado'
  WHERE id = p_order_id AND business_id = p_business_id;

  -- 3. Descontar atómicamente el stock de cada producto en el pedido
  IF v_order.items IS NOT NULL THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_order.items)
    LOOP
      v_prod_id := v_item->>'productId';
      IF v_prod_id IS NULL THEN
        v_prod_id := v_item->>'id';
      END IF;
      v_qty := COALESCE((v_item->>'quantity')::integer, 1);

      IF v_prod_id IS NOT NULL THEN
        UPDATE public.products
        SET stock = GREATEST(0, COALESCE(stock, 100) - v_qty),
            available = CASE WHEN GREATEST(0, COALESCE(stock, 100) - v_qty) = 0 THEN FALSE ELSE available END,
            updated_at = NOW()
        WHERE id = v_prod_id AND business_id = p_business_id;
      END IF;
    END LOOP;
  END IF;

  RETURN jsonb_build_object('success', true, 'status', 'pagado');
END;
$$;

-- Habilitar replicación de Realtime sobre orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
