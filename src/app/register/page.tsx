'use client';

import Link from 'next/link';
import { Mountain, Eye, EyeOff, User, Briefcase, Home, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { register } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import { SubmitButton } from '@/components/ui/SubmitButton';

type Role = 'buyer' | 'seller' | 'agent';

const initialState = { error: undefined, success: false };

export default function RegisterPage() {
  const { language, t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('buyer');
  const [state, formAction] = useFormState(register, initialState);

  const roles: { value: Role; label: string; icon: React.ElementType; desc: { de: string; en: string } }[] = [
    {
      value: 'buyer',
      label: t.auth.register.roles.buyer,
      icon: Home,
      desc: { de: 'Kaufen oder mieten', en: 'Buy or rent' },
    },
    {
      value: 'seller',
      label: t.auth.register.roles.seller,
      icon: User,
      desc: { de: 'Verkaufen oder vermieten', en: 'Sell or rent out' },
    },
    {
      value: 'agent',
      label: t.auth.register.roles.agent,
      icon: Briefcase,
      desc: { de: 'Profi-Tools nutzen', en: 'Access pro tools' },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-alpine-950 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-brand-600 rounded-xl shadow-lg">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white">Vistera</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-slate-900 mb-1">{t.auth.register.title}</h1>
          <p className="text-sm text-slate-500 mb-6">{t.auth.register.subtitle}</p>

          {/* Success */}
          {state.success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {language === 'de'
                ? 'Konto erstellt! Bitte prüfen Sie Ihre E-Mails zur Bestätigung.'
                : 'Account created! Please check your email to confirm.'}
            </div>
          )}

          {/* Error */}
          {state.error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {state.error}
            </div>
          )}

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all',
                    selectedRole === role.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-100 text-slate-600 hover:border-slate-200'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{role.label}</span>
                  <span className={cn('text-xs', selectedRole === role.value ? 'text-brand-500' : 'text-slate-400')}>
                    {role.desc[language]}
                  </span>
                </button>
              );
            })}
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            {/* Hidden role input */}
            <input type="hidden" name="role" value={selectedRole} />

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.auth.register.name}
              </label>
              <input
                type="text"
                name="name"
                placeholder={language === 'de' ? 'Max Mustermann' : 'John Doe'}
                required
                autoComplete="name"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.auth.register.email}
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.auth.register.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
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
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.auth.register.confirmPassword}
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
              />
            </div>

            <p className="text-xs text-slate-500">
              {t.auth.register.terms}{' '}
              <Link href="/terms" className="text-brand-600 hover:underline">{t.auth.register.termsLink}</Link>{' '}
              {t.auth.register.and}{' '}
              <Link href="/privacy" className="text-brand-600 hover:underline">{t.auth.register.privacyLink}</Link>
              {t.auth.register.agree}
            </p>

            <SubmitButton
              className="w-full bg-brand-600 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 disabled:opacity-60 disabled:cursor-not-allowed"
              pendingText={language === 'de' ? 'Wird registriert...' : 'Creating account...'}
            >
              {t.auth.register.button}
            </SubmitButton>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t.auth.register.hasAccount}{' '}
            <Link href="/login" className="text-brand-600 font-semibold hover:text-brand-700">
              {t.auth.register.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
