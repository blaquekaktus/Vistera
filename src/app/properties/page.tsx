import { createClient } from '@/lib/supabase/server';
import { properties as mockProperties } from '@/lib/data';
import { mapDbProperty, PROPERTY_SELECT } from '@/lib/db-utils';
import PropertiesClient from './PropertiesClient';
import type { Property } from '@/lib/types';

export default async function PropertiesPage() {
  let properties: Property[] = mockProperties;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (!error && data && data.length > 0) {
    properties = data.map(mapDbProperty);
  }

  return <PropertiesClient initialProperties={properties} />;
}
