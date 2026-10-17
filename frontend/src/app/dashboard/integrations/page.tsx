'use client';

import { useState, useEffect } from 'react';
import {
  Network,
  PhoneCall,
  Bot,
  Database,
  Radio,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { getIntegrationStatus } from '@/lib/api';
import { IntegrationStatus } from '@/types';

export default function IntegrationsPage() {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await getIntegrationStatus();
      setStatus(data);
    } catch (err) {
      console.error('Failed to load integration telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return <LoadingState message="PROBING TELEPHONY & AI INTEGRATION PROVIDERS..." />;
  }

  const twilio = status?.twilio;
  const openai = status?.openai;
  const supabase = status?.supabase;
  const alexa = status?.alexa;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#171717] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#171717] font-display">
            EXTERNAL INTEGRATIONS TELEMETRY
          </h1>
          <p className="text-sm font-medium text-[#171717]/80 mt-1">
            Honest hardware & cloud connection status. Verified endpoints without fabricated connections.
          </p>
        </div>
        <div>
          <BrutalButton variant="secondary" size="sm" onClick={fetchStatus}>
            <RefreshCw className="w-4 h-4" />
            <span>Re-verify Status</span>
          </BrutalButton>
        </div>
      </div>

      {/* Grid of Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Twilio Voice */}
        <BrutalCard className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-[2px] border-[#171717] pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#FF6B4A] border-[2px] border-[#171717] flex items-center justify-center text-white">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base uppercase">
                    Twilio Telephony
                  </h2>
                  <span className="text-[10px] font-mono text-[#8a8a7a]">PSTN & MEDIA STREAMS</span>
                </div>
              </div>
              <StatusBadge status={twilio?.status === 'configured' ? 'online' : 'offline'}>
                {twilio?.status === 'configured' ? 'CONFIGURED' : 'UNCONFIGURED'}
              </StatusBadge>
            </div>

            <p className="text-xs text-[#171717]/80 font-medium leading-relaxed mb-4">
              Connects real PSTN telephone calls into Walter using bidirectional WebSocket media streaming.
            </p>

            <div className="p-3 bg-[#EDE8DD] border-[1px] border-[#171717] font-mono text-xs space-y-1.5 mb-4">
              <div className="text-[10px] text-[#8a8a7a] uppercase font-bold">Required Keys (.env):</div>
              <div className="flex items-center justify-between">
                <span>TWILIO_ACCOUNT_SID</span>
                <span className={twilio?.configured_fields?.account_sid ? 'text-[#22c55e] font-bold' : 'text-[#8a8a7a]'}>
                  {twilio?.configured_fields?.account_sid ? 'SET' : 'MISSING'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>TWILIO_AUTH_TOKEN</span>
                <span className={twilio?.configured_fields?.auth_token ? 'text-[#22c55e] font-bold' : 'text-[#8a8a7a]'}>
                  {twilio?.configured_fields?.auth_token ? 'SET' : 'MISSING'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>TWILIO_PHONE_NUMBER</span>
                <span className={twilio?.configured_fields?.phone_number ? 'text-[#22c55e] font-bold' : 'text-[#8a8a7a]'}>
                  {twilio?.configured_fields?.phone_number ? 'SET' : 'MISSING'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#8a8a7a] border-t border-[#171717]/20 pt-3">
            Inbound Webhook: <code className="bg-[#EDE8DD] px-1 py-0.5 border border-[#171717]">POST /api/calls/incoming</code>
          </div>
        </BrutalCard>

        {/* 2. OpenAI Realtime / LLM */}
        <BrutalCard className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-[2px] border-[#171717] pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#C8FF00] border-[2px] border-[#171717] flex items-center justify-center text-[#171717]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base uppercase">
                    AI Speech & Reasoning
                  </h2>
                  <span className="text-[10px] font-mono text-[#8a8a7a]">OPENAI / FALLBACK</span>
                </div>
              </div>
              <StatusBadge status={openai?.status === 'configured' ? 'online' : 'offline'}>
                {openai?.status === 'configured' ? 'CONFIGURED' : 'DEV FALLBACK'}
              </StatusBadge>
            </div>

            <p className="text-xs text-[#171717]/80 font-medium leading-relaxed mb-4">
              Orchestrates natural voice replies, caller intent extraction, and automated post-call summary synthesis.
            </p>

            <div className="p-3 bg-[#EDE8DD] border-[1px] border-[#171717] font-mono text-xs space-y-1.5 mb-4">
              <div className="text-[10px] text-[#8a8a7a] uppercase font-bold">Configured Model:</div>
              <div className="text-[#171717] font-bold">
                {openai?.model || 'Rule-Based Simulator Fallback'}
              </div>
              <div className="text-[10px] text-[#8a8a7a] uppercase font-bold pt-1">Required Keys (.env):</div>
              <div className="flex items-center justify-between">
                <span>OPENAI_API_KEY</span>
                <span className={openai?.configured_fields?.api_key ? 'text-[#22c55e] font-bold' : 'text-[#8a8a7a]'}>
                  {openai?.configured_fields?.api_key ? 'SET' : 'MISSING (Using Dev Mode)'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#8a8a7a] border-t border-[#171717]/20 pt-3">
            Active Adapter: <span className="font-bold text-[#171717]">OpenAI Voice Adapter</span>
          </div>
        </BrutalCard>

        {/* 3. Supabase Cloud DB & Auth */}
        <BrutalCard className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-[2px] border-[#171717] pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#383838] border-[2px] border-[#171717] flex items-center justify-center text-[#C8FF00]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base uppercase">
                    Supabase PostgreSQL
                  </h2>
                  <span className="text-[10px] font-mono text-[#8a8a7a]">RLS & AUTHENTICATION</span>
                </div>
              </div>
              <StatusBadge status={supabase?.status === 'configured' ? 'online' : 'offline'}>
                {supabase?.status === 'configured' ? 'CONNECTED' : 'LOCAL IN-MEMORY'}
              </StatusBadge>
            </div>

            <p className="text-xs text-[#171717]/80 font-medium leading-relaxed mb-4">
              Stores user profiles, answering rules, call summaries, and enforces Row-Level Security policies.
            </p>

            <div className="p-3 bg-[#EDE8DD] border-[1px] border-[#171717] font-mono text-xs space-y-1.5 mb-4">
              <div className="text-[10px] text-[#8a8a7a] uppercase font-bold">Persistence Mode:</div>
              <div className="text-[#171717] font-bold">
                {supabase?.status === 'configured' ? 'Supabase Managed Cloud' : 'Fast In-Memory Repository (Development)'}
              </div>
              <div className="text-[10px] text-[#8a8a7a] uppercase font-bold pt-1">Required Keys (.env):</div>
              <div className="flex items-center justify-between">
                <span>SUPABASE_URL</span>
                <span className={supabase?.configured_fields?.url ? 'text-[#22c55e] font-bold' : 'text-[#8a8a7a]'}>
                  {supabase?.configured_fields?.url ? 'SET' : 'IN-MEMORY'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>SUPABASE_SERVICE_ROLE_KEY</span>
                <span className={supabase?.configured_fields?.service_role_key ? 'text-[#22c55e] font-bold' : 'text-[#8a8a7a]'}>
                  {supabase?.configured_fields?.service_role_key ? 'SET' : 'DEV AUTH'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#8a8a7a] border-t border-[#171717]/20 pt-3">
            Migrations: <code className="bg-[#EDE8DD] px-1 py-0.5 border border-[#171717]">supabase/migrations/001_initial_schema.sql</code>
          </div>
        </BrutalCard>

        {/* 4. Alexa+ MCP Integration */}
        <BrutalCard variant="dark" className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-[2px] border-[#383838] pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#171717] border-[2px] border-[#383838] flex items-center justify-center text-[#C8FF00]">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base uppercase text-white">
                    Alexa+ MCP Module
                  </h2>
                  <span className="text-[10px] font-mono text-[#8a8a7a]">MCP SERVER / SKILL</span>
                </div>
              </div>
              <StatusBadge status="offline">
                INTEGRATION BOUNDARY
              </StatusBadge>
            </div>

            <p className="text-xs text-[#EDE8DD] font-medium leading-relaxed mb-4">
              Exposes call summaries, urgent triage lists, and preference updates to Alexa voice devices via Model Context Protocol.
            </p>

            <div className="p-3 bg-[#171717] border-[1px] border-[#383838] font-mono text-xs space-y-2 mb-4 text-[#EDE8DD]">
              <div className="text-[10px] text-[#C8FF00] uppercase font-bold">Integration Architecture:</div>
              <p className="text-[11px] text-[#8a8a7a]">
                Per Section 10 of the Execution Plan, Alexa+ MCP requires an eligible Amazon Developer account and Streamable HTTP endpoint.
              </p>
              <div className="text-[11px] border-t border-[#383838] pt-1.5 text-white">
                Server Source: <code className="text-[#C8FF00]">alexa/mcp_server.py</code>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#8a8a7a] border-t border-[#383838] pt-3 flex items-center justify-between">
            <span>Requires Developer Account Registration</span>
          </div>
        </BrutalCard>
      </div>
    </div>
  );
}
