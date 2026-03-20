import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AppointmentsClient from './AppointmentsClient';

export const metadata = { title: 'Termine' };

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  createdAt: string;
  propertyId: string;
  propertyTitle: string;
}

export default async function AppointmentsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows } = await (supabase as any)
    .from('inquiries')
    .select('id, name, email, phone, message, status, created_at, property:properties!property_id(id, title, title_de)')
    .eq('agent_id', user.id)
    .eq('type', 'viewing')
    .order('created_at', { ascending: false }) as { data: Record<string, any>[] | null };

  const appointments: Appointment[] = (rows ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? null,
    message: r.message ?? null,
    status: r.status,
    createdAt: r.created_at,
    propertyId: r.property?.id ?? '',
    propertyTitle: r.property?.title_de ?? r.property?.title ?? '',
  }));

  return <AppointmentsClient appointments={appointments} />;
}
