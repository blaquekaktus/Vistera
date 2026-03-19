import Link from 'next/link';
import { Mountain, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-alpine-950 flex items-center justify-center p-4">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white">Vistera</span>
        </Link>

        <div className="text-8xl font-black text-white/10 mb-4">404</div>

        <h1 className="text-2xl font-black text-white mb-2">Page not found</h1>
        <p className="text-white/50 text-sm mb-8 max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go home
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors text-sm"
          >
            <Search className="w-4 h-4" />
            Browse properties
          </Link>
        </div>
      </div>
    </div>
  );
}
