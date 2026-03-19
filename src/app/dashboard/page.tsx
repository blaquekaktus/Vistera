import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';
import type { DashboardProperty, DashboardInquiry } from './DashboardClient';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch agent profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('*, agent_profiles(*)')
    .eq('id', user.id)
    .single() as { data: Record<string, any> | null };

  // Fetch agent's properties (with vr_tour count)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dbProperties } = await (supabase as any)
    .from('properties')
    .select('id, title, title_de, images, city, country, price, currency, vr_views, vr_tours(id)')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10) as { data: Record<string, any>[] | null };

  // Fetch recent inquiries (with property title)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dbInquiries } = await (supabase as any)
    .from('inquiries')
    .select('id, name, email, type, created_at, property:properties!property_id(title, title_de)')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(4) as { data: Record<string, any>[] | null };

  // Map DB rows to typed client props (shared regardless of whether profile row exists)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agentProperties: DashboardProperty[] = (dbProperties ?? []).map((p: Record<string, any>) => ({
    id: p.id,
    title: p.title,
    titleDe: p.title_de ?? p.title,
    images: p.images ?? [],
    city: p.city,
    country: p.country as 'AT' | 'DE' | 'CH',
    price: Number(p.price),
    currency: p.currency as 'EUR' | 'CHF',
    vrViews: p.vr_views ?? 0,
    hasVrTour: (p.vr_tours?.length ?? 0) > 0,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentInquiries: DashboardInquiry[] = (dbInquiries ?? []).map((inq: Record<string, any>) => {
    const prop = inq.property;
    return {
      id: inq.id,
      name: inq.name,
      email: inq.email,
      propertyTitle: prop?.title_de ?? prop?.title ?? '',
      type: inq.type,
      createdAt: inq.created_at,
    };
  });

  // Profile-specific identity fields
  const ap = profile?.agent_profiles as { agency?: string; rating?: number; review_count?: number } | null;
  const agentName: string    = profile?.name ?? user.user_metadata?.name ?? user.email ?? '';
  const agentAgency: string  = ap?.agency ?? '';
  const agentAvatar: string  = profile?.avatar_url ?? '';
  const agentRating: number  = Number(ap?.rating ?? 0);
  const agentReviewCount: number = ap?.review_count ?? 0;

  return (
    <DashboardClient
      agentName={agentName}
      agentAgency={agentAgency}
      agentAvatar={agentAvatar}
      agentRating={agentRating}
      agentReviewCount={agentReviewCount}
      agentProperties={agentProperties}
      recentInquiries={recentInquiries}
    />
  );
}
