import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <p className="font-display font-bold text-7xl text-white/[0.04] mb-4">404</p>
        <h1 className="font-display font-semibold text-2xl text-white/60 mb-2">
          Page not found
        </h1>
        <p className="font-body text-white/30 text-sm mb-6">
          This page doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-lime-neon/10 hover:bg-lime-neon/15 border border-lime-neon/30 hover:border-lime-neon/50 rounded-lg text-lime-neon text-sm font-body font-medium transition-all"
        >
          ← Back to matches
        </Link>
      </div>
    </div>
  );
}
