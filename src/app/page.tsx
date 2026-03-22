import { createClient } from '@/lib/supabase/server';
import { mapDbProperty, PROPERTY_SELECT } from '@/lib/db-utils';
import { properties as mockProperties } from '@/lib/data'; 
import HomeClient from './HomeClient';

// Use standard Next.js dynamic rendering instead of the broken .cache()
export const dynamic = 'force-dynamic'; 

export default async function HomePage() {
  const supabase = createClient();

  // 1. Fetch REAL properties from Supabase
  const { data: rows } = await (supabase as any)
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // 2. THE CONGRUENT LOGIC: 
  // If we have real data, use it. Otherwise, use your high-fidelity mocks.
  const realProperties = rows ? rows.map(mapDbProperty) : [];
  
  // Combine: Real data first, fill with mocks to keep the site "Full" for investors
  const featuredProperties = realProperties.length > 0 
    ? realProperties 
    : mockProperties.filter(p => p.featured).slice(0, 3);

  return <HomeClient featuredProperties={featuredProperties} />;
}