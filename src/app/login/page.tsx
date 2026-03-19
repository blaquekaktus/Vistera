'use client';

import Link from 'next/link';
import { Mountain, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { login } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/client';
import { SubmitButton } from '@/components/ui/SubmitButton';

const initialState = { error: undefined, success: false };

export default function LoginPage() {
  const { language, t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useFormState(login, initialState);

  const handleOAuth = async (provider: 'google' | 'apple') => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-alpine-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-brand-600 rounded-xl shadow-lg">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white">Vistera</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-slate-900 mb-1">{t.auth.login.title}</h1>
          <p className="text-sm text-slate-500 mb-6">{t.auth.login.subtitle}</p>

          {/* Error */}
          {state.error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {state.error}
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.auth.login.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-slate-600">
                  {t.auth.login.password}
                </label>
                <Link href="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700">
                  {t.auth.login.forgot}
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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

            <SubmitButton
              className="w-full bg-brand-600 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-700 transition-colors mt-1 shadow-lg shadow-brand-200 disabled:opacity-60 disabled:cursor-not-allowed"
              pendingText={language === 'de' ? 'Wird angemeldet...' : 'Signing in...'}
            >
              {t.auth.login.button}
            </SubmitButton>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">{t.auth.login.or}</span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-3">
            {['Google', 'Apple'].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => handleOAuth(provider.toLowerCase() as 'google' | 'apple')}
                className="w-full flex items-center justify-center gap-3 border border-slate-200 text-slate-700 font-medium py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors"
              >
                {provider === 'Google' ? (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-label="Google">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-label="Apple">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                  </svg>
                )}
                {language === 'de' ? `Mit ${provider} anmelden` : `Continue with ${provider}`}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t.auth.login.noAccount}{' '}
            <Link href="/register" className="text-brand-600 font-semibold hover:text-brand-700">
              {t.auth.login.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
