import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AnalyticsClient from './AnalyticsClient';

export const metadata = { title: 'Analytics' };

export default async function AnalyticsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: properties } = await (supabase as any)
    .from('properties')
    .select('id, title, title_de, city, views, vr_views')
    .eq('agent_id', user.id)
    .order('vr_views', { ascending: false }) as { data: Record<string, any>[] | null };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: inquiries } = await (supabase as any)
    .from('inquiries')
    .select('id, type, status, created_at')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: true }) as { data: Record<string, any>[] | null };

  const props = properties ?? [];
  const inqs = inquiries ?? [];

  // Aggregate totals
  const totalViews   = props.reduce((s, p) => s + (p.views ?? 0), 0);
  const totalVrViews = props.reduce((s, p) => s + (p.vr_views ?? 0), 0);

  // Inquiries by status
  const byStatus: Record<string, number> = { new: 0, read: 0, responded: 0, closed: 0 };
  const byType: Record<string, number>   = { inquiry: 0, viewing: 0, vr_tour: 0 };
  for (const inq of inqs) {
    if (inq.status in byStatus) byStatus[inq.status]++;
    if (inq.type   in byType)   byType[inq.type]++;
  }

  // 30-day inquiry timeline
  const now = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
  const dayMap: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]));
  for (const inq of inqs) {
    const day = (inq.created_at as string).slice(0, 10);
    if (day in dayMap) dayMap[day]++;
  }
  const timeline = days.map((d) => ({ day: d, count: dayMap[d] }));

  return (
    <AnalyticsClient
      properties={props.map((p) => ({
        id: p.id,
        title: p.title,
        titleDe: p.title_de ?? p.title,
        city: p.city,
        views: p.views ?? 0,
        vrViews: p.vr_views ?? 0,
      }))}
      totalViews={totalViews}
      totalVrViews={totalVrViews}
      totalInquiries={inqs.length}
      respondedCount={byStatus.responded + byStatus.closed}
      inquiriesByStatus={byStatus}
      inquiriesByType={byType}
      timeline={timeline}
    />
  );
}
