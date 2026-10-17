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
    <aside className="w-64 flex-shrink-0 bg-[#202020] text-[#F5F0E8] border-r-[3px] border-[#171717] min-h-screen flex flex-col justify-between hidden md:flex">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b-[2px] border-[#383838]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#C8FF00] text-[#171717] border-[2px] border-[#171717] font-black text-2xl flex items-center justify-center font-display shadow-[2px_2px_0px_#C8FF00] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform">
              W
            </div>
            <div>
              <div className="font-display font-extrabold text-xl tracking-tight text-[#F5F0E8]">
                WALTER<span className="text-[#C8FF00]">.AI</span>
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#8a8a7a]">
                Voice Call Agent
              </div>
            </div>
          </Link>
        </div>

        {/* Live Walter Status Banner */}
        <div className="mx-4 my-4 p-3 bg-[#171717] border-[2px] border-[#383838] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FF00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C8FF00]"></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase text-[#C8FF00]">
              AGENT ACTIVE
            </span>
          </div>
          <Radio className="w-3.5 h-3.5 text-[#C8FF00]" />
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded font-display font-semibold text-sm transition-all border-[2px] ${
                  isActive
                    ? 'bg-[#C8FF00] text-[#171717] border-[#171717] shadow-[3px_3px_0px_#F5F0E8]'
                    : 'text-[#EDE8DD] border-transparent hover:border-[#383838] hover:bg-[#2a2a2a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 font-mono font-bold uppercase border-[1px] ${
                      isActive
                        ? 'bg-[#171717] text-[#C8FF00] border-[#171717]'
                        : 'bg-[#C8FF00] text-[#171717] border-[#171717]'
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

      {/* Footer / Telephony Quick Glance */}
      <div className="p-4 border-t-[2px] border-[#383838] bg-[#1a1a1a]">
        <div className="text-[11px] font-mono text-[#8a8a7a] uppercase mb-1">
          Twilio Inbound Stream
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#F5F0E8] font-mono">
            /api/voice/stream
          </span>
          <Link
            href="/dashboard/integrations"
            className="text-[11px] text-[#C8FF00] hover:underline flex items-center gap-1 font-mono"
          >
            Config <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
