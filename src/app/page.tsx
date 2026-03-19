import { createClient } from '@/lib/supabase/server';
import { mapDbProperty, PROPERTY_SELECT } from '@/lib/db-utils';
import { properties as mockProperties } from '@/lib/data';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows } = await (supabase as any)
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3) as { data: Record<string, unknown>[] | null };

  const featuredProperties = rows && rows.length > 0
    ? rows.map(mapDbProperty)
    : mockProperties.filter((p) => p.featured).slice(0, 3);

  return <HomeClient featuredProperties={featuredProperties} />;
}
