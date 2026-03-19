import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { properties as mockProperties } from '@/lib/data';
import { mapDbProperty, PROPERTY_SELECT } from '@/lib/db-utils';
import VRTourClient from './VRTourClient';
import type { Property } from '@/lib/types';

interface Props {
  params: { id: string };
  searchParams: { room?: string };
}

export default async function VRTourPage({ params, searchParams }: Props) {
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
    property = mockProperties.find((p) => p.id === params.id);
  }

  if (!property || property.vrTours.length === 0) return notFound();

  return <VRTourClient property={property} initialRoomId={searchParams.room} />;
}
