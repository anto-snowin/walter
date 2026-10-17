'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  PhoneCall,
  Terminal,
  LogOut,
  User,
  ShieldAlert,
} from 'lucide-react';
import { BrutalButton } from '../ui/BrutalButton';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-[#F5F0E8] border-b-[3px] border-[#171717] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-[0_2px_0px_#171717]">
      {/* Mobile Branding & Hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 border-[2px] border-[#171717] bg-white shadow-[2px_2px_0px_#171717]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/dashboard" className="font-display font-black text-lg tracking-tight">
          WALTER<span className="text-[#FF6B4A]">.AI</span>
        </Link>
      </div>

      {/* Desktop Breadcrumb/Current Page */}
      <div className="hidden md:flex items-center gap-3">
        <span className="text-xs font-mono font-bold uppercase text-[#8a8a7a]">
          WALTER CALL CONSOLE /
        </span>
        <span className="font-display font-bold text-base text-[#171717] uppercase tracking-wide">
          {pathname.replace('/dashboard', '').replace('/', '') || 'OVERVIEW'}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Simulator Quick Action */}
        <Link href="/dashboard/simulator">
          <BrutalButton variant="primary" size="sm">
            <Terminal className="w-4 h-4" />
            <span className="hidden sm:inline">Simulate Call</span>
          </BrutalButton>
        </Link>

        {/* User Account / Mode Indicator */}
        <div className="flex items-center gap-2 border-[2px] border-[#171717] bg-white px-3 py-1.5 shadow-[2px_2px_0px_#171717]">
          <div className="w-6 h-6 rounded-full bg-[#171717] text-[#C8FF00] flex items-center justify-center text-xs font-bold font-mono">
            U
          </div>
          <span className="text-xs font-mono font-bold text-[#171717] hidden sm:inline">
            OWNER (ACTIVE)
          </span>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#202020] text-[#F5F0E8] border-b-[3px] border-[#171717] p-5 space-y-3 md:hidden shadow-[0_6px_0px_#171717]">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-sm hover:text-[#C8FF00]"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/calls"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-sm hover:text-[#C8FF00]"
          >
            Call History
          </Link>
          <Link
            href="/dashboard/simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-sm hover:text-[#C8FF00]"
          >
            Call Simulator
          </Link>
          <Link
            href="/dashboard/personalization"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-sm hover:text-[#C8FF00]"
          >
            Personalization
          </Link>
          <Link
            href="/dashboard/rules"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-sm hover:text-[#C8FF00]"
          >
            Call Rules
          </Link>
          <Link
            href="/dashboard/integrations"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-sm hover:text-[#C8FF00]"
          >
            Integrations
          </Link>
          <Link
            href="/dashboard/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-sm hover:text-[#C8FF00]"
          >
            Settings
          </Link>
        </div>
      )}
    </header>
  );
}
