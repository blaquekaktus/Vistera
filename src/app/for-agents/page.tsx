'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Check, ArrowRight, TrendingUp, Clock, Users, BarChart3,
  Camera, Globe, Star, Building2, Zap,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { agents } from '@/lib/data';
import { cn } from '@/lib/utils';

const plans = {
  de: [
    {
      name: 'Starter',
      price: '49',
      period: '/Monat',
      desc: 'Perfekt für Einzelmakler',
      features: [
        'Bis zu 10 Inserate',
        '5 VR-Touren',
        'Basis-Dashboard',
        'E-Mail-Support',
        'DACH-Sichtbarkeit',
      ],
      cta: 'Kostenlos testen',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '149',
      period: '/Monat',
      desc: 'Für wachsende Agenturen',
      features: [
        'Bis zu 50 Inserate',
        '30 VR-Touren',
        'Erweitertes Dashboard',
        'Prioritäts-Support',
        'Lead-Management',
        'Statistiken & Analytics',
        'Premium-Platzierung',
      ],
      cta: 'Jetzt starten',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Auf Anfrage',
      period: '',
      desc: 'Für große Immobilienbüros',
      features: [
        'Unbegrenzte Inserate',
        'Unbegrenzte VR-Touren',
        'White-Label-Option',
        'Dedizierter Account Manager',
        'API-Zugang',
        'Custom Branding',
        'SLA Garantie',
      ],
      cta: 'Kontakt aufnehmen',
      highlighted: false,
    },
  ],
  en: [
    {
      name: 'Starter',
      price: '49',
      period: '/month',
      desc: 'Perfect for solo agents',
      features: [
        'Up to 10 listings',
        '5 VR tours',
        'Basic dashboard',
        'Email support',
        'DACH visibility',
      ],
      cta: 'Try for free',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '149',
      period: '/month',
      desc: 'For growing agencies',
      features: [
        'Up to 50 listings',
        '30 VR tours',
        'Advanced dashboard',
        'Priority support',
        'Lead management',
        'Statistics & analytics',
        'Premium placement',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'On request',
      period: '',
      desc: 'For large real estate offices',
      features: [
        'Unlimited listings',
        'Unlimited VR tours',
        'White-label option',
        'Dedicated account manager',
        'API access',
        'Custom branding',
        'SLA guarantee',
      ],
      cta: 'Contact Us',
      highlighted: false,
    },
  ],
};

export default function ForAgentsPage() {
  const { language, t } = useLanguage();
  const currentPlans = plans[language];

  const benefits = [
    {
      icon: TrendingUp,
      title: language === 'de' ? 'Mehr qualifizierte Leads' : 'More Qualified Leads',
      desc: language === 'de'
        ? 'Interessenten, die eine VR-Tour absolviert haben, sind 3x wahrscheinlicher, einen Besichtigungstermin zu buchen.'
        : 'Prospects who completed a VR tour are 3x more likely to book a viewing appointment.',
    },
    {
      icon: Clock,
      title: language === 'de' ? 'Zeit sparen' : 'Save Time',
      desc: language === 'de'
        ? 'Reduzieren Sie unnötige Vor-Ort-Besichtigungen um bis zu 40%. Mehr Zeit für echte Interessenten.'
        : 'Reduce unnecessary on-site viewings by up to 40%. More time for genuine prospects.',
    },
    {
      icon: Globe,
      title: language === 'de' ? 'Internationale Reichweite' : 'International Reach',
      desc: language === 'de'
        ? 'Erreichen Sie Käufer aus dem gesamten DACH-Raum und darüber hinaus – ohne Reisekosten.'
        : 'Reach buyers from across the DACH region and beyond — without travel costs.',
    },
    {
      icon: BarChart3,
      title: language === 'de' ? 'Detaillierte Analytics' : 'Detailed Analytics',
      desc: language === 'de'
        ? 'Sehen Sie genau, welche Räume Interessenten am meisten Zeit verbringen. Wertvolle Einblicke.'
        : 'See exactly which rooms prospects spend the most time in. Valuable insights.',
    },
    {
      icon: Camera,
      title: language === 'de' ? 'Einfaches VR-Upload' : 'Easy VR Upload',
      desc: language === 'de'
        ? 'Laden Sie 360°-Fotos direkt hoch. Wir übernehmen die Optimierung und Einbindung.'
        : 'Upload 360° photos directly. We handle optimization and integration.',
    },
    {
      icon: Users,
      title: language === 'de' ? 'Live-Führungen' : 'Live Tours',
      desc: language === 'de'
        ? 'Führen Sie mehrere Interessenten gleichzeitig durch ein Objekt – per Video-Call im VR-Modus.'
        : 'Guide multiple prospects through a property simultaneously — via video call in VR mode.',
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="hero-gradient pt-28 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 70% 30%, #3263f5 0%, transparent 50%)`,
              }}
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                <Building2 className="w-3.5 h-3.5" />
                {language === 'de' ? 'Für Immobilienmakler' : 'For Real Estate Agents'}
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
                {language === 'de'
                  ? 'Modernisieren Sie Ihr Maklergeschäft'
                  : 'Modernise Your Real Estate Business'}
              </h1>
              <p className="text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
                {language === 'de'
                  ? 'Vistera gibt Ihnen die Werkzeuge, mit denen Sie mehr Immobilien schneller verkaufen – mit immersiven VR-Touren, smarten Lead-Tools und DACH-weiter Sichtbarkeit.'
                  : 'Vistera gives you the tools to sell more properties faster — with immersive VR tours, smart lead tools, and DACH-wide visibility.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register?role=agent"
                  className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors shadow-lg text-base"
                >
                  {language === 'de' ? '14 Tage kostenlos testen' : 'Try free for 14 days'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-base"
                >
                  {language === 'de' ? 'Preise ansehen' : 'View Pricing'}
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 60H1440V30C1200 0 960 60 720 30C480 0 240 60 0 30V60Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '+65%', label: language === 'de' ? 'Mehr Anfragen' : 'More Inquiries' },
                { value: '-40%', label: language === 'de' ? 'Weniger Vor-Ort-Touren' : 'Fewer On-site Tours' },
                { value: '+28%', label: language === 'de' ? 'Höhere Abschlussrate' : 'Higher Close Rate' },
                { value: '350+', label: language === 'de' ? 'Aktive Makler' : 'Active Agents' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-black text-brand-600 mb-2">{stat.value}</div>
                  <div className="text-slate-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                {language === 'de' ? 'Vorteile für Makler' : 'Benefits for Agents'}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-white rounded-2xl p-6 border border-slate-100">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured agents */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-3">
                {language === 'de' ? 'Unsere Top-Makler' : 'Our Top Agents'}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center">
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover mx-auto mb-3 border-2 border-white shadow"
                  />
                  <div className="font-bold text-slate-900 text-sm mb-0.5">{agent.name}</div>
                  <div className="text-xs text-slate-500 mb-2">{agent.agency}</div>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 text-gold-400 fill-current" />
                    <span className="text-sm font-semibold text-slate-700">{agent.rating}</span>
                    <span className="text-xs text-slate-400">({agent.reviewCount})</span>
                  </div>
                  <div className="text-xs text-slate-500">{agent.region}</div>
                  <div className="text-xs font-semibold text-brand-600 mt-1">
                    {agent.propertiesCount} {language === 'de' ? 'Inserate' : 'Listings'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                {language === 'de' ? 'Einfache Preisgestaltung' : 'Simple Pricing'}
              </h2>
              <p className="text-lg text-slate-600">
                {language === 'de' ? '14 Tage kostenlos testen – keine Kreditkarte erforderlich.' : '14-day free trial — no credit card required.'}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {currentPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    'rounded-2xl p-7 border',
                    plan.highlighted
                      ? 'bg-brand-600 border-brand-600 text-white shadow-2xl shadow-brand-200 scale-105'
                      : 'bg-white border-slate-100'
                  )}
                >
                  {plan.highlighted && (
                    <div className="flex items-center gap-1 text-xs font-bold text-brand-200 mb-3">
                      <Zap className="w-3.5 h-3.5" />
                      {language === 'de' ? 'AM BELIEBTESTEN' : 'MOST POPULAR'}
                    </div>
                  )}
                  <h3 className={cn('text-xl font-black mb-1', plan.highlighted ? 'text-white' : 'text-slate-900')}>
                    {plan.name}
                  </h3>
                  <p className={cn('text-sm mb-4', plan.highlighted ? 'text-brand-200' : 'text-slate-500')}>
                    {plan.desc}
                  </p>
                  <div className="flex items-baseline gap-1 mb-6">
                    {plan.period ? (
                      <>
                        <span className={cn('text-4xl font-black', plan.highlighted ? 'text-white' : 'text-slate-900')}>
                          €{plan.price}
                        </span>
                        <span className={cn('text-sm', plan.highlighted ? 'text-brand-200' : 'text-slate-500')}>
                          {plan.period}
                        </span>
                      </>
                    ) : (
                      <span className={cn('text-2xl font-bold', plan.highlighted ? 'text-white' : 'text-slate-900')}>
                        {plan.price}
                      </span>
                    )}
                  </div>
                  <ul className="flex flex-col gap-3 mb-7">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <Check className={cn('w-4 h-4 flex-shrink-0', plan.highlighted ? 'text-brand-200' : 'text-green-500')} />
                        <span className={cn('text-sm', plan.highlighted ? 'text-brand-100' : 'text-slate-600')}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register?role=agent"
                    className={cn(
                      'block text-center font-semibold py-3 rounded-xl text-sm transition-colors',
                      plan.highlighted
                        ? 'bg-white text-brand-700 hover:bg-brand-50'
                        : 'bg-brand-600 text-white hover:bg-brand-700'
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
