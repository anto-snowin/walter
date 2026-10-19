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
  Activity,
  Headphones,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Call History', href: '/dashboard/calls', icon: PhoneCall },
  { label: 'Call Simulator', href: '/dashboard/simulator', icon: Terminal, badge: 'TEST' },
  { label: 'Personalization', href: '/dashboard/personalization', icon: UserCheck },
  { label: 'Call Rules', href: '/dashboard/rules', icon: SlidersHorizontal },
  { label: 'Integrations', href: '/dashboard/integrations', icon: Network },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#FAF7EE] border-r-[3px] border-[#171717] min-h-screen flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-40">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b-[3px] border-[#171717] bg-[#FAF7EE]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#C8FF00] text-[#171717] border-[2px] border-[#171717] font-black text-2xl flex items-center justify-center font-display shadow-[3px_3px_0px_#171717] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform">
              W
            </div>
            <div>
              <div className="font-display font-black text-xl tracking-tight text-[#171717] leading-none">
                WALTER<span className="text-[#FF6B4A]">.AI</span>
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#171717]/70 font-bold mt-1">
                Voice Call Agent
              </div>
            </div>
          </Link>
        </div>

        {/* Live Audio / Agent Status Capsule */}
        <div className="m-3 p-3 bg-white border-[2px] border-[#171717] shadow-[3px_3px_0px_#171717]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-[#C8FF00] px-1.5 py-0.5 border border-[#171717]">
                DISPATCH ARMED
              </span>
            </div>
            <div className="flex items-center gap-0.5 h-3">
              <span className="wave-bar !w-[2px]" style={{ animationDuration: '0.8s' }} />
              <span className="wave-bar !w-[2px]" style={{ animationDuration: '1.2s' }} />
              <span className="wave-bar !w-[2px]" style={{ animationDuration: '0.6s' }} />
              <span className="wave-bar !w-[2px]" style={{ animationDuration: '1.0s' }} />
            </div>
          </div>
          <p className="text-[11px] text-[#171717]/80 font-mono font-semibold leading-tight">
            Twilio WebSocket audio pipeline ready for calls.
          </p>
        </div>

        {/* Navigation Section */}
        <div className="px-3 pt-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#171717] px-3 font-extrabold block mb-2">
            [ CONSOLE MENU ]
          </span>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 font-display text-sm font-bold transition-all group ${
                    isActive
                      ? 'bg-[#C8FF00] text-[#171717] border-[2px] border-[#171717] shadow-[3px_3px_0px_#171717] -translate-x-[1px] -translate-y-[1px]'
                      : 'text-[#171717] hover:bg-white border-[2px] border-transparent hover:border-[#171717] hover:shadow-[3px_3px_0px_#171717]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 font-mono font-black uppercase tracking-wider border-[1px] border-[#171717] ${
                        isActive ? 'bg-[#171717] text-[#C8FF00]' : 'bg-[#FFDE59] text-[#171717]'
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
      <div className="p-4 border-t-[3px] border-[#171717] bg-[#EDE8DD]">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#171717] mb-1 font-bold">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#171717]" />
            Audio Stream
          </span>
          <span className="bg-[#C8FF00] px-1.5 py-0.2 border border-[#171717] text-[10px]">
            8 kHz μ-law
          </span>
        </div>
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-[#171717]/80 truncate max-w-[130px] font-bold">
            /api/voice/stream
          </span>
          <Link
            href="/dashboard/integrations"
            className="text-[#171717] font-bold hover:underline flex items-center gap-1 text-[11px]"
          >
            Config <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
