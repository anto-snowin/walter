'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PhoneCall,
  Terminal,
  UserCheck,
  SlidersHorizontal,
  Network,
  Settings,
  Radio,
  ExternalLink,
  Bot,
  Activity,
  Headphones,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Call History', href: '/dashboard/calls', icon: PhoneCall },
  { label: 'Call Simulator', href: '/dashboard/simulator', icon: Terminal, badge: 'LIVE TEST' },
  { label: 'Personalization', href: '/dashboard/personalization', icon: UserCheck },
  { label: 'Call Rules', href: '/dashboard/rules', icon: SlidersHorizontal },
  { label: 'Integrations', href: '/dashboard/integrations', icon: Network },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0A0D18]/80 backdrop-blur-2xl border-r border-white/[0.08] min-h-screen flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-40">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#0B0F1C] rounded-[11px] flex items-center justify-center">
                <Headphones className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="font-display font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                <span>WALTER</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-black">
                  .AI
                </span>
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Autonomous Voice Agent
              </div>
            </div>
          </Link>
        </div>

        {/* Live Audio / Agent Status Capsule */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 via-slate-900/60 to-cyan-500/10 border border-white/[0.08] backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
                DISPATCH ARMED
              </span>
            </div>
            <div className="flex items-center gap-1 h-3">
              <span className="wave-bar !w-[2px]" style={{ animationDuration: '0.8s' }} />
              <span className="wave-bar !w-[2px]" style={{ animationDuration: '1.2s' }} />
              <span className="wave-bar !w-[2px]" style={{ animationDuration: '0.6s' }} />
              <span className="wave-bar !w-[2px]" style={{ animationDuration: '1.0s' }} />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Twilio bidirectional pipeline ready for incoming calls.
          </p>
        </div>

        {/* Navigation Section */}
        <div className="px-3 pt-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-3 font-semibold block mb-2">
            Control Console
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display font-medium text-sm transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/15 via-indigo-500/10 to-transparent text-white border border-indigo-500/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-r-full shadow-[0_0_8px_#6366F1]" />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-indigo-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-400/30'
                          : 'bg-white/[0.06] text-slate-400 border border-white/[0.08]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Telephony Quick Glance */}
      <div className="p-4 border-t border-white/[0.06] bg-[#080B14]/60 backdrop-blur-md">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyan-400" />
            Audio Stream
          </span>
          <span className="text-emerald-400 font-medium">8 kHz μ-law</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300 truncate max-w-[140px]">
            /api/voice/stream
          </span>
          <Link
            href="/dashboard/integrations"
            className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono transition-colors"
          >
            Config <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
