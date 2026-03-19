'use client';

import Link from 'next/link';
import { Mountain, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ResetPasswordPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (password.length < 8) {
      setError(language === 'de'
        ? 'Passwort muss mindestens 8 Zeichen lang sein.'
        : 'Password must be at least 8 characters.');
      return;
    }

    if (password !== confirm) {
      setError(language === 'de'
        ? 'Passwörter stimmen nicht überein.'
        : 'Passwords do not match.');
      return;
    }

    setIsPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsPending(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/dashboard'), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-alpine-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-brand-600 rounded-xl shadow-lg">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white">Vistera</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            {language === 'de' ? 'Neues Passwort' : 'New Password'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {language === 'de'
              ? 'Wählen Sie ein sicheres neues Passwort.'
              : 'Choose a strong new password.'}
          </p>

          {success ? (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-4 rounded-xl">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  {language === 'de' ? 'Passwort geändert!' : 'Password updated!'}
                </p>
                <p className="text-green-600 text-xs mt-0.5">
                  {language === 'de'
                    ? 'Sie werden weitergeleitet…'
                    : 'Redirecting you now…'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {language === 'de' ? 'Neues Passwort' : 'New password'}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {language === 'de' ? 'Passwort bestätigen' : 'Confirm password'}
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand-600 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {isPending
                  ? (language === 'de' ? 'Wird gespeichert…' : 'Saving…')
                  : (language === 'de' ? 'Passwort speichern' : 'Save password')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
