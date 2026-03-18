'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, Mountain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/properties', label: t.nav.properties },
    { href: '/for-agents', label: t.nav.forAgents },
    { href: '/#how-it-works', label: t.nav.howItWorks },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'glass shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 bg-brand-600 rounded-lg shadow-md group-hover:bg-brand-700 transition-colors">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className={cn(
              'text-xl font-bold tracking-tight transition-colors',
              isScrolled ? 'text-slate-900' : 'text-white'
            )}>
              Vistera
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:opacity-80',
                  isScrolled ? 'text-slate-700' : 'text-white/90'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:scale-105',
                isScrolled
                  ? 'border-slate-200 text-slate-600 hover:border-slate-300'
                  : 'border-white/30 text-white/90 hover:border-white/60'
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'de' ? 'DE' : 'EN'}
            </button>

            <Link
              href="/login"
              className={cn(
                'text-sm font-medium transition-colors',
                isScrolled ? 'text-slate-700 hover:text-brand-600' : 'text-white/90 hover:text-white'
              )}
            >
              {t.nav.login}
            </Link>

            <Link
              href="/register"
              className="text-sm font-semibold bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
            >
              {t.nav.register}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
              className={cn(
                'text-xs font-medium',
                isScrolled ? 'text-slate-600' : 'text-white/90'
              )}
            >
              {language === 'de' ? 'EN' : 'DE'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              )}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white rounded-2xl shadow-xl border border-slate-100">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-slate-100" />
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-slate-700 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-semibold bg-brand-600 text-white px-3 py-2.5 rounded-lg text-center hover:bg-brand-700 transition-colors"
              >
                {t.nav.register}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
