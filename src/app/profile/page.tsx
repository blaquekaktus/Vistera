import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('*, agent_profiles(*)')
    .eq('id', user.id)
    .single() as { data: Record<string, any> | null };

  const ap = profile?.agent_profiles as Record<string, any> | null;

  return (
    <ProfileClient
      email={user.email ?? ''}
      name={profile?.name ?? ''}
      phone={profile?.phone ?? ''}
      role={profile?.role ?? 'buyer'}
      avatarUrl={profile?.avatar_url ?? ''}
      agency={ap?.agency ?? ''}
      bio={ap?.bio ?? ''}
      region={ap?.region ?? ''}
      languages={(ap?.languages ?? []).join(', ')}
      agentRating={Number(ap?.rating ?? 0)}
      agentReviewCount={ap?.review_count ?? 0}
    />
  );
}
