import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5F0E8] text-[#171717]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Neo-Brutalist Marquee Ticker */}
        <div className="bg-[#171717] text-[#C8FF00] border-b-[2px] border-[#171717] py-1 px-4 font-mono text-[11px] font-black uppercase tracking-wider overflow-hidden select-none">
          <div className="marquee-container">
            <div className="marquee-content flex gap-8">
              <span>⚡ TWILIO PSTN DISPATCH ACTIVE</span>
              <span>•</span>
              <span>8 KHZ μ-LAW BIDIRECTIONAL AUDIO</span>
              <span>•</span>
              <span>APPROVED FACTS ONLY</span>
              <span>•</span>
              <span>ZERO HALLUCINATION GUARD</span>
              <span>•</span>
              <span>AUTONOMOUS TELEPHONE AGENT</span>
              <span>•</span>
              <span>OWNER ESCALATION STANDBY</span>
              <span>•</span>
              <span>⚡ TWILIO PSTN DISPATCH ACTIVE</span>
              <span>•</span>
              <span>8 KHZ μ-LAW BIDIRECTIONAL AUDIO</span>
              <span>•</span>
              <span>APPROVED FACTS ONLY</span>
              <span>•</span>
              <span>ZERO HALLUCINATION GUARD</span>
              <span>•</span>
              <span>AUTONOMOUS TELEPHONE AGENT</span>
              <span>•</span>
              <span>OWNER ESCALATION STANDBY</span>
            </div>
          </div>
        </div>

        <Header />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
