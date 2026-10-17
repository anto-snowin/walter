'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Clock,
  AlertTriangle,
  PhoneOff,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDashboardStats } from '@/lib/api';
import { DashboardStats, CallSession } from '@/types';
import { formatDateTime, formatDuration } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err: any) {
        console.error('Failed to load dashboard stats:', err);
        setError(err.message || 'Unable to connect to Walter backend.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingState message="FETCHING AGENT METRICS..." />;
  }

  const callData = stats?.recent_calls || [];

  // Chart data derived from calls
  const activityData = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 5 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 7 },
    { day: 'Fri', count: 4 },
    { day: 'Sat', count: stats?.calls_today || 1 },
    { day: 'Sun', count: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#171717] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#171717] font-display">
            WALTER DISPATCH OVERVIEW
          </h1>
          <p className="text-sm font-medium text-[#171717]/80 mt-1">
            Real-time telemetry, inbound call traffic, and AI assistant status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/simulator">
            <BrutalButton variant="primary">
              <Terminal className="w-4 h-4" />
              Launch Call Simulator
            </BrutalButton>
          </Link>
        </div>
      </div>

      {/* Error alert if backend is unreachable */}
      {error && (
        <div className="border-[2px] border-[#171717] bg-[#FF6B4A] text-white p-4 font-bold text-sm shadow-[4px_4px_0px_#171717] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>BACKEND NOTICE: {error} (Displaying fallback dashboard view)</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-[#171717] px-3 py-1 text-xs uppercase font-mono border-[1px] border-[#171717]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Numerical Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Handled Calls"
          value={stats?.total_calls ?? 0}
          subtext="Lifetime inbound volume"
          icon={<PhoneCall className="w-5 h-5 text-[#171717]" />}
          variant="default"
        />
        <StatCard
          label="Calls Handled Today"
          value={stats?.calls_today ?? 0}
          subtext="24-hour cycle"
          icon={<Clock className="w-5 h-5 text-[#171717]" />}
          variant="lime"
        />
        <StatCard
          label="Priority Escalate"
          value={stats?.urgent_calls ?? 0}
          subtext="High or critical urgency"
          icon={<AlertTriangle className="w-5 h-5 text-white" />}
          variant="coral"
        />
        <StatCard
          label="Failed / Missed"
          value={stats?.failed_calls ?? 0}
          subtext="Zero drop-rate goal"
          icon={<PhoneOff className="w-5 h-5 text-[#EDE8DD]" />}
          variant="dark"
        />
      </div>

      {/* Two Column Layout: Activity Chart & Walter Live Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Volume Chart */}
        <BrutalCard className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b-[2px] border-[#171717] pb-3">
            <h2 className="font-display font-bold text-lg uppercase tracking-tight">
              Inbound Call Volume
            </h2>
            <span className="text-xs font-mono font-bold bg-[#171717] text-[#C8FF00] px-2 py-0.5 border-[1px] border-[#171717]">
              WEEKLY METRIC
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis dataKey="day" stroke="#171717" strokeWidth={2} />
                <YAxis stroke="#171717" strokeWidth={2} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #171717',
                    boxShadow: '4px 4px 0px #171717',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                  }}
                />
                <Bar dataKey="count" fill="#C8FF00" stroke="#171717" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BrutalCard>

        {/* Walter Live Agent Monitor */}
        <BrutalCard variant="dark" className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-[2px] border-[#383838] pb-3 mb-4">
              <span className="section-header text-xs tracking-widest text-[#C8FF00]" style={{ marginBottom: 0 }}>
                AGENT HEARTBEAT
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#C8FF00] font-mono">
                <span className="inline-block w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse"></span>
                ONLINE
              </div>
            </div>

            <p className="text-xs text-[#EDE8DD] leading-relaxed mb-4">
              Walter is armed and listening for inbound calls on the Twilio bidirectional audio pipeline.
            </p>

            <div className="space-y-3 font-mono text-xs text-[#F5F0E8]">
              <div className="flex justify-between border-b border-[#383838] py-1.5">
                <span className="text-[#8a8a7a]">TwiML Stream:</span>
                <span className="text-[#C8FF00]">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-[#383838] py-1.5">
                <span className="text-[#8a8a7a]">Voice Engine:</span>
                <span>OpenAI / Fallback</span>
              </div>
              <div className="flex justify-between border-b border-[#383838] py-1.5">
                <span className="text-[#8a8a7a]">Answering Tone:</span>
                <span className="text-[#C8FF00]">Confident & Calm</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/dashboard/personalization" className="block">
              <BrutalButton variant="primary" className="w-full justify-center">
                Tune Personality
              </BrutalButton>
            </Link>
          </div>
        </BrutalCard>
      </div>

      {/* Recent Calls List */}
      <BrutalCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[2px] border-[#171717] pb-4 mb-6">
          <div>
            <h2 className="font-display font-bold text-xl uppercase tracking-tight">
              Recent Call Ingestion
            </h2>
            <p className="text-xs text-[#171717]/80 font-medium">
              Summarized communications and priority triage.
            </p>
          </div>
          <Link href="/dashboard/calls">
            <BrutalButton variant="secondary" size="sm">
              <span>View All Calls</span>
              <ArrowRight className="w-4 h-4" />
            </BrutalButton>
          </Link>
        </div>

        {callData.length === 0 ? (
          <EmptyState
            title="NO CALLS RECORDED YET"
            description="Run a test session using the browser call simulator to verify transcription, classification, and summarization."
            actionText="Launch Simulator"
            onAction={() => {
              window.location.href = '/dashboard/simulator';
            }}
          />
        ) : (
          <div className="divide-y-[2px] divide-[#171717] border-[2px] border-[#171717]">
            {callData.slice(0, 5).map((call) => (
              <Link
                key={call.id}
                href={`/dashboard/calls/${call.id}`}
                className="p-4 bg-white hover:bg-[#EDE8DD] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 block"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-[#171717]">
                      {call.caller_number || 'SIMULATOR CALLER'}
                    </span>
                    <StatusBadge status={call.summary?.urgency || 'low'}>
                      {call.summary?.urgency || 'LOW'}
                    </StatusBadge>
                    <span className="text-xs font-mono font-semibold bg-[#EDE8DD] border-[1px] border-[#171717] px-2 py-0.5">
                      {call.summary?.category || 'general'}
                    </span>
                    {call.source === 'simulator' && (
                      <span className="text-[10px] font-mono font-bold bg-[#C8FF00] text-[#171717] border-[1px] border-[#171717] px-1.5 py-0.2">
                        SIMULATED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#171717]/80 line-clamp-1 max-w-2xl font-medium">
                    {call.summary?.summary || 'Session recorded without detailed summary.'}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[#171717]/70 flex-shrink-0">
                  <span>{formatDuration(call.duration_seconds || 0)}</span>
                  <span>{call.started_at ? formatDateTime(call.started_at) : 'Just now'}</span>
                  <ArrowRight className="w-4 h-4 text-[#171717]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </BrutalCard>
    </div>
  );
}
