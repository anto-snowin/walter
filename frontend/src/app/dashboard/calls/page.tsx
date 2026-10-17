'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Search,
  Filter,
  ArrowRight,
  Clock,
  AlertTriangle,
  Calendar,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { BrutalSelect } from '@/components/ui/BrutalSelect';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getCalls } from '@/lib/api';
import { CallSession, CallListResponse } from '@/types';
import { formatDateTime, formatDuration } from '@/lib/utils';

export default function CallsPage() {
  const [calls, setCalls] = useState<CallSession[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [search, setSearch] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        page: page.toString(),
        page_size: pageSize.toString(),
      };
      if (search.trim()) params.search = search.trim();
      if (urgencyFilter) params.urgency = urgencyFilter;
      if (sourceFilter) params.source = sourceFilter;
      if (categoryFilter) params.category = categoryFilter;

      const data: CallListResponse = await getCalls(params);
      setCalls(data.calls || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error fetching call records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, [page, urgencyFilter, sourceFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCalls();
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#171717] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#171717] font-display">
            CALL TELEMETRY ARCHIVE
          </h1>
          <p className="text-sm font-medium text-[#171717]/80 mt-1">
            Complete audit trail of all telephone and simulated voice sessions handled by Walter.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BrutalButton variant="secondary" size="sm" onClick={fetchCalls}>
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </BrutalButton>
          <Link href="/dashboard/simulator">
            <BrutalButton variant="primary" size="sm">
              <PhoneCall className="w-4 h-4" />
              <span>Simulate Call</span>
            </BrutalButton>
          </Link>
        </div>
      </div>

      {/* Search & Multi-Filter Bar */}
      <BrutalCard className="p-5">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by phone number, keyword, or caller name..."
                className="brutal-input w-full pl-9"
              />
              <Search className="w-4 h-4 text-[#8a8a7a] absolute left-3 top-3.5" />
            </div>
            <BrutalButton variant="primary" type="submit">
              Search
            </BrutalButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t-[1px] border-[#171717]/20">
            <BrutalSelect
              label="Urgency Rating"
              value={urgencyFilter}
              onChange={(e) => {
                setUrgencyFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Urgency Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </BrutalSelect>

            <BrutalSelect
              label="Call Source"
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Ingestion Sources</option>
              <option value="twilio">Twilio Telephone</option>
              <option value="simulator">Browser Simulator</option>
            </BrutalSelect>

            <BrutalSelect
              label="Topic Category"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              <option value="scheduling">Scheduling</option>
              <option value="urgent_message">Urgent Message</option>
              <option value="callback_request">Callback Request</option>
              <option value="message_delivery">Message Delivery</option>
              <option value="inquiry">Inquiry</option>
              <option value="general">General</option>
            </BrutalSelect>
          </div>
        </form>
      </BrutalCard>

      {/* Table / List View */}
      {loading ? (
        <LoadingState message="QUERYING CALL ARCHIVE..." />
      ) : calls.length === 0 ? (
        <EmptyState
          title="NO CALLS MATCH FILTER CRITERIA"
          description="Try broadening your search query or reset the urgency/category filters."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setUrgencyFilter('');
            setSourceFilter('');
            setCategoryFilter('');
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="border-[3px] border-[#171717] bg-white shadow-[4px_4px_0px_#171717] overflow-hidden">
            <div className="hidden lg:grid grid-cols-12 gap-4 p-4 bg-[#EDE8DD] border-b-[2px] border-[#171717] font-mono text-xs font-black uppercase tracking-wider text-[#171717]">
              <div className="col-span-3">Caller & Channel</div>
              <div className="col-span-4">Executive AI Summary</div>
              <div className="col-span-2">Category & Priority</div>
              <div className="col-span-2">Duration & Time</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            <div className="divide-y-[2px] divide-[#171717]">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className="p-4 hover:bg-[#F5F0E8] transition-colors flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:items-center"
                >
                  {/* Caller */}
                  <div className="lg:col-span-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#171717]">
                        {call.caller_number || 'SIMULATOR CALL'}
                      </span>
                      {call.source === 'simulator' ? (
                        <span className="text-[10px] font-mono font-bold bg-[#EDE8DD] border-[1px] border-[#171717] px-1.5 py-0.2">
                          SIM
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold bg-[#C8FF00] text-[#171717] border-[1px] border-[#171717] px-1.5 py-0.2">
                          PSTN
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-[#8a8a7a]">
                      ID: {call.id.slice(0, 8)}...
                    </div>
                  </div>

                  {/* Summary preview */}
                  <div className="lg:col-span-4">
                    <p className="text-xs text-[#171717] font-medium line-clamp-2 leading-relaxed">
                      {call.summary?.summary || 'Call session completed without detailed summary narrative.'}
                    </p>
                  </div>

                  {/* Category & Urgency */}
                  <div className="lg:col-span-2 flex items-center gap-2 flex-wrap">
                    <StatusBadge status={call.summary?.urgency || 'low'}>
                      {call.summary?.urgency || 'LOW'}
                    </StatusBadge>
                    <span className="text-[11px] font-mono uppercase bg-[#EDE8DD] border-[1px] border-[#171717] px-1.5 py-0.5">
                      {call.summary?.category || 'general'}
                    </span>
                  </div>

                  {/* Duration & Timestamp */}
                  <div className="lg:col-span-2 text-xs font-mono text-[#171717]/80 space-y-0.5">
                    <div>{formatDuration(call.duration_seconds || 0)}</div>
                    <div className="text-[11px] text-[#8a8a7a]">
                      {call.started_at ? formatDateTime(call.started_at) : 'N/A'}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="lg:col-span-1 flex justify-end">
                    <Link href={`/dashboard/calls/${call.id}`}>
                      <button className="brutal-btn brutal-btn-secondary brutal-btn-sm p-2">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-4 bg-[#EDE8DD] border-[2px] border-[#171717] font-mono text-xs font-bold">
            <div>
              Showing {calls.length} of {total} total call records (Page {page} of {totalPages})
            </div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border-[2px] border-[#171717] disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0px_#171717]"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 bg-white border-[2px] border-[#171717] disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0px_#171717]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
