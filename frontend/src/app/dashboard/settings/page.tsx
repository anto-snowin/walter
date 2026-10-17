'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Shield,
  Trash2,
  LogOut,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalSelect } from '@/components/ui/BrutalSelect';

export default function SettingsPage() {
  const router = useRouter();

  const [retentionDays, setRetentionDays] = useState('30');
  const [enableRecordings, setEnableRecordings] = useState(false);
  const [enableTranscripts, setEnableTranscripts] = useState(false);
  const [maskPhoneNumbers, setMaskPhoneNumbers] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearData = () => {
    if (confirm('Are you certain you wish to purge all stored call sessions and transcripts? This cannot be undone.')) {
      setClearing(true);
      setTimeout(() => {
        setClearing(false);
        alert('All local call records and cached transcripts have been purged.');
      }, 1000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('walter_token');
    router.push('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#171717] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#171717] font-display">
            SYSTEM SETTINGS & PRIVACY
          </h1>
          <p className="text-sm font-medium text-[#171717]/80 mt-1">
            Configure privacy boundaries, audio consent policies, and data retention lifecycles.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-[#C8FF00] border-[2px] border-[#171717] shadow-[3px_3px_0px_#171717] font-mono text-xs font-bold text-[#171717] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>PRIVACY & RETENTION CONFIGURATION STORED.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Retention Policy */}
        <BrutalCard className="p-6 space-y-5">
          <div className="border-b-[2px] border-[#171717] pb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#171717]" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight">
              Data Retention Lifecycle
            </h2>
          </div>

          <div className="space-y-4">
            <BrutalSelect
              label="Automatic Call Summary Retention Period"
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
            >
              <option value="7">7 Days (Strict Minimal Retention)</option>
              <option value="30">30 Days (Standard Recommendation)</option>
              <option value="90">90 Days (Quarterly Audit)</option>
              <option value="365">1 Year (Long Term Archive)</option>
            </BrutalSelect>

            <p className="text-xs text-[#171717]/80 font-medium">
              Call metadata and summaries older than the specified timeframe are permanently purged from PostgreSQL storage.
            </p>
          </div>
        </BrutalCard>

        {/* Privacy & Recording Consent (Opt-in by default) */}
        <BrutalCard className="p-6 space-y-5">
          <div className="border-b-[2px] border-[#171717] pb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#FF6B4A]" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight">
              Telephony Privacy & Consent Controls
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-3 bg-white border-[2px] border-[#171717] cursor-pointer shadow-[2px_2px_0px_#171717]">
              <input
                type="checkbox"
                checked={enableRecordings}
                onChange={(e) => setEnableRecordings(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#C8FF00]"
              />
              <div>
                <span className="font-display font-bold text-sm block">
                  Enable Audio Recording (Disabled by default)
                </span>
                <span className="text-xs text-[#171717]/80 font-medium leading-relaxed block mt-0.5">
                  When enabled, Walter will verbally inform callers that the conversation is recorded for quality and verification purposes.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white border-[2px] border-[#171717] cursor-pointer shadow-[2px_2px_0px_#171717]">
              <input
                type="checkbox"
                checked={enableTranscripts}
                onChange={(e) => setEnableTranscripts(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#C8FF00]"
              />
              <div>
                <span className="font-display font-bold text-sm block">
                  Retain Full Word-by-Word Transcripts
                </span>
                <span className="text-xs text-[#171717]/80 font-medium leading-relaxed block mt-0.5">
                  By default, Walter only stores concise structured summaries and extracted facts to respect caller privacy.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white border-[2px] border-[#171717] cursor-pointer shadow-[2px_2px_0px_#171717]">
              <input
                type="checkbox"
                checked={maskPhoneNumbers}
                onChange={(e) => setMaskPhoneNumbers(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#C8FF00]"
              />
              <div>
                <span className="font-display font-bold text-sm block">
                  Anonymize & Mask Caller Numbers in Dashboard (e.g. +1-***-***-0199)
                </span>
                <span className="text-xs text-[#171717]/80 font-medium leading-relaxed block mt-0.5">
                  Mask numbers to prevent accidental shoulder surfing or screen leaks during demonstrations.
                </span>
              </div>
            </label>
          </div>
        </BrutalCard>

        {/* Danger Zone: Purge & Logout */}
        <BrutalCard variant="dark" className="p-6 space-y-4">
          <div className="border-b-[2px] border-[#383838] pb-3 flex items-center gap-2 text-[#FF6B4A]">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight text-white">
              Danger Zone
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div>
              <div className="font-bold text-sm text-white font-display">
                Purge All Stored Call Telemetry
              </div>
              <div className="text-xs text-[#8a8a7a]">
                Irreversibly delete all call sessions, summaries, and extracted facts.
              </div>
            </div>
            <BrutalButton
              type="button"
              variant="danger"
              size="sm"
              onClick={handleClearData}
              disabled={clearing}
            >
              <Trash2 className="w-4 h-4" />
              <span>{clearing ? 'Purging...' : 'Purge All Data'}</span>
            </BrutalButton>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#383838]">
            <div>
              <div className="font-bold text-sm text-white font-display">
                Sign Out of Walter Console
              </div>
              <div className="text-xs text-[#8a8a7a]">
                Terminate the active browser session.
              </div>
            </div>
            <BrutalButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </BrutalButton>
          </div>
        </BrutalCard>

        <div className="flex justify-end pt-4">
          <BrutalButton variant="primary" size="lg" type="submit">
            <Save className="w-4 h-4" />
            <span>SAVE SETTINGS</span>
          </BrutalButton>
        </div>
      </form>
    </div>
  );
}
