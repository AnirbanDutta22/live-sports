import { Link, useLocation } from "react-router-dom";
import { Radio, BarChart3, ChevronLeft } from "lucide-react";

export function Header() {
  const location = useLocation();
  const isMatch = location.pathname.startsWith("/match/");

  return (
    <header className="sticky top-0 z-40 bg-pitch-950/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Back button on match detail */}
        {isMatch && (
          <Link
            to="/"
            className="flex items-center gap-1 text-white/50 hover:text-white/90 transition-colors text-sm font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Matches</span>
          </Link>
        )}

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-auto">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-lime-neon/15 border border-lime-neon/30">
            <Radio className="w-3.5 h-3.5 text-lime-neon" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-display font-bold text-lg text-white leading-none tracking-wide">
              LIVE
            </span>
            <span className="font-display font-light text-lg text-lime-neon leading-none tracking-wide">
              SCORE
            </span>
            <span className="font-display text-xs text-white/30 ml-1 leading-none font-medium tracking-widest">
              AD
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-body font-medium transition-colors ${
              !isMatch
                ? "text-lime-neon bg-lime-neon/10"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Matches</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
