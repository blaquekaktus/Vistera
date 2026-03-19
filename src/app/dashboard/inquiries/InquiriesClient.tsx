'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { Mountain, ArrowLeft, MessageSquare, CheckCircle, AlertCircle, Mail, Phone } from 'lucide-react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { replyToInquiry } from '@/lib/actions/property';
import type { FullInquiry } from './page';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-brand-50 text-brand-700',
  read: 'bg-slate-100 text-slate-600',
  responded: 'bg-green-50 text-green-700',
  closed: 'bg-slate-100 text-slate-400',
};

const TYPE_COLORS: Record<string, string> = {
  inquiry: 'bg-blue-50 text-blue-700',
  viewing: 'bg-gold-50 text-gold-700',
  vr_tour: 'bg-purple-50 text-purple-700',
};

function ReplyForm({ inquiryId, replied }: { inquiryId: string; replied: boolean }) {
  const { language } = useLanguage();
  const [state, formAction] = useFormState(replyToInquiry, {});

  if (replied && !state.success) {
    return (
      <p className="text-xs text-green-600 font-medium mt-3">
        {language === 'de' ? '✓ Bereits beantwortet' : '✓ Already replied'}
      </p>
    );
  }

  if (state.success) {
    return (
      <div className="flex items-center gap-2 mt-3 text-green-600 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        {language === 'de' ? 'Antwort gesendet.' : 'Reply sent.'}
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-3">
      <input type="hidden" name="inquiry_id" value={inquiryId} />
      {state.error && (
        <div className="flex items-center gap-1.5 text-red-600 text-xs mb-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {state.error}
        </div>
      )}
      <textarea
        name="reply_message"
        rows={3}
        required
        placeholder={language === 'de' ? 'Ihre Antwort...' : 'Your reply...'}
        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all resize-none"
      />
      <SubmitButton
        className="mt-2 bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60"
        pendingText={language === 'de' ? 'Wird gesendet...' : 'Sending...'}
      >
        {language === 'de' ? 'Antworten' : 'Send Reply'}
      </SubmitButton>
    </form>
  );
}

interface Props {
  inquiries: FullInquiry[];
}

export default function InquiriesClient({ inquiries }: Props) {
  const { language } = useLanguage();

  const newCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 text-white z-40 hidden lg:flex flex-col">
        <Link href="/" className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg">Vistera</span>
        </Link>
        <div className="p-4 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'de' ? 'Zum Dashboard' : 'Back to Dashboard'}
          </Link>
        </div>
      </aside>

      <main className="lg:ml-64 p-6 max-w-4xl">
        <div className="lg:hidden mb-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {language === 'de' ? 'Anfragen' : 'Inquiries'}
            </h1>
            <p className="text-sm text-slate-500">
              {newCount > 0
                ? (language === 'de' ? `${newCount} neue Anfrage(n)` : `${newCount} new inquiry(s)`)
                : (language === 'de' ? 'Alle Anfragen beantwortet' : 'All caught up')}
            </p>
          </div>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {language === 'de' ? 'Noch keine Anfragen.' : 'No inquiries yet.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-brand-600">
                      {inquiry.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-sm">{inquiry.name}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[inquiry.type] ?? 'bg-slate-100 text-slate-600'}`}>
                        {inquiry.type === 'vr_tour' ? 'VR Tour' : inquiry.type === 'viewing' ? (language === 'de' ? 'Besichtigung' : 'Viewing') : (language === 'de' ? 'Anfrage' : 'Inquiry')}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[inquiry.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {inquiry.status === 'new' ? (language === 'de' ? 'Neu' : 'New')
                          : inquiry.status === 'read' ? (language === 'de' ? 'Gelesen' : 'Read')
                          : inquiry.status === 'responded' ? (language === 'de' ? 'Beantwortet' : 'Responded')
                          : (language === 'de' ? 'Geschlossen' : 'Closed')}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto">
                        {new Date(inquiry.createdAt).toLocaleDateString(language === 'de' ? 'de-AT' : 'en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Property */}
                    {inquiry.propertyTitle && (
                      <Link
                        href={`/properties/${inquiry.propertyId}`}
                        className="text-xs text-brand-600 hover:underline mb-2 block"
                      >
                        {inquiry.propertyTitle}
                      </Link>
                    )}

                    {/* Contact info */}
                    <div className="flex flex-wrap gap-3 mb-3">
                      <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700">
                        <Mail className="w-3.5 h-3.5" />
                        {inquiry.email}
                      </a>
                      {inquiry.phone && (
                        <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700">
                          <Phone className="w-3.5 h-3.5" />
                          {inquiry.phone}
                        </a>
                      )}
                    </div>

                    {/* Message */}
                    {inquiry.message && (
                      <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 leading-relaxed mb-2">
                        &ldquo;{inquiry.message}&rdquo;
                      </p>
                    )}

                    {/* Previous reply */}
                    {inquiry.reply_message && (
                      <div className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wide block mb-1 text-green-600">
                          {language === 'de' ? 'Ihre Antwort' : 'Your reply'}
                        </span>
                        {inquiry.reply_message}
                      </div>
                    )}

                    {/* Reply form */}
                    <ReplyForm inquiryId={inquiry.id} replied={inquiry.status === 'responded' || inquiry.status === 'closed'} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
