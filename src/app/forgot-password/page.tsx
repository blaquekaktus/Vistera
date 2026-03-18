'use client';

import Link from 'next/link';
import { Mountain, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useActionState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { forgotPassword } from '@/lib/actions/auth';

const initialState = { error: undefined, success: false };

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const [state, formAction, isPending] = useActionState(forgotPassword, initialState);

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
          <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-brand-600" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-1">
            {language === 'de' ? 'Passwort zurücksetzen' : 'Reset Password'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {language === 'de'
              ? 'Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.'
              : "Enter your email address and we'll send you a reset link."}
          </p>

          {state.success ? (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-4 rounded-xl">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">
                  {language === 'de' ? 'E-Mail gesendet!' : 'Email sent!'}
                </p>
                <p className="text-green-600">
                  {language === 'de'
                    ? 'Bitte prüfen Sie Ihren Posteingang und klicken Sie den Link.'
                    : 'Please check your inbox and click the reset link.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {state.error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {state.error}
                </div>
              )}

              <form action={formAction} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {language === 'de' ? 'E-Mail-Adresse' : 'Email address'}
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

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-brand-600 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending
                    ? (language === 'de' ? 'Wird gesendet...' : 'Sending...')
                    : (language === 'de' ? 'Link senden' : 'Send reset link')}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            <Link href="/login" className="text-brand-600 font-semibold hover:text-brand-700">
              ← {language === 'de' ? 'Zurück zur Anmeldung' : 'Back to login'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
