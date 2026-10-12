import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBusinessBySlug, getProductsByBusinessId, getCategoriesByBusinessId, recordPageView } from '@/lib/db';
import StorefrontView from '@/components/storefront/StorefrontView';
import DeactivatedStoreView from '@/components/storefront/DeactivatedStoreView';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const business = await getBusinessBySlug(params.slug);
  if (!business) {
    return {
      title: 'Negocio no encontrado · Taply',
    };
  }

  const title = `${business.name} · Catálogo Digital`;
  const description = business.desc || `Catálogo interactivo de ${business.name}. Haz tu pedido directo por WhatsApp con Taply.`;
  const banner = business.bannerImage || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80';
  const canonicalUrl = `/${params.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Taply',
      type: 'website',
      locale: 'es_LA',
      images: [
        {
          url: banner,
          width: 1200,
          height: 630,
          alt: business.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [banner],
    },
  };
}

export default async function StorePage({ params }: PageProps) {
  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    notFound();
  }

  // Increment page view count in backend
  await recordPageView(business.id);

  // If business was deactivated by SuperAdmin or owner, show elegant discreet message
  if (business.active === false) {
    return <DeactivatedStoreView business={business} />;
  }

  const [products, categories] = await Promise.all([
    getProductsByBusinessId(business.id),
    getCategoriesByBusinessId(business.id),
  ]);

  return (
    <StorefrontView
      business={business}
      products={products}
      categories={categories}
    />
  );
}

