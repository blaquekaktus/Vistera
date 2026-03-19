import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { agents, properties } from '@/lib/data';
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
    // Fall back to mock data (app works without Supabase credentials during development)
    const mockAgent = agents[0];
    const mockProperties = properties.filter((p) => p.agent.id === mockAgent.id);

    agentName = mockAgent.name;
    agentAgency = mockAgent.agency;
    agentAvatar = mockAgent.avatar;
    agentRating = mockAgent.rating;
    agentReviewCount = mockAgent.reviewCount;

    agentProperties = mockProperties.map((p) => ({
      id: p.id,
      title: p.title,
      titleDe: p.titleDe,
      images: p.images,
      city: p.address.city,
      country: p.address.country,
      price: p.price,
      currency: p.currency,
      vrViews: p.vrViews,
      hasVrTour: p.vrTours.length > 0,
    }));

    recentInquiries = [
      { id: 'inq-1', name: 'Alexander Schmidt', email: 'a.schmidt@gmail.com', propertyTitle: agentProperties[0]?.titleDe ?? '', type: 'VR-Tour', createdAt: new Date(Date.now() - 15 * 60_000).toISOString() },
      { id: 'inq-2', name: 'Julia Wagner', email: 'j.wagner@outlook.com', propertyTitle: agentProperties[1]?.titleDe ?? '', type: 'Besichtigung', createdAt: new Date(Date.now() - 60 * 60_000).toISOString() },
      { id: 'inq-3', name: 'Michael Bauer', email: 'm.bauer@web.de', propertyTitle: agentProperties[0]?.titleDe ?? '', type: 'Anfrage', createdAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString() },
      { id: 'inq-4', name: 'Sandra Kraus', email: 's.kraus@icloud.com', propertyTitle: agentProperties[1]?.titleDe ?? '', type: 'VR-Tour', createdAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString() },
    ];
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
