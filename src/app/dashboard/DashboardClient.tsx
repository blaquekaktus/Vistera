'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Building2, Eye, MessageSquare, Calendar, Plus, TrendingUp,
  Play, Star, ArrowUpRight, Mountain, LogOut, Pencil, Trash2, LayoutDashboard,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { formatPrice, getCountryFlag } from '@/lib/utils';
import { logout } from '@/lib/actions/auth';
import { deleteListing } from '@/lib/actions/property';

export interface DashboardProperty {
  id: string;
  title: string;
  titleDe: string;
  images: string[];
  city: string;
  country: 'AT' | 'DE' | 'CH';
  price: number;
  currency: 'EUR' | 'CHF';
  vrViews: number;
  hasVrTour: boolean;
}

export interface DashboardInquiry {
  id: string;
  name: string;
  email: string;
  propertyTitle: string;
  type: string;
  createdAt: string;
}

interface Props {
  agentName: string;
  agentAgency: string;
  agentAvatar: string;
  agentRating: number;
  agentReviewCount: number;
  agentProperties: DashboardProperty[];
  recentInquiries: DashboardInquiry[];
}

export default function DashboardClient({
  agentName,
  agentAgency,
  agentAvatar,
  agentRating,
  agentReviewCount,
  agentProperties,
  recentInquiries,
}: Props) {
  const { language, t } = useLanguage();
  const pathname = usePathname();

  const stats = [
    {
      label: t.dashboard.stats.listings,
      value: agentProperties.length,
      icon: Building2,
      color: 'bg-brand-50 text-brand-600',
      trend: '+2',
    },
    {
      label: t.dashboard.stats.vrViews,
      value: agentProperties.reduce((sum, p) => sum + p.vrViews, 0).toLocaleString(),
      icon: Eye,
      color: 'bg-purple-50 text-purple-600',
      trend: '+18%',
    },
    {
      label: t.dashboard.stats.inquiries,
      value: recentInquiries.length > 0 ? recentInquiries.length : '—',
      icon: MessageSquare,
      color: 'bg-green-50 text-green-600',
      trend: '+5',
    },
    {
      label: t.dashboard.stats.appointments,
      value: '7',
      icon: Calendar,
      color: 'bg-gold-50 text-gold-600',
      trend: language === 'de' ? 'diese Woche' : 'this week',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 text-white flex-col z-40 hidden lg:flex">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg">Vistera</span>
        </Link>

        {/* Agent info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {agentAvatar ? (
              <Image
                src={agentAvatar}
                alt={agentName}
                width={40}
                height={40}
                className="rounded-full object-cover border border-white/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center border border-white/20">
                <span className="text-sm font-bold text-white">
                  {agentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
            )}
            <div>
              <div className="text-sm font-semibold">{agentName}</div>
              <div className="text-xs text-white/50">{agentAgency}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {[
            { icon: LayoutDashboard, labelDe: 'Übersicht',    labelEn: 'Overview',      href: '/dashboard' },
            { icon: Eye,             labelDe: 'VR-Touren',    labelEn: 'VR Tours',      href: '/properties' },
            { icon: MessageSquare,   labelDe: 'Anfragen',     labelEn: 'Inquiries',     href: '/dashboard/inquiries' },
            { icon: Calendar,        labelDe: 'Termine',      labelEn: 'Appointments',  href: '/dashboard/appointments' },
            { icon: TrendingUp,      labelDe: 'Analytics',    labelEn: 'Analytics',     href: '/dashboard/analytics' },
          ].map((item) => {
            const label = language === 'de' ? item.labelDe : item.labelEn;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const baseCls = 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors';
            return (
              <Link
                key={label}
                href={item.href}
                className={`${baseCls} ${isActive ? 'bg-brand-600 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
              >
                <item.icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Rating */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-gold-400 fill-current" />
            <span className="font-bold text-white">{agentRating}</span>
            <span className="text-white/40">({agentReviewCount} {language === 'de' ? 'Bewertungen' : 'reviews'})</span>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              {language === 'de' ? 'Abmelden' : 'Sign out'}
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-6">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 mb-6 bg-slate-950 -mx-6 -mt-6 px-6 py-4">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg text-white">Vistera</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {t.dashboard.welcome} {agentName.split(' ').pop()} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {language === 'de' ? 'Hier ist Ihre heutige Übersicht' : "Here's your overview for today"}
            </p>
          </div>
          <Link
            href="/dashboard/new-listing"
            className="flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t.dashboard.addListing}
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 mb-0.5">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* My listings */}
          <div className="bg-white rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{t.dashboard.myListings}</h2>
              <Link href="/properties" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
                {language === 'de' ? 'Alle anzeigen' : 'View all'}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {agentProperties.length === 0 ? (
                <p className="text-sm text-slate-400 p-5 text-center">
                  {language === 'de' ? 'Noch keine Inserate.' : 'No listings yet.'}
                </p>
              ) : (
                agentProperties.map((property) => {
                  const title = language === 'de' ? property.titleDe : property.title;
                  const flag = getCountryFlag(property.country);
                  return (
                    <div key={property.id} className="flex items-center gap-3 p-4">
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        {property.images[0] && (
                          <Image src={property.images[0]} alt={title} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 line-clamp-1">{title}</div>
                        <div className="text-xs text-slate-500">
                          {flag} {property.city} · {formatPrice(property.price, property.currency, language)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {property.hasVrTour && (
                          <Link
                            href={`/properties/${property.id}/tour`}
                            className="p-1.5 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                            title="VR Tour"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{property.vrViews}</span>
                        </div>
                        <Link
                          href={`/dashboard/${property.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                          title={language === 'de' ? 'Bearbeiten' : 'Edit'}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <form action={deleteListing}>
                          <input type="hidden" name="property_id" value={property.id} />
                          <button
                            type="submit"
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title={language === 'de' ? 'Löschen' : 'Delete'}
                            onClick={(e) => {
                              if (!confirm(language === 'de' ? 'Inserat wirklich löschen?' : 'Delete this listing?')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent inquiries */}
          <div className="bg-white rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{t.dashboard.recentInquiries}</h2>
              <Link href="/dashboard/inquiries" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
                {language === 'de' ? 'Alle anzeigen' : 'View all'}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentInquiries.length === 0 ? (
                <p className="text-sm text-slate-400 p-5 text-center">
                  {language === 'de' ? 'Noch keine Anfragen.' : 'No inquiries yet.'}
                </p>
              ) : (
                recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-start gap-3 p-4">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-brand-600">
                        {inquiry.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900">{inquiry.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{inquiry.propertyTitle}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded font-medium">
                          {inquiry.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(inquiry.createdAt).toLocaleDateString(language === 'de' ? 'de-AT' : 'en-GB', {
                            day: 'numeric', month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/inquiries`}
                      className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg font-medium transition-colors flex-shrink-0"
                    >
                      {language === 'de' ? 'Antworten' : 'Reply'}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* VR Performance chart placeholder */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="font-bold text-slate-900 mb-4">
            {language === 'de' ? 'VR-Tour Performance (letzte 30 Tage)' : 'VR Tour Performance (last 30 days)'}
          </h2>
          <div className="h-32 flex items-end gap-1">
            {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100, 80, 70, 88, 65, 92, 78, 85, 70, 95, 88, 76, 90, 82, 95, 88, 100, 92, 98].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${h}%` }}
                title={`${language === 'de' ? 'Tag' : 'Day'} ${i + 1}: ${Math.round(h * 2)} VR-${language === 'de' ? 'Aufrufe' : 'views'}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>{language === 'de' ? '1. Feb.' : 'Feb 1'}</span>
            <span>{language === 'de' ? '2.890 VR-Aufrufe gesamt' : '2,890 total VR views'}</span>
            <span>{language === 'de' ? '2. Mär.' : 'Mar 2'}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
