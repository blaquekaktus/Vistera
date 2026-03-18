import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { properties as mockProperties } from '@/lib/data';
import { mapDbProperty, PROPERTY_SELECT } from '@/lib/db-utils';
import PropertyDetailClient from './PropertyDetailClient';
import type { Property } from '@/lib/types';

interface Props {
  params: { id: string };
}

export default async function PropertyDetailPage({ params }: Props) {
  let property: Property | undefined;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('id', params.id)
    .single();

  if (!error && data) {
    property = mapDbProperty(data);
  } else {
    // Fall back to mock data (works without Supabase credentials during development)
    property = mockProperties.find((p) => p.id === params.id);
  }

  if (!property) return notFound();

  return <PropertyDetailClient property={property} />;
}
