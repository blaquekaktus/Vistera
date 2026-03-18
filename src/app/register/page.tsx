'use client';

import Link from 'next/link';
import { Mountain, Eye, EyeOff, User, Briefcase, Home } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type Role = 'buyer' | 'seller' | 'agent';

export default function RegisterPage() {
  const { language, t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('buyer');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth logic would go here
  };

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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.auth.register.name}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={language === 'de' ? 'Max Mustermann' : 'John Doe'}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.auth.register.email}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                required
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={8}
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
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
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

            <button
              type="submit"
              className="w-full bg-brand-600 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
            >
              {t.auth.register.button}
            </button>
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
