'use client';

import Link from 'next/link';
import {
  PhoneCall,
  Terminal,
  ShieldCheck,
  Zap,
  ArrowRight,
  Radio,
  Clock,
  Sparkles,
  Bot,
  User,
  SlidersHorizontal,
  Lock,
  ExternalLink,
  PhoneForwarded,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#171717] selection:bg-[#C8FF00]">
      {/* Top Ticker Tape */}
      <div className="bg-[#171717] text-[#C8FF00] border-b-[2px] border-[#171717] py-1 px-4 font-mono text-[11px] font-black uppercase tracking-wider overflow-hidden select-none">
        <div className="marquee-container">
          <div className="marquee-content flex gap-8">
            <span>⚡ AUTONOMOUS CALL AGENT</span>
            <span>•</span>
            <span>TWILIO WEBSOCKETS μ-LAW 8KHZ</span>
            <span>•</span>
            <span>ZERO HALLUCINATIONS (APPROVED FACTS ONLY)</span>
            <span>•</span>
            <span>STRUCTURED EXECUTIVE CALL SUMMARIES</span>
            <span>•</span>
            <span>FREE BROWSER SIMULATOR INCLUDED</span>
            <span>•</span>
            <span>⚡ AUTONOMOUS CALL AGENT</span>
            <span>•</span>
            <span>TWILIO WEBSOCKETS μ-LAW 8KHZ</span>
            <span>•</span>
            <span>ZERO HALLUCINATIONS (APPROVED FACTS ONLY)</span>
            <span>•</span>
            <span>STRUCTURED EXECUTIVE CALL SUMMARIES</span>
            <span>•</span>
            <span>FREE BROWSER SIMULATOR INCLUDED</span>
          </div>
        </div>
      </div>

      {/* Top Navigation */}
      <nav className="border-b-[3px] border-[#171717] px-6 py-4 bg-[#F5F0E8] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#C8FF00] text-[#171717] border-[2px] border-[#171717] font-black text-2xl flex items-center justify-center font-display shadow-[3px_3px_0px_#171717] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform">
              W
            </div>
            <div>
              <div className="font-display font-black text-xl tracking-tight text-[#171717]">
                WALTER<span className="text-[#FF6B4A]">.AI</span>
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#171717]/70 font-bold">
                Personal AI Call Agent
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/dashboard/simulator" className="hidden sm:inline-block">
              <span className="font-mono text-xs font-bold hover:underline px-2 py-1 bg-white border-[2px] border-[#171717] shadow-[2px_2px_0px_#171717]">
                CALL SIMULATOR
              </span>
            </Link>
            <Link href="/login">
              <BrutalButton variant="secondary" size="sm">
                Sign In
              </BrutalButton>
            </Link>
            <Link href="/dashboard">
              <BrutalButton variant="primary" size="sm">
                <span>Console</span>
                <ArrowRight className="w-4 h-4" />
              </BrutalButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 sm:py-24 border-b-[3px] border-[#171717] bg-[#F5F0E8] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 border-[2px] border-[#171717] bg-[#C8FF00] px-3 py-1 font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#171717] rotate-[-1deg]">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Personal Telephone Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-[#171717] leading-[1.05] uppercase">
              YOUR VOICE. <br />
              YOUR WALTER. <br />
              <span className="bg-[#171717] text-[#C8FF00] px-3.5 py-0.5 inline-block mt-1 shadow-[4px_4px_0px_#FF6B4A]">
                ALWAYS THERE.
              </span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-[#171717]/90 max-w-xl leading-relaxed">
              When you are in meetings, studying, or out of reach, Walter answers incoming phone calls, speaks with calm intelligence, handles routine inquiries using approved facts, and delivers structured executive summaries to your dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link href="/dashboard/simulator">
                <BrutalButton variant="primary" size="lg" className="w-full sm:w-auto justify-center">
                  <Terminal className="w-5 h-5" />
                  <span>Launch Free Call Simulator</span>
                </BrutalButton>
              </Link>
              <Link href="/dashboard">
                <BrutalButton variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
                  <span>Enter Owner Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </BrutalButton>
              </Link>
            </div>

            {/* Micro Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#171717] pt-4 font-bold">
              <span className="flex items-center gap-1.5 bg-white border-[2px] border-[#171717] px-2.5 py-1 shadow-[2px_2px_0px_#171717]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                Zero Hallucinations (Approved Facts Only)
              </span>
              <span className="flex items-center gap-1.5 bg-white border-[2px] border-[#171717] px-2.5 py-1 shadow-[2px_2px_0px_#171717]">
                <Zap className="w-4 h-4 text-[#FF6B4A]" />
                Twilio Bidirectional Audio
              </span>
            </div>
          </div>

          {/* Hero Visual: Live Call Simulation Card */}
          <div className="lg:col-span-5">
            <BrutalCard variant="dark" className="p-6 border-[3px] border-[#171717] shadow-[8px_8px_0px_#171717] space-y-5 rotate-[0.5deg]">
              {/* Card Call Status */}
              <div className="flex items-center justify-between border-b-[2px] border-[#383838] pb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FF00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C8FF00]"></span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#C8FF00] uppercase">
                    INCOMING CALL: PSTN AUDIO STREAM
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-[#262626] text-[#C8FF00] px-2 py-0.5 border border-[#383838]">
                  8 kHz μ-law
                </span>
              </div>

              {/* Dialogue Snippet */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#202020] border border-[#383838] space-y-1">
                  <div className="text-[#8a8a7a] uppercase font-bold text-[10px] flex items-center gap-1">
                    <User className="w-3 h-3 text-[#FF6B4A]" />
                    Caller (+1-555-0182)
                  </div>
                  <p className="text-[#EDE8DD]">
                    "Hi, I need to talk to Anto about rescheduling our architecture review tomorrow."
                  </p>
                </div>

                <div className="p-3 bg-[#262626] border border-[#C8FF00] space-y-1 shadow-[3px_3px_0px_#C8FF00]">
                  <div className="text-[#C8FF00] uppercase font-bold text-[10px] flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    Walter AI (Assistant)
                  </div>
                  <p className="text-white">
                    "Hello! This is Walter, AI telephone assistant for Anto. Anto is unavailable right now, but I can note your preferred new time or request an urgent callback. Which works best?"
                  </p>
                </div>
              </div>

              {/* Real-time Triage Tag */}
              <div className="p-3 bg-[#202020] border border-[#383838] flex items-center justify-between text-xs font-mono">
                <span className="text-[#8a8a7a]">Intent Detected:</span>
                <span className="bg-[#C8FF00] text-[#171717] font-bold px-2 py-0.5 uppercase border border-[#171717]">
                  Scheduling (Normal Priority)
                </span>
              </div>

              {/* Soundwave Simulation */}
              <div className="flex items-center justify-center gap-1.5 h-8 pt-2">
                {[40, 70, 30, 90, 60, 20, 80, 50, 95, 45, 65, 35, 80, 55].map((height, i) => (
                  <span
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-1.5 bg-[#C8FF00] inline-block animate-pulse"
                  />
                ))}
              </div>
            </BrutalCard>
          </div>
        </div>
      </section>

      {/* Core Architecture Features */}
      <section className="px-6 py-20 max-w-7xl mx-auto space-y-12">
        <div className="border-b-[3px] border-[#171717] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-extrabold uppercase tracking-widest bg-[#FFDE59] px-2 py-0.5 border-[2px] border-[#171717] shadow-[2px_2px_0px_#171717] inline-block mb-2">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-display mt-1">
              Engineered for Real-World Telephone Reliability
            </h2>
          </div>
          <span className="font-mono text-xs font-bold text-[#171717]/70">
            PSTN &bull; WEBSOCKETS &bull; LLM PIPELINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BrutalCard hoverable className="p-6 space-y-4">
            <div className="w-12 h-12 bg-[#C8FF00] border-[2px] border-[#171717] flex items-center justify-center shadow-[3px_3px_0px_#171717]">
              <PhoneCall className="w-6 h-6 text-[#171717]" />
            </div>
            <h3 className="font-display font-extrabold text-xl uppercase tracking-tight">
              Twilio Media Streams
            </h3>
            <p className="text-xs text-[#171717]/80 font-medium leading-relaxed">
              Handles genuine inbound telephone calls. Streams raw base64 μ-law 8 kHz audio bi-directionally between PSTN callers and FastAPI WebSockets without latency spikes.
            </p>
          </BrutalCard>

          <BrutalCard hoverable className="p-6 space-y-4">
            <div className="w-12 h-12 bg-[#FF6B4A] border-[2px] border-[#171717] flex items-center justify-center text-white shadow-[3px_3px_0px_#171717]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-extrabold text-xl uppercase tracking-tight">
              Owner Boundary Security
            </h3>
            <p className="text-xs text-[#171717]/80 font-medium leading-relaxed">
              Strict negative prompting ensures Walter never discloses confidential financial data, private itineraries, or unauthorized facts. Callers cannot inject prompts to alter settings.
            </p>
          </BrutalCard>

          <BrutalCard hoverable className="p-6 space-y-4">
            <div className="w-12 h-12 bg-[#00F0FF] border-[2px] border-[#171717] flex items-center justify-center text-[#171717] shadow-[3px_3px_0px_#171717]">
              <Terminal className="w-6 h-6 text-[#171717]" />
            </div>
            <h3 className="font-display font-extrabold text-xl uppercase tracking-tight">
              Zero-Cost Simulator
            </h3>
            <p className="text-xs text-[#171717]/80 font-medium leading-relaxed">
              Full browser test harness lets you speak or type test calls, verify agent rules, and generate summaries without burning phone carrier balance or needing a Twilio number.
            </p>
          </BrutalCard>
        </div>
      </section>

      {/* Sample Summary Showcase */}
      <section className="px-6 py-16 bg-[#EDE8DD] border-y-[3px] border-[#171717]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs font-black uppercase bg-[#171717] text-[#C8FF00] px-3 py-1 border-[2px] border-[#171717] shadow-[2px_2px_0px_#171717] inline-block">
              AUTOMATED POST-CALL SYNTHESIS
            </span>
            <h2 className="text-3xl font-black uppercase font-display tracking-tight">
              Structured Summaries, Not Lengthy Recordings
            </h2>
            <p className="text-xs font-medium text-[#171717]/80 max-w-xl mx-auto">
              Walter distills every phone conversation into actionable triage facts and follow-up checklists delivered directly to your dashboard.
            </p>
          </div>

          <BrutalCard className="p-6 bg-white border-[3px] border-[#171717] shadow-[6px_6px_0px_#171717] space-y-4">
            <div className="flex items-center justify-between border-b-[2px] border-[#171717] pb-3">
              <div className="font-mono text-xs font-bold text-[#171717]">
                CALL ID #WLT-84920 &bull; DURATION 1m 45s
              </div>
              <StatusBadge status="medium">MEDIUM PRIORITY</StatusBadge>
            </div>

            <p className="font-semibold text-sm text-[#171717] leading-relaxed">
              "Sarah Connor from Horizon Labs called requesting a 30-minute review on the Project Sky architecture document. She is available tomorrow afternoon between 2:00 PM and 4:00 PM EST and requested a callback confirmation."
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
              <div className="p-2.5 bg-[#EDE8DD] border-[2px] border-[#171717] shadow-[2px_2px_0px_#171717]">
                <span className="text-[10px] text-[#171717]/70 font-bold block">CALLER</span>
                <span className="font-extrabold">Sarah Connor</span>
              </div>
              <div className="p-2.5 bg-[#EDE8DD] border-[2px] border-[#171717] shadow-[2px_2px_0px_#171717]">
                <span className="text-[10px] text-[#171717]/70 font-bold block">CATEGORY</span>
                <span className="font-extrabold">Scheduling</span>
              </div>
              <div className="p-2.5 bg-[#EDE8DD] border-[2px] border-[#171717] shadow-[2px_2px_0px_#171717]">
                <span className="text-[10px] text-[#171717]/70 font-bold block">ACTION REQUIRED</span>
                <span className="font-extrabold text-[#FF6B4A]">Confirm Time</span>
              </div>
            </div>
          </BrutalCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-[#171717] bg-[#171717] text-[#F5F0E8] px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C8FF00] text-[#171717] font-black text-xl flex items-center justify-center font-display border border-[#171717]">
              W
            </div>
            <span className="font-display font-black text-lg text-white">
              WALTER AI ASSISTANT
            </span>
          </div>

          <p className="text-xs font-mono text-[#8a8a7a]">
            Built with Next.js App Router, FastAPI, WebSockets & Supabase PostgreSQL.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono">
            <Link href="/dashboard" className="bg-[#C8FF00] text-[#171717] font-bold px-3 py-1.5 border-[2px] border-[#171717] shadow-[3px_3px_0px_#FFFFFF] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
              Enter Console &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
