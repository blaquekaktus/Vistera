'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface VrTourState {
  error?: string;
  success?: boolean;
}

// ── Add a panorama room to a property's VR tour ─────────────────────────────

export async function addVrTour(prevState: VrTourState, formData: FormData): Promise<VrTourState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet.' };

  const propertyId  = formData.get('property_id')  as string;
  const panoramaUrl = formData.get('panorama_url')  as string;
  const roomNameDe  = (formData.get('room_name_de') as string)?.trim();
  const roomName    = (formData.get('room_name')    as string)?.trim();

  if (!propertyId || !panoramaUrl) {
    return { error: 'Panorama-URL fehlt.' };
  }

  // Ownership check — agent must own the property
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: prop } = await (supabase as any)
    .from('properties')
    .select('id')
    .eq('id', propertyId)
    .eq('agent_id', user.id)
    .single() as { data: { id: string } | null };

  if (!prop) return { error: 'Zugriff verweigert.' };

  // Determine next sort_order
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('vr_tours')
    .select('sort_order')
    .eq('property_id', propertyId)
    .order('sort_order', { ascending: false })
    .limit(1) as { data: { sort_order: number }[] | null };

  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('vr_tours')
    .insert({
      property_id:   propertyId,
      panorama_url:  panoramaUrl,
      thumbnail_url: panoramaUrl, // reuse panorama as thumbnail
      room_name:     roomName    || roomNameDe || 'Room',
      room_name_de:  roomNameDe  || roomName   || 'Zimmer',
      sort_order:    nextOrder,
    });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/${propertyId}/edit`);
  revalidatePath(`/properties/${propertyId}`);
  revalidatePath(`/properties/${propertyId}/tour`);
  return { success: true };
}

// ── Delete a single VR tour room ─────────────────────────────────────────────

export async function deleteVrTour(prevState: VrTourState, formData: FormData): Promise<VrTourState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet.' };

  const tourId     = formData.get('tour_id')     as string;
  const propertyId = formData.get('property_id') as string;

  if (!tourId || !propertyId) return { error: 'Ungültige Anfrage.' };

  // Verify ownership via property
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: prop } = await (supabase as any)
    .from('properties')
    .select('id')
    .eq('id', propertyId)
    .eq('agent_id', user.id)
    .single() as { data: { id: string } | null };

  if (!prop) return { error: 'Zugriff verweigert.' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('vr_tours')
    .delete()
    .eq('id', tourId)
    .eq('property_id', propertyId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/${propertyId}/edit`);
  revalidatePath(`/properties/${propertyId}`);
  revalidatePath(`/properties/${propertyId}/tour`);
  return { success: true };
}
