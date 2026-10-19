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
    <header className="bg-[#FAF7EE] border-b-[3px] border-[#171717] px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Mobile Branding & Hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border-[2px] border-[#171717] bg-white text-[#171717] shadow-[2px_2px_0px_#171717] active:translate-x-[1px] active:translate-y-[1px]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#C8FF00] border-[2px] border-[#171717] font-black text-sm flex items-center justify-center font-display shadow-[2px_2px_0px_#171717]">
            W
          </div>
          <span className="font-display font-black text-base tracking-tight text-[#171717]">
            WALTER<span className="text-[#FF6B4A]">.AI</span>
          </span>
        </Link>
      </div>

      {/* Desktop Breadcrumbs */}
      <div className="hidden md:flex items-center gap-2 text-xs font-mono font-bold uppercase">
        <Link
          href="/dashboard"
          className="text-[#171717]/70 hover:text-[#171717] hover:underline"
        >
          CONSOLE
        </Link>
        <span className="text-[#171717]">/</span>
        <span className="bg-[#171717] text-[#C8FF00] px-2 py-0.5 border border-[#171717]">
          {formattedPageName}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live System Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white border-[2px] border-[#171717] shadow-[2px_2px_0px_#171717] text-xs font-mono font-bold text-[#171717]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>ALL SERVICES OPERATIONAL</span>
        </div>

        {/* Quick Simulator CTA */}
        <Link href="/dashboard/simulator">
          <BrutalButton variant="primary" size="sm" className="gap-2">
            <Terminal className="w-4 h-4" />
            <span>Simulate Call</span>
          </BrutalButton>
        </Link>

        {/* User Account / Mode Capsule */}
        <div className="flex items-center gap-2 border-[2px] border-[#171717] bg-white shadow-[2px_2px_0px_#171717] px-2.5 py-1 text-xs text-[#171717]">
          <div className="w-6 h-6 bg-[#171717] text-[#C8FF00] font-black font-display flex items-center justify-center text-xs">
            U
          </div>
          <div className="hidden sm:block text-left font-mono font-bold text-xs uppercase">
            Owner Console
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#FAF7EE] border-b-[3px] border-[#171717] p-5 space-y-2 md:hidden shadow-[0_10px_0px_#171717]">
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
              className="block px-3 py-2 text-sm font-display font-bold uppercase text-[#171717] bg-white border-[2px] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#C8FF00]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
