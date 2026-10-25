export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDispatchOrders } from '@/lib/db';
import DispatchSubpanelView from '@/components/dispatch/DispatchSubpanelView';

interface PageProps {
  params: {
    businessId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getDispatchOrders(params.businessId);
  if (!result) {
    return {
      title: 'Despacho no encontrado · Taply',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Despacho y Cocina · ${result.business.name}`,
    description: `Subpanel de despacho para cocina y repartidores de ${result.business.name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function DispatchPage({ params }: PageProps) {
  const result = await getDispatchOrders(params.businessId);

  if (!result) {
    notFound();
  }

  return (
    <DispatchSubpanelView
      business={result.business}
      initialOrders={result.orders}
    />
  );
}
