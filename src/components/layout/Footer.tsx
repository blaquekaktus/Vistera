'use client';

import Link from 'next/link';
import { Mountain, MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const productLinks = [
    { href: '/properties', label: t.footer.links.properties },
    { href: '/for-agents', label: t.footer.links.forAgents },
    { href: '/#how-it-works', label: t.footer.links.howItWorks },
  ];

  const companyLinks = [
    { href: '/about', label: t.footer.links.about },
    { href: '/blog', label: t.footer.links.blog },
    { href: '/careers', label: t.footer.links.careers },
    { href: '/contact', label: t.footer.links.contact },
  ];

  const legalLinks = [
    { href: '/privacy', label: t.footer.links.privacy },
    { href: '/terms', label: t.footer.links.terms },
    { href: '/imprint', label: t.footer.links.imprint },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 bg-brand-600 rounded-lg">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Vistera</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              {t.footer.tagline}
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Innsbruck, Tirol, Österreich</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:hallo@vistera.at" className="hover:text-white transition-colors">
                  hallo@vistera.at
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>+43 512 000 000</span>
              </div>
            </div>

            {/* Country flags */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-xs text-slate-500">DACH:</span>
              <span className="text-xl" title="Österreich">🇦🇹</span>
              <span className="text-xl" title="Deutschland">🇩🇪</span>
              <span className="text-xl" title="Schweiz">🇨🇭</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.product}
            </h4>
            <ul className="flex flex-col gap-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.company}
            </h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.legal}
            </h4>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {t.footer.copyright}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5" />
            {t.footer.headquartered}
          </p>
        </div>
      </div>
    </footer>
  );
}
