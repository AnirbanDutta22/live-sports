import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListVideo,
  Settings,
  Radio,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const navItems: NavItem[] = [
  {
    to: "/admin",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Overview",
    end: true,
  },
  {
    to: "/admin/matches",
    icon: <ListVideo className="w-4 h-4" />,
    label: "Matches",
  },
  {
    to: "/admin/settings",
    icon: <Settings className="w-4 h-4" />,
    label: "Settings",
  },
];

export function AdminSidebar() {
  return (
    <aside className="w-56 flex-shrink-0 hidden md:flex flex-col gap-1 pr-4">
      {/* Brand */}
      <div className="flex items-center gap-2 px-3 py-3 mb-2">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-lime-neon/15 border border-lime-neon/30">
          <Radio className="w-3 h-3 text-lime-neon" />
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="font-display font-bold text-sm text-white tracking-wide">
            LIVE
          </span>
          <span className="font-display font-light text-sm text-lime-neon tracking-wide">
            SCORE
          </span>
          <span className="font-display text-[10px] text-white/30 ml-0.5 font-medium tracking-widest">
            ADMIN
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-all duration-150 ${
                isActive
                  ? "bg-lime-neon/10 text-lime-neon border border-lime-neon/20"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.05] border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={
                    isActive
                      ? "text-lime-neon"
                      : "text-white/35 group-hover:text-white/60"
                  }
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-40" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: back to site */}
      <div className="mt-auto pt-4 border-t border-white/[0.06]">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-body text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          Back to Live Site
        </NavLink>
      </div>
    </aside>
  );
}

// Mobile top bar for admin (shown below md)
export function AdminMobileNav() {
  return (
    <div className="md:hidden flex gap-1 overflow-x-auto pb-2 mb-4 scrollbar-hide">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium whitespace-nowrap flex-shrink-0 border transition-all ${
              isActive
                ? "bg-lime-neon/10 text-lime-neon border-lime-neon/20"
                : "text-white/40 border-white/[0.06] hover:text-white/70 hover:bg-white/[0.05]"
            }`
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
