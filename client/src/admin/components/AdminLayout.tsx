import { Outlet } from "react-router-dom";
import { AdminSidebar, AdminMobileNav } from "./AdminSidebar";
import { ToastProvider } from "../context/ToastContext";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Wifi, WifiOff } from "lucide-react";

function WsStatusDot() {
  const { status } = useWebSocket();
  if (status === "connected")
    return (
      <span className="flex items-center gap-1 text-[10px] font-body text-emerald-400/60">
        <Wifi className="w-3 h-3" /> Live
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[10px] font-body text-white/25">
      <WifiOff className="w-3 h-3" /> Offline
    </span>
  );
}

export function AdminLayout() {
  return (
    <ToastProvider>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 bg-pitch-950 bg-grid-pattern bg-grid pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(200,255,0,0.02),transparent)] pointer-events-none" />

        {/* Admin top bar */}
        <div className="relative border-b border-white/[0.05] bg-pitch-950/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 h-10 flex items-center justify-between">
            <span className="text-[11px] font-body font-medium text-white/25 uppercase tracking-widest">
              Admin Panel
            </span>
            <WsStatusDot />
          </div>
        </div>

        {/* Main */}
        <div className="relative max-w-4xl mx-auto px-4 py-6 flex gap-8">
          <AdminSidebar />
          <main className="flex-1 min-w-0">
            <AdminMobileNav />
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
