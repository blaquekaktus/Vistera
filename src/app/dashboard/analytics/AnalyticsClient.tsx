'use client';

import Link from 'next/link';
import { Mountain, ArrowLeft, TrendingUp, Eye, MessageSquare, CheckCircle, BarChart2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PropertyStat {
  id: string;
  title: string;
  titleDe: string;
  city: string;
  views: number;
  vrViews: number;
}

interface Props {
  properties: PropertyStat[];
  totalViews: number;
  totalVrViews: number;
  totalInquiries: number;
  respondedCount: number;
  inquiriesByStatus: Record<string, number>;
  inquiriesByType: Record<string, number>;
  timeline: { day: string; count: number }[];
}

export default function AnalyticsClient({
  properties,
  totalViews,
  totalVrViews,
  totalInquiries,
  respondedCount,
  inquiriesByStatus,
  inquiriesByType,
  timeline,
}: Props) {
  const { language } = useLanguage();

  const responseRate = totalInquiries > 0
    ? Math.round((respondedCount / totalInquiries) * 100)
    : 0;

  const maxTimelineCount = Math.max(...timeline.map((t) => t.count), 1);

  const statusLabels: Record<string, { de: string; en: string }> = {
    new:       { de: 'Neu',          en: 'New' },
    read:      { de: 'Gelesen',      en: 'Read' },
    responded: { de: 'Beantwortet',  en: 'Responded' },
    closed:    { de: 'Geschlossen',  en: 'Closed' },
  };

  const typeLabels: Record<string, { de: string; en: string }> = {
    inquiry: { de: 'Anfrage',      en: 'Inquiry' },
    viewing: { de: 'Besichtigung', en: 'Viewing' },
    vr_tour: { de: 'VR-Tour',      en: 'VR Tour' },
  };

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

      <main className="lg:ml-64 p-6 max-w-5xl">
        {/* Mobile back */}
        <div className="lg:hidden mb-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {language === 'de' ? 'Analytics' : 'Analytics'}
            </h1>
            <p className="text-sm text-slate-500">
              {language === 'de' ? 'Performance Ihrer Inserate' : 'Your listings performance'}
            </p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: language === 'de' ? 'Seitenaufrufe' : 'Page views',
              value: totalViews.toLocaleString(),
              icon: Eye,
              color: 'bg-blue-50 text-blue-600',
            },
            {
              label: language === 'de' ? 'VR-Aufrufe' : 'VR views',
              value: totalVrViews.toLocaleString(),
              icon: BarChart2,
              color: 'bg-purple-50 text-purple-600',
            },
            {
              label: language === 'de' ? 'Anfragen gesamt' : 'Total inquiries',
              value: totalInquiries.toLocaleString(),
              icon: MessageSquare,
              color: 'bg-green-50 text-green-600',
            },
            {
              label: language === 'de' ? 'Antwortrate' : 'Response rate',
              value: `${responseRate}%`,
              icon: CheckCircle,
              color: 'bg-gold-50 text-gold-600',
            },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 mb-0.5">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 30-day timeline */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
          <h2 className="font-bold text-slate-900 mb-4 text-sm">
            {language === 'de' ? 'Anfragen – letzte 30 Tage' : 'Inquiries – last 30 days'}
          </h2>
          <div className="h-28 flex items-end gap-0.5">
            {timeline.map(({ day, count }) => (
              <div
                key={day}
                className="flex-1 flex flex-col items-center justify-end"
                title={`${day}: ${count}`}
              >
                <div
                  className="w-full bg-brand-500 rounded-t-sm min-h-[2px] transition-all"
                  style={{ height: `${Math.max((count / maxTimelineCount) * 100, count > 0 ? 8 : 2)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>{new Date(timeline[0].day).toLocaleDateString(language === 'de' ? 'de-AT' : 'en-GB', { day: 'numeric', month: 'short' })}</span>
            <span>{new Date(timeline[timeline.length - 1].day).toLocaleDateString(language === 'de' ? 'de-AT' : 'en-GB', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Inquiries by status */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h2 className="font-bold text-slate-900 mb-4 text-sm">
              {language === 'de' ? 'Anfragen nach Status' : 'Inquiries by status'}
            </h2>
            <div className="flex flex-col gap-2">
              {Object.entries(inquiriesByStatus).map(([status, count]) => {
                const label = statusLabels[status]?.[language] ?? status;
                const pct = totalInquiries > 0 ? Math.round((count / totalInquiries) * 100) : 0;
                const colors: Record<string, string> = {
                  new: 'bg-brand-500',
                  read: 'bg-slate-400',
                  responded: 'bg-green-500',
                  closed: 'bg-slate-300',
                };
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>{label}</span>
                      <span className="font-semibold">{count} <span className="text-slate-400">({pct}%)</span></span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${colors[status] ?? 'bg-slate-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inquiries by type */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h2 className="font-bold text-slate-900 mb-4 text-sm">
              {language === 'de' ? 'Anfragen nach Typ' : 'Inquiries by type'}
            </h2>
            <div className="flex flex-col gap-2">
              {Object.entries(inquiriesByType).map(([type, count]) => {
                const label = typeLabels[type]?.[language] ?? type;
                const pct = totalInquiries > 0 ? Math.round((count / totalInquiries) * 100) : 0;
                const colors: Record<string, string> = {
                  inquiry: 'bg-blue-500',
                  viewing: 'bg-gold-500',
                  vr_tour: 'bg-purple-500',
                };
                return (
                  <div key={type}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>{label}</span>
                      <span className="font-semibold">{count} <span className="text-slate-400">({pct}%)</span></span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${colors[type] ?? 'bg-slate-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Per-property table */}
        {properties.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm">
                {language === 'de' ? 'Performance pro Inserat' : 'Per-listing performance'}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 border-b border-slate-50">
                    <th className="text-left px-5 py-3 font-semibold">
                      {language === 'de' ? 'Inserat' : 'Listing'}
                    </th>
                    <th className="text-right px-5 py-3 font-semibold">
                      {language === 'de' ? 'Aufrufe' : 'Views'}
                    </th>
                    <th className="text-right px-5 py-3 font-semibold">
                      {language === 'de' ? 'VR-Aufrufe' : 'VR Views'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <Link
                          href={`/properties/${p.id}`}
                          className="font-medium text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                        >
                          {language === 'de' ? p.titleDe : p.title}
                        </Link>
                        <div className="text-xs text-slate-400">{p.city}</div>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                        {p.views.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        <span className="font-semibold text-purple-600">{p.vrViews.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {properties.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {language === 'de' ? 'Noch keine Daten vorhanden.' : 'No data yet.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
