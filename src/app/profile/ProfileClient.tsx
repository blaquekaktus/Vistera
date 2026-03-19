'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { SubmitButton } from '@/components/ui/SubmitButton';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { updateProfile, updateAgentProfile, logout } from '@/lib/actions/auth';
import { User, Mail, Phone, Briefcase, Star, AlertCircle, CheckCircle2, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  userId: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  avatarUrl: string;
  agency: string;
  bio: string;
  region: string;
  languages: string;
  agentRating: number;
  agentReviewCount: number;
}

const initialState = { error: undefined, success: false };

const roleLabel: Record<string, { de: string; en: string }> = {
  buyer: { de: 'Käufer/Mieter', en: 'Buyer/Renter' },
  seller: { de: 'Verkäufer', en: 'Seller' },
  agent: { de: 'Makler', en: 'Agent' },
  admin: { de: 'Administrator', en: 'Administrator' },
};

export default function ProfileClient({
  userId, email, name, phone, role, avatarUrl, agency, bio, region, languages, agentRating, agentReviewCount,
}: Props) {
  const { language } = useLanguage();
  const [state, formAction] = useFormState(updateProfile, initialState);
  const [agentState, agentFormAction] = useFormState(updateAgentProfile, initialState);
  const [currentAvatar, setCurrentAvatar] = useState<string[]>(avatarUrl ? [avatarUrl] : []);

  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const roleLabelText = roleLabel[role]?.[language] ?? role;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Back to dashboard */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 mb-6 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            {language === 'de' ? 'Zurück zum Dashboard' : 'Back to Dashboard'}
          </Link>

          <h1 className="text-2xl font-black text-slate-900 mb-6">
            {language === 'de' ? 'Mein Profil' : 'My Profile'}
          </h1>

          {/* Avatar + identity card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0">
                {currentAvatar.length === 0 && (
                  <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-white text-xl font-bold mb-2">
                    {initials || <User className="w-7 h-7" />}
                  </div>
                )}
                <ImageUpload
                  bucket="avatars"
                  folder={userId}
                  value={currentAvatar}
                  onChange={setCurrentAvatar}
                  maxFiles={1}
                  accept="image/jpeg,image/png,image/webp"
                  label={language === 'de' ? 'Profilbild' : 'Profile photo'}
                />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-lg">{name || email}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                    role === 'agent' ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-600'
                  )}>
                    {roleLabelText}
                  </span>
                  {role === 'agent' && agency && (
                    <span className="text-xs text-slate-500">{agency}</span>
                  )}
                </div>
                {role === 'agent' && agentRating > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3.5 h-3.5 text-gold-400 fill-current" />
                    <span className="text-sm font-semibold text-slate-700">{agentRating}</span>
                    <span className="text-xs text-slate-400">({agentReviewCount})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
            <h2 className="font-bold text-slate-900 mb-5">
              {language === 'de' ? 'Persönliche Daten' : 'Personal Information'}
            </h2>

            {state.success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {language === 'de' ? 'Profil gespeichert.' : 'Profile saved.'}
              </div>
            )}
            {state.error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {state.error}
              </div>
            )}

            <form action={formAction} className="flex flex-col gap-4">
              <input type="hidden" name="avatar_url" value={currentAvatar[0] ?? ''} />
              {/* Email (read-only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  <Mail className="w-3.5 h-3.5 inline mr-1" />
                  {language === 'de' ? 'E-Mail-Adresse' : 'Email address'}
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  {language === 'de' ? 'Vollständiger Name' : 'Full name'} *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={name}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  <Phone className="w-3.5 h-3.5 inline mr-1" />
                  {language === 'de' ? 'Telefonnummer' : 'Phone number'}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={phone}
                  placeholder="+43 ..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                />
              </div>

              <SubmitButton
                className="w-full bg-brand-600 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                pendingText={language === 'de' ? 'Wird gespeichert...' : 'Saving...'}
              >
                {language === 'de' ? 'Änderungen speichern' : 'Save changes'}
              </SubmitButton>
            </form>
          </div>

          {role === 'agent' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
              <h2 className="font-bold text-slate-900 mb-5">
                {language === 'de' ? 'Makler-Profil' : 'Agent Profile'}
              </h2>

              {agentState.success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  {language === 'de' ? 'Profil gespeichert.' : 'Profile saved.'}
                </div>
              )}
              {agentState.error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {agentState.error}
                </div>
              )}

              <form action={agentFormAction} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="agency" className="block text-xs font-semibold text-slate-600 mb-1.5">
                    <Briefcase className="w-3.5 h-3.5 inline mr-1" />
                    {language === 'de' ? 'Büroname *' : 'Agency name *'}
                  </label>
                  <input
                    id="agency"
                    name="agency"
                    type="text"
                    defaultValue={agency}
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                  />
                </div>

                <div>
                  <label htmlFor="region" className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {language === 'de' ? 'Region / Bundesland' : 'Region / State'}
                  </label>
                  <input
                    id="region"
                    name="region"
                    type="text"
                    defaultValue={region}
                    placeholder={language === 'de' ? 'z.B. Tirol' : 'e.g. Tyrol'}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {language === 'de' ? 'Kurzbiografie' : 'Short bio'}
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    defaultValue={bio}
                    placeholder={language === 'de' ? 'Kurze Vorstellung...' : 'Brief introduction...'}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="languages" className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {language === 'de' ? 'Sprachen (kommagetrennt)' : 'Languages (comma-separated)'}
                  </label>
                  <input
                    id="languages"
                    name="languages"
                    type="text"
                    defaultValue={languages}
                    placeholder="Deutsch, English, Français"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                  />
                </div>

                <SubmitButton
                  className="w-full bg-brand-600 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  pendingText={language === 'de' ? 'Wird gespeichert...' : 'Saving...'}
                >
                  {language === 'de' ? 'Makler-Profil speichern' : 'Save Agent Profile'}
                </SubmitButton>
              </form>
            </div>
          )}

          {/* Sign out */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-3">
              {language === 'de' ? 'Konto' : 'Account'}
            </h2>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {language === 'de' ? 'Abmelden' : 'Sign out'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
