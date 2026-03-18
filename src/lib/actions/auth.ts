'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface AuthState {
  error?: string;
  success?: boolean;
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = createClient();

  const email    = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Bitte alle Felder ausfüllen.' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'E-Mail oder Passwort falsch.' };
    }
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = createClient();

  const name            = formData.get('name') as string;
  const email           = formData.get('email') as string;
  const password        = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const role            = (formData.get('role') as string) || 'buyer';

  if (!name || !email || !password) {
    return { error: 'Bitte alle Felder ausfüllen.' };
  }

  if (password.length < 8) {
    return { error: 'Passwort muss mindestens 8 Zeichen lang sein.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwörter stimmen nicht überein.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Diese E-Mail-Adresse ist bereits registriert.' };
    }
    return { error: error.message };
  }

  return { success: true };
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, agent_profiles(*)')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function forgotPassword(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = createClient();
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'Bitte E-Mail-Adresse eingeben.' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback?next=/profile/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updateProfile(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Nicht angemeldet.' };
  }

  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;

  if (!name) {
    return { error: 'Name ist erforderlich.' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('profiles')
    .update({ name, phone: phone || null })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/profile');
  return { success: true };
}
