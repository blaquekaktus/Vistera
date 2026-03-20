'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { Mountain, ArrowLeft, Calendar, Mail, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { updateInquiryStatus } from '@/lib/actions/property';
import type { Appointment } from './page';

const STATUS_CONFIG: Record<string, { de: string; en: string; cls: string }> = {
  new:       { de: 'Neu',          en: 'New',       cls: 'bg-brand-50 text-brand-700' },
  read:      { de: 'Gesehen',      en: 'Seen',      cls: 'bg-slate-100 text-slate-600' },
  responded: { de: 'Bestätigt',    en: 'Confirmed', cls: 'bg-green-50 text-green-700' },
  closed:    { de: 'Abgeschlossen', en: 'Closed',   cls: 'bg-slate-100 text-slate-400' },
};

function StatusForm({ appointmentId, current }: { appointmentId: string; current: string }) {
  const { language } = useLanguage();
  const [, formAction] = useFormState(updateInquiryStatus, {});

  // Actions available per current status
  const actions: { status: string; de: string; en: string; icon: React.ElementType; cls: string }[] = [];
  if (current === 'new' || current === 'read') {
    actions.push({ status: 'responded', de: 'Bestätigen', en: 'Confirm', icon: CheckCircle, cls: 'bg-green-600 hover:bg-green-700 text-white' });
  }
  if (current !== 'closed') {
    actions.push({ status: 'closed', de: 'Absagen', en: 'Cancel', icon: XCircle, cls: 'bg-slate-100 hover:bg-slate-200 text-slate-600' });
  }
  if (current === 'closed' || current === 'responded') {
    actions.push({ status: 'new', de: 'Wiedereröffnen', en: 'Reopen', icon: Clock, cls: 'bg-slate-100 hover:bg-slate-200 text-slate-600' });
  }

  if (actions.length === 0) return null;

  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {actions.map((action) => (
        <form key={action.status} action={formAction}>
          <input type="hidden" name="inquiry_id" value={appointmentId} />
          <input type="hidden" name="status" value={action.status} />
          <SubmitButton
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${action.cls}`}
            pendingText={language === 'de' ? 'Wird gespeichert…' : 'Saving…'}
          >
            <action.icon className="w-3.5 h-3.5" />
            {language === 'de' ? action.de : action.en}
          </SubmitButton>
        </form>
      ))}
    </div>
  );
}

interface Props {
  appointments: Appointment[];
}

export default function AppointmentsClient({ appointments }: Props) {
  const { language } = useLanguage();

  const pending = appointments.filter((a) => a.status === 'new' || a.status === 'read');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
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
        {/* Mobile back */}
        <div className="lg:hidden mb-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {language === 'de' ? 'Besichtigungen' : 'Viewing Requests'}
            </h1>
            <p className="text-sm text-slate-500">
              {pending.length > 0
                ? (language === 'de' ? `${pending.length} ausstehend` : `${pending.length} pending`)
                : (language === 'de' ? 'Keine ausstehenden Termine' : 'No pending viewings')}
            </p>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {language === 'de' ? 'Noch keine Besichtigungsanfragen.' : 'No viewing requests yet.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map((appt) => {
              const sc = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.new;
              return (
                <div key={appt.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-gold-700">
                        {appt.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + status + date */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 text-sm">{appt.name}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.cls}`}>
                          {language === 'de' ? sc.de : sc.en}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto">
                          {new Date(appt.createdAt).toLocaleDateString(
                            language === 'de' ? 'de-AT' : 'en-GB',
                            { day: 'numeric', month: 'short', year: 'numeric' }
                          )}
                        </span>
                      </div>

                      {/* Property */}
                      {appt.propertyTitle && (
                        <Link
                          href={`/properties/${appt.propertyId}`}
                          className="text-xs text-brand-600 hover:underline mb-2 block"
                        >
                          {appt.propertyTitle}
                        </Link>
                      )}

                      {/* Contact */}
                      <div className="flex flex-wrap gap-3 mb-2">
                        <a
                          href={`mailto:${appt.email}`}
                          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {appt.email}
                        </a>
                        {appt.phone && (
                          <a
                            href={`tel:${appt.phone}`}
                            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {appt.phone}
                          </a>
                        )}
                      </div>

                      {/* Message */}
                      {appt.message && (
                        <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 leading-relaxed mb-2">
                          &ldquo;{appt.message}&rdquo;
                        </p>
                      )}

                      <StatusForm appointmentId={appt.id} current={appt.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
