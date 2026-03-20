import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EditListingClient from './EditListingClient';

interface Props {
  params: { id: string };
}

export default async function EditListingPage({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: property } = await (supabase as any)
    .from('properties')
    .select('*, vr_tours(id, panorama_url, thumbnail_url, room_name, room_name_de, sort_order)')
    .eq('id', params.id)
    .eq('agent_id', user.id) // ownership check
    .single() as { data: Record<string, unknown> | null };

  if (!property) notFound();

  return <EditListingClient property={property} userId={user.id} />;
}
