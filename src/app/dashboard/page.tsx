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

  // Map DB rows to client props — fall back to mock data if Supabase not configured
  let agentName: string;
  let agentAgency: string;
  let agentAvatar: string;
  let agentRating: number;
  let agentReviewCount: number;
  let agentProperties: DashboardProperty[];
  let recentInquiries: DashboardInquiry[];

  if (profile) {
    const ap = profile.agent_profiles as { agency?: string; rating?: number; review_count?: number } | null;
    agentName = profile.name;
    agentAgency = ap?.agency ?? '';
    agentAvatar = profile.avatar_url ?? '';
    agentRating = Number(ap?.rating ?? 0);
    agentReviewCount = ap?.review_count ?? 0;

    agentProperties = (dbProperties ?? []).map((p) => ({
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

    recentInquiries = (dbInquiries ?? []).map((inq) => {
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
  } else {
    // Profile not yet available (trigger may not have fired yet for brand-new users)
    // Use the authenticated user's data so we never show another user's data
    agentName = user.user_metadata?.name ?? user.email ?? '';
    agentAgency = '';
    agentAvatar = '';
    agentRating = 0;
    agentReviewCount = 0;
    agentProperties = (dbProperties ?? []).map((p) => ({
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
    recentInquiries = (dbInquiries ?? []).map((inq) => {
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
  }

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
