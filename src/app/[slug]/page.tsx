import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBusinessBySlug, getProductsByBusinessId, getCategoriesByBusinessId, recordPageView } from '@/lib/data';
import StorefrontView from '@/components/storefront/StorefrontView';

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

  return {
    title: `${business.name} · Catálogo Taply`,
    description: business.desc || `Pide directo a ${business.name} vía WhatsApp con Taply.`,
    openGraph: {
      title: `${business.name} · Catálogo Digital`,
      description: business.desc,
      images: [business.bannerImage || ''],
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
