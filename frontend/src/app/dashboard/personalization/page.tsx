'use client';

import { useState, useEffect } from 'react';
import {
  UserCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { BrutalSelect } from '@/components/ui/BrutalSelect';
import { LoadingState } from '@/components/ui/LoadingState';
import { getProfile, updateProfile } from '@/lib/api';
import { Profile } from '@/types';

export default function PersonalizationPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [speakingTone, setSpeakingTone] = useState('confident_and_witty');
  const [approvedFacts, setApprovedFacts] = useState<Array<{ key: string; value: string }>>([]);
  const [restrictedRules, setRestrictedRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState('');
  const [newFactKey, setNewFactKey] = useState('');
  const [newFactVal, setNewFactVal] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
        setDisplayName(data.display_name || '');
        setOccupation(data.occupation || '');
        setIntroduction(data.introduction || '');

        const facts = data.approved_information || {};
        const factsArray = Object.entries(facts).map(([key, value]) => ({
          key,
          value: String(value),
        }));
        if (factsArray.length === 0) {
          factsArray.push(
            { key: 'office_hours', value: 'Monday - Friday, 9:00 AM to 5:00 PM EST' },
            { key: 'preferred_contact', value: 'Leave a brief message or request callback' }
          );
        }
        setApprovedFacts(factsArray);

        const rules = data.private_information_rules?.restricted_topics || [
          'Do not disclose private financial accounts or payment numbers.',
          'Do not commit to unscheduled meetings without calendar check.',
          'Never reveal home address or personal travel dates.',
        ];
        setRestrictedRules(rules);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccess(false);

      const approvedInfoObj = approvedFacts.reduce((acc, curr) => {
        if (curr.key.trim()) acc[curr.key.trim()] = curr.value.trim();
        return acc;
      }, {} as Record<string, string>);

      await updateProfile({
        display_name: displayName,
        occupation,
        introduction,
        approved_information: approvedInfoObj,
        private_information_rules: {
          restricted_topics: restrictedRules,
          speaking_tone: speakingTone,
        },
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert('Failed to save profile: ' + (err.message || 'Check connection'));
    } finally {
      setSaving(false);
    }
  };

  const addFact = () => {
    if (!newFactKey.trim() || !newFactVal.trim()) return;
    setApprovedFacts([...approvedFacts, { key: newFactKey.trim(), value: newFactVal.trim() }]);
    setNewFactKey('');
    setNewFactVal('');
  };

  const removeFact = (idx: number) => {
    setApprovedFacts(approvedFacts.filter((_, i) => i !== idx));
  };

  const addRestrictedRule = () => {
    if (!newRule.trim()) return;
    setRestrictedRules([...restrictedRules, newRule.trim()]);
    setNewRule('');
  };

  const removeRestrictedRule = (idx: number) => {
    setRestrictedRules(restrictedRules.filter((_, i) => i !== idx));
  };

  if (loading) {
    return <LoadingState message="LOADING OWNER PERSONALIZATION SETTINGS..." />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#171717] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#171717] font-display">
            WALTER PERSONALIZATION
          </h1>
          <p className="text-sm font-medium text-[#171717]/80 mt-1">
            Define owner persona, approved facts Walter can disclose, and strict information boundaries.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-[#C8FF00] border-[2px] border-[#171717] shadow-[3px_3px_0px_#171717] font-mono text-xs font-bold text-[#171717] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>PERSONALIZATION PREFERENCES SYNCHRONIZED ACROSS AGENT ROUTINES.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Owner Core Identity */}
        <BrutalCard className="p-6 space-y-5">
          <div className="border-b-[2px] border-[#171717] pb-3 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#171717]" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight">
              Owner Profile & Persona
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BrutalInput
              label="Owner Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Anto Snowin"
              required
            />
            <BrutalInput
              label="Occupation / Role"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Founder & Systems Architect"
            />
          </div>

          <div className="space-y-1.5">
            <label className="section-header text-xs" style={{ marginBottom: 0 }}>
              Short Context & Introduction for Walter
            </label>
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={3}
              placeholder="Tell Walter about your schedule, current focus, and how to represent you to callers..."
              className="brutal-input w-full resize-none font-medium text-sm"
            />
          </div>

          <BrutalSelect
            label="Speaking Tone & Walter Demeanor"
            value={speakingTone}
            onChange={(e) => setSpeakingTone(e.target.value)}
          >
            <option value="confident_and_witty">Confident, composed & subtly witty (Recommended)</option>
            <option value="strictly_professional">Strictly formal & executive professional</option>
            <option value="warm_and_conversational">Warm, empathetic & friendly</option>
            <option value="concise_direct">Ultra-concise, rapid & direct</option>
          </BrutalSelect>
        </BrutalCard>

        {/* Approved Personal Information */}
        <BrutalCard className="p-6 space-y-5">
          <div className="border-b-[2px] border-[#171717] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#171717]" />
              <h2 className="font-display font-bold text-lg uppercase tracking-tight">
                Approved Facts Walter May Disclose
              </h2>
            </div>
            <p className="text-xs text-[#171717]/80 font-medium mt-1">
              Walter uses these factual key-value items when callers ask about availability, projects, or schedule.
            </p>
          </div>

          {/* List of existing facts */}
          <div className="space-y-2">
            {approvedFacts.map((fact, index) => (
              <div
                key={index}
                className="p-3 bg-white border-[2px] border-[#171717] flex items-center justify-between gap-3 shadow-[2px_2px_0px_#171717]"
              >
                <div className="flex-1 font-mono text-xs">
                  <span className="font-bold text-[#171717] uppercase bg-[#EDE8DD] px-1.5 py-0.5 border border-[#171717] mr-2">
                    {fact.key}
                  </span>
                  <span className="text-[#171717]/90">{fact.value}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFact(index)}
                  className="p-1 hover:text-[#FF6B4A]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add fact inputs */}
          <div className="p-4 bg-[#EDE8DD] border-[2px] border-[#171717] space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-[#171717]">
              Add Approved Fact
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Topic / Key (e.g. office_location)"
                value={newFactKey}
                onChange={(e) => setNewFactKey(e.target.value)}
                className="brutal-input sm:w-1/3"
              />
              <input
                type="text"
                placeholder="Approved fact or statement to disclose"
                value={newFactVal}
                onChange={(e) => setNewFactVal(e.target.value)}
                className="brutal-input flex-1"
              />
              <BrutalButton type="button" variant="primary" size="sm" onClick={addFact}>
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </BrutalButton>
            </div>
          </div>
        </BrutalCard>

        {/* Confidential / Restricted Information */}
        <BrutalCard variant="dark" className="p-6 space-y-5">
          <div className="border-b-[2px] border-[#383838] pb-3">
            <div className="flex items-center gap-2 text-[#FF6B4A]">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="font-display font-bold text-lg uppercase tracking-tight text-white">
                Information Walter Must Never Disclose
              </h2>
            </div>
            <p className="text-xs text-[#8a8a7a] mt-1">
              Absolute negative constraints enforced during prompt compilation. Walter will decline to share these.
            </p>
          </div>

          <div className="space-y-2">
            {restrictedRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#171717] border-[1px] border-[#383838] flex items-center justify-between gap-3 text-xs font-mono text-white"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B4A]" />
                  <span>{rule}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeRestrictedRule(idx)}
                  className="text-[#8a8a7a] hover:text-[#FF6B4A]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Never confirm calendar availability on Friday afternoons"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              className="brutal-input flex-1 text-xs"
            />
            <BrutalButton type="button" variant="secondary" size="sm" onClick={addRestrictedRule}>
              <Plus className="w-4 h-4" />
              <span>Add Boundary</span>
            </BrutalButton>
          </div>
        </BrutalCard>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <BrutalButton variant="primary" size="lg" type="submit" disabled={saving}>
            <Save className="w-4 h-4" />
            <span>{saving ? 'COMMITTING SETTINGS...' : 'SAVE PERSONALIZATION'}</span>
          </BrutalButton>
        </div>
      </form>
    </div>
  );
}
