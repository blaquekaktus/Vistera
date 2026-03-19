import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NewListingForm from './NewListingForm';

export default async function NewListingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirectTo=/dashboard/new-listing');

  return <NewListingForm />;
}
