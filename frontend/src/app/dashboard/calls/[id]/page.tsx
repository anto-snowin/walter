'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  PhoneCall,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  ShieldCheck,
  Radio,
  Share2,
} from 'lucide-react';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { UrgencyBanner } from '@/components/ui/UrgencyBanner';
import { LoadingState } from '@/components/ui/LoadingState';
import { getCall, getCallSummary, escalateCall } from '@/lib/api';
import { CallSession, CallSummary, FollowUpAction } from '@/types';
import { formatDateTime, formatDuration } from '@/lib/utils';

export default function CallDetailPage() {
  const params = useParams();
  const callId = params?.id as string;
  const router = useRouter();

  const [call, setCall] = useState<CallSession | null>(null);
  const [summary, setSummary] = useState<CallSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [escalating, setEscalating] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [followUps, setFollowUps] = useState<FollowUpAction[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!callId) return;
      try {
        setLoading(true);
        const callData = await getCall(callId);
        setCall(callData);

        if (callData.summary) {
          setSummary(callData.summary);
          setEscalated(callData.summary.escalation_required);
          setFollowUps(callData.summary.follow_up_actions || []);
        } else {
          // Fetch summary separately if not joined
          const summaryData = await getCallSummary(callId).catch(() => null);
          if (summaryData) {
            setSummary(summaryData);
            setEscalated(summaryData.escalation_required);
            setFollowUps(summaryData.follow_up_actions || []);
          }
        }
      } catch (err) {
        console.error('Failed to load call session details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [callId]);

  const handleEscalate = async () => {
    if (!callId || escalating) return;
    try {
      setEscalating(true);
      await escalateCall(callId, 'Owner manually requested priority dispatch');
      setEscalated(true);
      if (summary) {
        setSummary({ ...summary, escalation_required: true });
      }
    } catch (err: any) {
      alert('Failed to escalate call: ' + (err.message || 'Unknown error'));
    } finally {
      setEscalating(false);
    }
  };

  const toggleActionCompleted = (index: number) => {
    setFollowUps((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  if (loading) {
    return <LoadingState message="RETRIEVING CALL LOG & SUMMARY..." />;
  }

  if (!call) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display uppercase">
          Call Record Not Found
        </h2>
        <p className="text-sm text-[#171717]/80">
          The requested call session does not exist or you do not have permission to inspect it.
        </p>
        <Link href="/dashboard/calls">
          <BrutalButton variant="primary">Return to Call Archive</BrutalButton>
        </Link>
      </div>
    );
  }

  const isUrgent = summary?.urgency === 'critical' || summary?.urgency === 'high';

  return (
    <div className="space-y-8">
      {/* Back navigation & Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#171717] pb-6">
        <div>
          <Link
            href="/dashboard/calls"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#8a8a7a] hover:text-[#171717] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Call Telemetry
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#171717] font-display">
              CALL LOG: {call.caller_number || 'SIMULATOR CALL'}
            </h1>
            <StatusBadge status={summary?.urgency || 'low'}>
              {summary?.urgency || 'LOW'}
            </StatusBadge>
          </div>
        </div>

        {/* Escalation Control */}
        <div>
          {escalated ? (
            <div className="p-2.5 bg-[#FF6B4A] text-white border-[2px] border-[#171717] font-mono font-bold text-xs uppercase flex items-center gap-2 shadow-[2px_2px_0px_#171717]">
              <AlertTriangle className="w-4 h-4" />
              PRIORITY ESCALATED
            </div>
          ) : (
            <BrutalButton
              variant="danger"
              size="sm"
              onClick={handleEscalate}
              disabled={escalating}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{escalating ? 'Escalating...' : 'Escalate to Owner'}</span>
            </BrutalButton>
          )}
        </div>
      </div>

      {/* Urgency Alert Banner if critical/high */}
      {isUrgent && (
        <UrgencyBanner
          urgency={summary?.urgency as any}
          message={`Call classified as ${summary?.urgency.toUpperCase()} priority matter requiring prompt review.`}
        />
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 border-[2px] border-[#171717] bg-white shadow-[3px_3px_0px_#171717]">
          <span className="text-[11px] font-mono text-[#8a8a7a] uppercase block">
            Ingestion Source
          </span>
          <span className="font-display font-bold text-base text-[#171717] uppercase">
            {call.source === 'twilio' ? 'Twilio Voice PSTN' : 'Browser Simulator'}
          </span>
        </div>

        <div className="p-4 border-[2px] border-[#171717] bg-white shadow-[3px_3px_0px_#171717]">
          <span className="text-[11px] font-mono text-[#8a8a7a] uppercase block">
            Call Duration
          </span>
          <span className="font-display font-bold text-base text-[#171717]">
            {formatDuration(call.duration_seconds || 0)}
          </span>
        </div>

        <div className="p-4 border-[2px] border-[#171717] bg-white shadow-[3px_3px_0px_#171717]">
          <span className="text-[11px] font-mono text-[#8a8a7a] uppercase block">
            Intent Category
          </span>
          <span className="font-display font-bold text-base text-[#171717] uppercase">
            {summary?.category || 'general'}
          </span>
        </div>

        <div className="p-4 border-[2px] border-[#171717] bg-white shadow-[3px_3px_0px_#171717]">
          <span className="text-[11px] font-mono text-[#8a8a7a] uppercase block">
            Date & Timestamp
          </span>
          <span className="font-mono text-xs font-semibold text-[#171717] block truncate">
            {call.started_at ? formatDateTime(call.started_at) : 'N/A'}
          </span>
        </div>
      </div>

      {/* AI Summary and Key Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Executive Summary */}
        <BrutalCard className="lg:col-span-2 p-6 space-y-4">
          <div className="border-b-[2px] border-[#171717] pb-3">
            <span className="section-header text-xs text-[#171717]" style={{ marginBottom: 0 }}>
              EXECUTIVE CALL SUMMARY
            </span>
            <h2 className="text-xl font-bold font-display uppercase tracking-tight mt-1">
              Synthesized by Walter AI
            </h2>
          </div>

          <div className="p-5 bg-[#EDE8DD] border-[2px] border-[#171717] font-semibold text-sm leading-relaxed text-[#171717]">
            {summary?.summary || 'No narrative summary was generated for this session.'}
          </div>

          {/* Follow-up Checklist */}
          <div className="pt-4 border-t-[2px] border-[#171717] space-y-3">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-[#171717]" />
              <h3 className="font-display font-bold text-sm uppercase">
                Action Items & Next Steps
              </h3>
            </div>

            {followUps.length === 0 ? (
              <p className="text-xs font-mono text-[#8a8a7a]">
                No specific follow-up actions extracted from this call.
              </p>
            ) : (
              <div className="space-y-2">
                {followUps.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleActionCompleted(idx)}
                    className={`p-3 border-[2px] border-[#171717] flex items-center justify-between gap-3 cursor-pointer select-none transition-all ${
                      item.completed ? 'bg-[#EDE8DD] opacity-60 line-through' : 'bg-white hover:bg-[#F5F0E8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 border-[2px] border-[#171717] flex items-center justify-center ${
                          item.completed ? 'bg-[#C8FF00]' : 'bg-white'
                        }`}
                      >
                        {item.completed && <CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" />}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#171717]">
                        {item.action}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-[#C8FF00] px-1.5 py-0.2 border border-[#171717]">
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </BrutalCard>

        {/* Extracted Key Details */}
        <div className="space-y-6">
          <BrutalCard variant="dark" className="p-6">
            <span className="section-header text-xs text-[#C8FF00] mb-4">
              EXTRACTED ENTITIES & FACTS
            </span>

            {summary?.key_details && Object.keys(summary.key_details).length > 0 ? (
              <div className="space-y-3 font-mono text-xs">
                {Object.entries(summary.key_details).map(([key, val]) => (
                  <div key={key} className="border-b border-[#383838] pb-2">
                    <span className="text-[#8a8a7a] uppercase block text-[10px]">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-white font-medium break-all">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-[#8a8a7a]">
                No structured key-value entities registered.
              </p>
            )}
          </BrutalCard>

          {/* Privacy & Legal Consent Box */}
          <div className="border-[2px] border-[#171717] bg-[#EDE8DD] p-4 text-xs font-mono text-[#171717]/80 space-y-1">
            <div className="font-bold uppercase flex items-center gap-1.5 text-[#171717]">
              <ShieldCheck className="w-4 h-4 text-[#171717]" />
              Privacy & Consent Notice
            </div>
            <p>
              In compliance with Section 14 privacy guidelines, raw voice recordings are disabled by default. Transcripts and summaries are stored strictly for the authenticated owner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
