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

  const { data: properties } = await supabase
  .from('properties')
  .select('*', { count: 'exact' })
  .cache({ tags: ['properties-list'] }); // Label this data with a tag for caching
  
  
  return <HomeClient featuredProperties={featuredProperties} />;
}
