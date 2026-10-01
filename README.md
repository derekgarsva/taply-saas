# Taply SaaS · Catálogos Multilink & Checkout Directo a WhatsApp

> **Taply** es una plataforma SaaS moderna diseñada para comercios, panaderías, restaurantes y emprendimientos que desean convertir su enlace en bio de Instagram o TikTok en una máquina de ventas directas a WhatsApp, con cero comisiones y una experiencia de usuario de 3 toques.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## ⚡ Características Principales

### 🛒 Tienda Pública / Catálogo Multilink (`/[slug]`)
- **Filosofía de 3 Toques**: El cliente abre el link, selecciona productos y desliza para confirmar. Sin formularios ni registros obligatorios.
- **Micro-interacciones Fluidas**:
  - **Seek**: Buscador expansivo en pill con animación de resorte.
  - **Hold-to-Sweep Stepper**: Toca para sumar/restar 1, o mantén presionado y desliza a través del riel para cambiar cantidades rápidamente (1 a 99).
  - **Notify Sold Out**: Botón de aviso de stock con oscilación amortiguada de campana.
  - **Slide-to-Confirm WhatsApp**: Botón táctil deslizable con efecto wash y vibración háptica que genera el pedido formateado y abre WhatsApp automáticamente.
  - **QR Code Modal**: Genera y descarga el código QR oficial de la tienda en alta resolución para colocar en mesas, vitrinas o empaques.
- **Multilink Integrado**: Botones de acceso directo a Instagram, TikTok, llamada telefónica y ubicación exacta en Google Maps.

### 📊 Panel de Control del Dueño (`/dashboard`)
- **Resumen y Métricas**: Monitoreo de ingresos estimados, pedidos WhatsApp recibidos, visitas al catálogo y tasa de conversión.
- **Gestión de Productos**: CRUD completo con foto en vivo, precio, precio de oferta, descripción y switch de 1 toque para marcar agotado/activo.
- **Gestión de Categorías**: Organiza las secciones horizontales de tu catálogo.
- **CRM de Pedidos WhatsApp**: Registro de cada orden generada mediante el Slide de WhatsApp con estados (`Nuevo`, `En Proceso`, `Completado`, `Cancelado`).
- **Marca y Cobros**: Configura tu logo, banner, paleta de colores personalizada, número de WhatsApp y notas de pago formateadas (Pago Móvil, Zelle, Transferencia, Efectivo).

### 🚀 Landing Page SaaS (`/`)
- Presentación de alto impacto visual con teléfono interactivo que muestra la tienda en vivo.
- Comparativa de planes (Free $0 / Pro $9).
- Acceso directo a tiendas de demostración (`/panaderia-la-estrella` y `/burger-station`).

---

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Lenguaje**: TypeScript
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Animaciones y Micro-delight**: `canvas-confetti`, custom CSS cubic-bezier springs
- **Códigos QR**: `qrcode` (SVG y Canvas DataURL)

---

## 💻 Ejecución Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/derekgarsva/taply-saas.git
   cd taply-saas
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ☁️ Despliegue en Vercel

Este proyecto está optimizado con configuración zero-config para Vercel:
1. Conecta el repositorio de GitHub en [Vercel](https://vercel.com).
2. Deja las opciones por defecto (`Framework Preset: Next.js`).
3. Haz clic en **Deploy**. ¡Listo en 1 minuto!

---

Desarrollado con ❤️ para empoderar a comercios y emprendedores en Latinoamérica.
