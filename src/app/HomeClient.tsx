'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Play, ChevronRight, Eye, Clock, Shield, Globe, Users, Video,
  ArrowRight, Star, Check, Building2, Home, Headphones,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { properties as mockProperties, testimonials, stats } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';

interface HomeClientProps {
  featuredProperties: Property[];
}

export default function HomeClient({ featuredProperties }: HomeClientProps) {
  const { language, t } = useLanguage();

  const featureIcons = [Eye, Clock, Shield, Globe, Users, Video];

  const featureKeys = ['vr', 'time', 'safe', 'dach', 'agent', 'live'] as const;

  const featureColors = [
    'from-brand-500 to-brand-700',
    'from-gold-400 to-gold-600',
    'from-green-500 to-green-700',
    'from-purple-500 to-purple-700',
    'from-rose-500 to-rose-700',
    'from-cyan-500 to-cyan-700',
  ];

  return (
    <>
      <Header />

      <main>
        {/* ─── HERO ─── */}
        <section className="relative min-h-screen hero-gradient flex items-center justify-center overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, #3263f5 0%, transparent 50%),
                                  radial-gradient(circle at 75% 75%, #2d6a4f 0%, transparent 50%)`,
              }}
            />
          </div>

          {/* Floating decorative elements */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-alpine-500/10 rounded-full blur-3xl animate-float animation-delay-400" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  {t.hero.badge}
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                  {t.hero.title}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-alpine-300">
                    {t.hero.titleAccent}
                  </span>
                </h1>

                <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                  {t.hero.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href="/properties"
                    className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl text-base shadow-lg shadow-brand-900/30 transition-all hover:scale-105"
                  >
                    {t.hero.cta}
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/for-agents"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all"
                  >
                    {t.hero.ctaSecondary}
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10">
                  {[
                    { value: stats.properties, label: t.hero.stats.properties },
                    { value: stats.cities, label: t.hero.stats.cities },
                    { value: stats.agents, label: t.hero.stats.agents },
                    { value: stats.vrTours, label: t.hero.stats.vrTours },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center lg:text-left">
                      <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                      <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: VR preview card */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Main preview */}
                  <div className="relative bg-slate-800 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                    <Image
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
                      alt="VR Property Tour"
                      fill
                      className="object-cover opacity-80"
                    />
                    {/* VR overlay UI */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors group">
                          <Play className="w-8 h-8 text-white fill-white ml-1 group-hover:scale-110 transition-transform" />
                        </button>
                        <p className="text-white/80 text-sm font-medium mt-3">
                          {language === 'de' ? 'VR-Tour starten' : 'Start VR Tour'}
                        </p>
                      </div>
                    </div>
                    {/* VR badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-brand-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      360° VR
                    </div>
                    {/* Room label */}
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-lg">
                      {language === 'de' ? 'Wohnzimmer' : 'Living Room'}
                    </div>
                  </div>

                  {/* Floating mini cards */}
                  <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Eye className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">
                          {language === 'de' ? 'VR-Aufrufe heute' : 'VR views today'}
                        </div>
                        <div className="text-base font-bold text-slate-900">1.247</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-6 -right-6 glass rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🇦🇹</span>
                      <span className="text-2xl">🇩🇪</span>
                      <span className="text-2xl">🇨🇭</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">DACH Region</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 80H1440V40C1200 0 960 80 720 40C480 0 240 80 0 40V80Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                {t.howItWorks.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

              {t.howItWorks.steps.map((step, idx) => {
                const icons = [Building2, Headphones, Home];
                const Icon = icons[idx];
                return (
                  <div key={idx} className="relative text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl shadow-lg shadow-brand-200 mb-6 relative z-10">
                      <Icon className="w-10 h-10 text-white" />
                      <span className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-brand-500 flex items-center justify-center text-xs font-black text-brand-700">
                        {idx + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                {t.features.title}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {t.features.subtitle}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureKeys.map((key, idx) => {
                const Icon = featureIcons[idx];
                const feature = t.features[key];
                return (
                  <div
                    key={key}
                    className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow group"
                  >
                    <div className={cn(
                      'inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br mb-4 shadow-sm',
                      featureColors[idx]
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── FEATURED PROPERTIES ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-3">
                  {t.properties.title}
                </h2>
                <p className="text-lg text-slate-600">{t.properties.subtitle}</p>
              </div>
              <Link
                href="/properties"
                className="hidden sm:flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors"
              >
                {t.properties.viewAll}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 text-brand-600 font-semibold"
              >
                {t.properties.viewAll}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                {t.testimonials.title}
              </h2>
              <p className="text-lg text-slate-600">
                {t.testimonials.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => {
                const text = language === 'de' ? testimonial.textDe : testimonial.text;
                const roleLabels: Record<string, { de: string; en: string }> = {
                  buyer: { de: 'Käufer', en: 'Buyer' },
                  seller: { de: 'Verkäufer', en: 'Seller' },
                  agent: { de: 'Makler', en: 'Agent' },
                };
                return (
                  <div key={testimonial.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gold-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-6 text-sm">
                      &ldquo;{text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={44}
                        height={44}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{testimonial.name}</div>
                        <div className="text-xs text-slate-500">
                          {roleLabels[testimonial.role][language]} · {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── AGENT CTA ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-alpine-950 rounded-3xl p-10 lg:p-16 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-black text-white mb-4">
                    {t.agents.title}
                  </h2>
                  <p className="text-white/70 text-lg mb-8">
                    {t.agents.subtitle}
                  </p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {[t.agents.benefit1, t.agents.benefit2, t.agents.benefit3].map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-white/80">
                        <div className="w-5 h-5 bg-alpine-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/for-agents"
                    className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors shadow-lg"
                  >
                    {t.agents.cta}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: language === 'de' ? 'Ø mehr Anfragen' : 'Avg. more leads', value: '+65%', color: 'from-green-400 to-green-600' },
                    { label: language === 'de' ? 'Weniger Besichtigungen' : 'Fewer viewings', value: '-40%', color: 'from-brand-400 to-brand-600' },
                    { label: language === 'de' ? 'Abschlussrate' : 'Close rate', value: '+28%', color: 'from-gold-400 to-gold-600' },
                    { label: language === 'de' ? 'Aktive Makler' : 'Active agents', value: '350+', color: 'from-purple-400 to-purple-600' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                      <div className={cn('text-3xl font-black mb-1 bg-gradient-to-r bg-clip-text text-transparent', item.color)}>
                        {item.value}
                      </div>
                      <div className="text-white/60 text-xs">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-24 bg-brand-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-black text-white mb-4">
              {t.cta.title}
            </h2>
            <p className="text-lg text-white/80 mb-8">
              {t.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors shadow-lg text-base"
              >
                {t.cta.button}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-base"
              >
                {t.cta.buttonSecondary}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
