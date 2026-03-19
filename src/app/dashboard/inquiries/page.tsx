import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import InquiriesClient from './InquiriesClient';

export interface FullInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  type: string;
  status: string;
  reply_message: string | null;
  createdAt: string;
  propertyId: string;
  propertyTitle: string;
}

export default async function InquiriesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows } = await (supabase as any)
    .from('inquiries')
    .select('id, name, email, phone, message, type, status, reply_message, created_at, property:properties!property_id(id, title, title_de)')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false }) as { data: Record<string, any>[] | null };

  const inquiries: FullInquiry[] = (rows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? null,
    message: row.message ?? null,
    type: row.type,
    status: row.status,
    reply_message: row.reply_message ?? null,
    createdAt: row.created_at,
    propertyId: row.property?.id ?? '',
    propertyTitle: row.property?.title_de ?? row.property?.title ?? '',
  }));

  return <InquiriesClient inquiries={inquiries} />;
}
