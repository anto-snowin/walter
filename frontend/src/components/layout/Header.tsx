'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  PhoneCall,
  Terminal,
  User,
  ShieldCheck,
  ChevronRight,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { BrutalButton } from '../ui/BrutalButton';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Extract friendly breadcrumb name
  const pageName = pathname.replace('/dashboard', '').replace('/', '') || 'Overview';
  const formattedPageName = pageName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <header className="bg-[#07090E]/70 backdrop-blur-xl border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Mobile Branding & Hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg border border-white/10 bg-slate-900/60 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-[#0B0F1C] rounded-[7px] flex items-center justify-center">
              <Headphones className="w-3.5 h-3.5 text-indigo-400" />
            </div>
          </div>
          <span className="font-display font-bold text-base tracking-tight text-white">
            WALTER<span className="text-cyan-400">.AI</span>
          </span>
        </Link>
      </div>

      {/* Desktop Breadcrumbs */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <Link
          href="/dashboard"
          className="text-slate-400 hover:text-slate-200 font-medium transition-colors"
        >
          Console
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="font-semibold text-slate-100">{formattedPageName}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live System Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>All Services Operational</span>
        </div>

        {/* Quick Simulator CTA */}
        <Link href="/dashboard/simulator">
          <BrutalButton variant="primary" size="sm" className="gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Simulate Call</span>
          </BrutalButton>
        </Link>

        {/* User Account / Mode Capsule */}
        <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-md px-3 py-1.5 text-xs text-slate-300">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            U
          </div>
          <div className="hidden sm:block text-left">
            <div className="font-semibold text-slate-200 leading-tight text-xs">
              Owner Console
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0A0D18]/95 backdrop-blur-2xl border-b border-white/[0.08] p-5 space-y-2 md:hidden shadow-2xl animate-fade-in">
          {[
            { label: 'Overview', href: '/dashboard' },
            { label: 'Call History', href: '/dashboard/calls' },
            { label: 'Call Simulator', href: '/dashboard/simulator' },
            { label: 'Personalization', href: '/dashboard/personalization' },
            { label: 'Call Rules', href: '/dashboard/rules' },
            { label: 'Integrations', href: '/dashboard/integrations' },
            { label: 'Settings', href: '/dashboard/settings' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
