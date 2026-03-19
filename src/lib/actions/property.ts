'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  sendInquiryConfirmation,
  sendInquiryNotification,
  sendReplyNotification,
} from '@/lib/email';

// ── Reply to inquiry ────────────────────────────────────────────────────────

export interface ReplyState {
  error?: string;
  success?: boolean;
}

export async function replyToInquiry(prevState: ReplyState, formData: FormData): Promise<ReplyState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet.' };

  const inquiryId = formData.get('inquiry_id') as string;
  const message = formData.get('reply_message') as string;

  if (!inquiryId || !message?.trim()) {
    return { error: 'Antwort darf nicht leer sein.' };
  }

  // Fetch inquiry so we can email the sender and look up property title
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: inquiry } = await (supabase as any)
    .from('inquiries')
    .select('name, email, property:properties!property_id(title, title_de)')
    .eq('id', inquiryId)
    .eq('agent_id', user.id)
    .single() as { data: Record<string, any> | null };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: agentProfile } = await (supabase as any)
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single() as { data: { name: string } | null };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('inquiries')
    .update({ reply_message: message.trim(), status: 'responded' })
    .eq('id', inquiryId)
    .eq('agent_id', user.id);

  if (error) return { error: error.message };

  // Notify the inquiry sender (fire-and-forget)
  if (inquiry) {
    const propertyTitle = inquiry.property?.title_de ?? inquiry.property?.title ?? '';
    sendReplyNotification({
      to: inquiry.email,
      senderName: inquiry.name,
      agentName: agentProfile?.name ?? 'Ihr Makler',
      propertyTitle,
      replyMessage: message.trim(),
    });
  }

  revalidatePath('/dashboard/inquiries');
  return { success: true };
}

// ── Update inquiry status (used by appointments page) ───────────────────────

export async function updateInquiryStatus(prevState: ReplyState, formData: FormData): Promise<ReplyState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet.' };

  const inquiryId = formData.get('inquiry_id') as string;
  const status    = formData.get('status') as string;

  const VALID_STATUSES = ['new', 'read', 'responded', 'closed'];
  if (!inquiryId || !VALID_STATUSES.includes(status)) {
    return { error: 'Ungültige Anfrage.' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('inquiries')
    .update({ status })
    .eq('id', inquiryId)
    .eq('agent_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard/appointments');
  return { success: true };
}


export interface UpdateListingState {
  error?: string;
  success?: boolean;
}

export async function updateListing(prevState: UpdateListingState, formData: FormData): Promise<UpdateListingState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet.' };

  const id = formData.get('property_id') as string;
  if (!id) return { error: 'Inserat-ID fehlt.' };

  const titleDe = formData.get('title_de') as string;
  const title = (formData.get('title') as string) || titleDe;
  const city = formData.get('city') as string;
  const country = formData.get('country') as string;
  const type = formData.get('type') as string;
  const listingType = formData.get('listing_type') as string;
  const price = formData.get('price') as string;
  const area = formData.get('area') as string;

  if (!titleDe || !city || !country || !type || !listingType || !price || !area) {
    return { error: 'Bitte alle Pflichtfelder ausfüllen.' };
  }

  const imagesRaw = formData.get('images') as string;
  const images = imagesRaw ? imagesRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [];

  const amenitiesRaw = formData.get('amenities') as string;
  const amenities = amenitiesRaw ? amenitiesRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [];

  const getNum = (key: string) => {
    const v = formData.get(key) as string;
    return v ? Number(v) : null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('properties')
    .update({
      title,
      title_de: titleDe,
      description: (formData.get('description') as string) || null,
      description_de: (formData.get('description_de') as string) || null,
      type,
      listing_type: listingType,
      price: Number(price),
      currency: (formData.get('currency') as string) || 'EUR',
      street: (formData.get('street') as string) || null,
      city,
      region: (formData.get('region') as string) || null,
      country,
      postal_code: (formData.get('postal_code') as string) || null,
      area: Number(area),
      rooms: getNum('rooms'),
      bedrooms: getNum('bedrooms'),
      bathrooms: getNum('bathrooms'),
      year_built: getNum('year_built'),
      floor: getNum('floor'),
      total_floors: getNum('total_floors'),
      energy_class: (formData.get('energy_class') as string) || null,
      parking: formData.get('parking') === 'on',
      elevator: formData.get('elevator') === 'on',
      balcony: formData.get('balcony') === 'on',
      garden: formData.get('garden') === 'on',
      cellar: formData.get('cellar') === 'on',
      amenities,
      images,
      status: (formData.get('status') as string) || 'active',
    })
    .eq('id', id)
    .eq('agent_id', user.id); // enforce ownership

  if (error) return { error: error.message };

  revalidatePath('/properties');
  revalidatePath(`/properties/${id}`);
  revalidatePath('/dashboard');
  redirect(`/properties/${id}`);
}

// ── Delete listing ──────────────────────────────────────────────────────────

export async function deleteListing(formData: FormData): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const id = formData.get('property_id') as string;
  if (!id) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('properties')
    .delete()
    .eq('id', id)
    .eq('agent_id', user.id); // enforce ownership

  revalidatePath('/properties');
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export interface InquiryState {
  error?: string;
  success?: boolean;
}

export async function submitInquiry(prevState: InquiryState, formData: FormData): Promise<InquiryState> {
  const supabase = createClient();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  const propertyId = formData.get('propertyId') as string;
  const agentId = formData.get('agentId') as string;

  if (!name || !email || !message) {
    return { error: 'Bitte alle Felder ausfüllen.' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('inquiries').insert({
    property_id: propertyId,
    agent_id: agentId,
    name,
    email,
    message,
    type: 'inquiry',
  });

  if (error) {
    // Silently succeed only when Supabase is genuinely not configured (local dev without .env.local).
    // A missing URL means the client was constructed with an empty string which causes a fetch error.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL && error.message?.includes('fetch')) {
      return { success: true };
    }
    return { error: error.message };
  }

  // Fetch property title + agent email for notifications
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: property } = await (supabase as any)
    .from('properties')
    .select('title, title_de, agent:profiles!agent_id(name)')
    .eq('id', propertyId)
    .single() as { data: Record<string, any> | null };

  if (property) {
    const propertyTitle = property.title_de ?? property.title ?? '';
    // Confirm to sender
    sendInquiryConfirmation({ to: email, senderName: name, propertyTitle });
    // Notify agent (requires SUPABASE_SERVICE_ROLE_KEY to fetch auth email — skipped if not set)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && agentId) {
      const { createClient: createAdmin } = await import('@supabase/supabase-js');
      const admin = createAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      );
      const { data: agentUser } = await admin.auth.admin.getUserById(agentId);
      if (agentUser.user?.email) {
        sendInquiryNotification({
          to: agentUser.user.email,
          senderName: name,
          senderEmail: email,
          propertyTitle,
          message: message ?? '',
        });
      }
    }
  }

  return { success: true };
}

export interface ListingState {
  error?: string;
  success?: boolean;
}

export async function createListing(prevState: ListingState, formData: FormData): Promise<ListingState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Nicht angemeldet.' };
  }

  const titleDe = formData.get('title_de') as string;
  const title = (formData.get('title') as string) || titleDe;
  const city = formData.get('city') as string;
  const country = formData.get('country') as string;
  const type = formData.get('type') as string;
  const listingType = formData.get('listing_type') as string;
  const price = formData.get('price') as string;
  const area = formData.get('area') as string;

  if (!titleDe || !city || !country || !type || !listingType || !price || !area) {
    return { error: 'Bitte alle Pflichtfelder ausfüllen.' };
  }

  const imagesRaw = formData.get('images') as string;
  const images = imagesRaw ? imagesRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [];

  const amenitiesRaw = formData.get('amenities') as string;
  const amenities = amenitiesRaw ? amenitiesRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [];

  const getNum = (key: string) => {
    const v = formData.get(key) as string;
    return v ? Number(v) : null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('properties')
    .insert({
      agent_id: user.id,
      title,
      title_de: titleDe,
      description: (formData.get('description') as string) || null,
      description_de: (formData.get('description_de') as string) || null,
      type,
      listing_type: listingType,
      price: Number(price),
      currency: (formData.get('currency') as string) || 'EUR',
      price_per_sqm: getNum('price_per_sqm'),
      street: (formData.get('street') as string) || null,
      city,
      region: (formData.get('region') as string) || null,
      country,
      postal_code: (formData.get('postal_code') as string) || null,
      area: Number(area),
      rooms: getNum('rooms'),
      bedrooms: getNum('bedrooms'),
      bathrooms: getNum('bathrooms'),
      year_built: getNum('year_built'),
      floor: getNum('floor'),
      total_floors: getNum('total_floors'),
      energy_class: (formData.get('energy_class') as string) || null,
      parking: formData.get('parking') === 'on',
      elevator: formData.get('elevator') === 'on',
      balcony: formData.get('balcony') === 'on',
      garden: formData.get('garden') === 'on',
      cellar: formData.get('cellar') === 'on',
      amenities,
      images,
      status: 'active',
      featured: false,
    })
    .select('id')
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/properties');
  redirect(`/properties/${data.id}`);
}
