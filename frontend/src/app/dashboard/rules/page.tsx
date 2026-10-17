'use client';

import { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Save,
  CheckCircle2,
  Clock,
  PhoneForwarded,
  ShieldAlert,
  Users,
  Plus,
  Trash2,
} from 'lucide-react';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { BrutalSelect } from '@/components/ui/BrutalSelect';
import { LoadingState } from '@/components/ui/LoadingState';
import { getPreferences, updatePreferences } from '@/lib/api';
import { AnsweringRules } from '@/types';

export default function RulesPage() {
  const [greeting, setGreeting] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState('');
  const [escalationPhone, setEscalationPhone] = useState('+1-555-0199');
  const [escalateOnCritical, setEscalateOnCritical] = useState(true);
  const [urgencyKeywords, setUrgencyKeywords] = useState([
    'emergency',
    'hospital',
    'lawyer',
    'asap',
    'urgent',
    'immediately',
  ]);
  const [newKeyword, setNewKeyword] = useState('');

  const [trustedContacts, setTrustedContacts] = useState([
    { name: 'Sarah (Partner)', phone: '+1-555-0101', relationship: 'Family' },
    { name: 'David (Legal Counsel)', phone: '+1-555-0144', relationship: 'Attorney' },
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data: AnsweringRules = await getPreferences();
        setGreeting(data.greeting || 'Hello, this is Walter, an AI assistant for the owner.');
        setFallbackMessage(data.fallback_message || "I'll make sure to pass along your message to the owner.");

        if (data.escalation_settings) {
          const esc = data.escalation_settings as any;
          if (esc.phone_number) setEscalationPhone(esc.phone_number);
          if (esc.escalate_on_critical !== undefined) setEscalateOnCritical(esc.escalate_on_critical);
        }
      } catch (err) {
        console.error('Failed to load answering rules:', err);
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

      await updatePreferences({
        greeting,
        fallback_message: fallbackMessage,
        urgency_rules: {
          keywords: urgencyKeywords,
        },
        escalation_settings: {
          phone_number: escalationPhone,
          escalate_on_critical: escalateOnCritical,
          trusted_contacts: trustedContacts,
        },
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert('Failed to save answering rules: ' + (err.message || 'Check connection'));
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    if (!newKeyword.trim() || urgencyKeywords.includes(newKeyword.trim().toLowerCase())) return;
    setUrgencyKeywords([...urgencyKeywords, newKeyword.trim().toLowerCase()]);
    setNewKeyword('');
  };

  const removeKeyword = (kw: string) => {
    setUrgencyKeywords(urgencyKeywords.filter((k) => k !== kw));
  };

  const addContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    setTrustedContacts([
      ...trustedContacts,
      { name: newContactName.trim(), phone: newContactPhone.trim(), relationship: newContactRel.trim() || 'Contact' },
    ]);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRel('');
  };

  const removeContact = (idx: number) => {
    setTrustedContacts(trustedContacts.filter((_, i) => i !== idx));
  };

  if (loading) {
    return <LoadingState message="LOADING ANSWERING LOGIC & ESCALATION RULES..." />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#171717] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#171717] font-display">
            CALL ROUTING & DISPATCH RULES
          </h1>
          <p className="text-sm font-medium text-[#171717]/80 mt-1">
            Configure how Walter greets callers, handles uncertainty, and escalates emergencies.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-[#C8FF00] border-[2px] border-[#171717] shadow-[3px_3px_0px_#171717] font-mono text-xs font-bold text-[#171717] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>ANSWERING & ESCALATION RULES COMPILED AND APPLIED LIVE.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Verbal Greeting & Fallback Messages */}
        <BrutalCard className="p-6 space-y-5">
          <div className="border-b-[2px] border-[#171717] pb-3 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#171717]" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight">
              Answering Script & Uncertainty Fallback
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="section-header text-xs" style={{ marginBottom: 0 }}>
              Primary Answering Greeting (Opening Line)
            </label>
            <textarea
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              rows={2}
              placeholder="e.g. Hello, this is Walter, the personal AI telephone assistant for Anto."
              className="brutal-input w-full font-medium text-sm"
              required
            />
            <p className="text-[11px] font-mono text-[#8a8a7a]">
              Walter must clearly declare its AI identity as mandated by Section 7.1.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="section-header text-xs" style={{ marginBottom: 0 }}>
              Graceful Fallback Message (When Information is Unknown)
            </label>
            <textarea
              value={fallbackMessage}
              onChange={(e) => setFallbackMessage(e.target.value)}
              rows={2}
              placeholder="e.g. I do not have direct authorization to answer that, but I will record your note for the owner."
              className="brutal-input w-full font-medium text-sm"
              required
            />
          </div>
        </BrutalCard>

        {/* Urgency Detection & Keywords */}
        <BrutalCard className="p-6 space-y-5">
          <div className="border-b-[2px] border-[#171717] pb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#FF6B4A]" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight">
              Urgency Detection & Keywords
            </h2>
          </div>

          <p className="text-xs text-[#171717]/80 font-medium">
            When callers utter these high-priority trigger words, Walter will flag the call as High or Critical urgency.
          </p>

          <div className="flex flex-wrap gap-2">
            {urgencyKeywords.map((kw) => (
              <span
                key={kw}
                className="bg-[#EDE8DD] border-[2px] border-[#171717] font-mono text-xs font-bold uppercase px-2.5 py-1 flex items-center gap-2 shadow-[2px_2px_0px_#171717]"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => removeKeyword(kw)}
                  className="hover:text-[#FF6B4A]"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add trigger keyword (e.g. court, urgent, alert)"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="brutal-input flex-1 text-xs"
            />
            <BrutalButton type="button" variant="secondary" size="sm" onClick={addKeyword}>
              <Plus className="w-4 h-4" />
              <span>Add Keyword</span>
            </BrutalButton>
          </div>
        </BrutalCard>

        {/* Trusted Contacts Registry */}
        <BrutalCard className="p-6 space-y-5">
          <div className="border-b-[2px] border-[#171717] pb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#171717]" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight">
              Trusted Contacts (VIP Ring-Through)
            </h2>
          </div>

          <p className="text-xs text-[#171717]/80 font-medium">
            Inbound callers matching these numbers receive customized warm greetings and priority message routing.
          </p>

          <div className="space-y-2">
            {trustedContacts.map((contact, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border-[2px] border-[#171717] flex items-center justify-between gap-3 shadow-[2px_2px_0px_#171717]"
              >
                <div className="font-mono text-xs flex items-center gap-3">
                  <span className="font-bold text-[#171717]">{contact.name}</span>
                  <span className="text-[#8a8a7a]">{contact.phone}</span>
                  <span className="bg-[#C8FF00] px-1.5 py-0.2 border border-[#171717] text-[10px]">
                    {contact.relationship}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContact(idx)}
                  className="p-1 hover:text-[#FF6B4A]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add contact row */}
          <div className="p-4 bg-[#EDE8DD] border-[2px] border-[#171717] space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-[#171717]">
              Register New Trusted Contact
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="brutal-input text-xs"
              />
              <input
                type="text"
                placeholder="Phone (+1-555...)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="brutal-input text-xs"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Relationship"
                  value={newContactRel}
                  onChange={(e) => setNewContactRel(e.target.value)}
                  className="brutal-input text-xs flex-1"
                />
                <BrutalButton type="button" variant="primary" size="sm" onClick={addContact}>
                  <Plus className="w-4 h-4" />
                </BrutalButton>
              </div>
            </div>
          </div>
        </BrutalCard>

        {/* Escalation Phone & Handoff Settings */}
        <BrutalCard variant="dark" className="p-6 space-y-4">
          <div className="border-b-[2px] border-[#383838] pb-3 flex items-center gap-2">
            <PhoneForwarded className="w-5 h-5 text-[#C8FF00]" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight text-white">
              Emergency Escalation Handoff
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BrutalInput
              label="Owner Direct Emergency Phone"
              value={escalationPhone}
              onChange={(e) => setEscalationPhone(e.target.value)}
              placeholder="+1-555-0199"
              className="bg-[#171717] text-white border-[#383838]"
            />

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 p-3 bg-[#171717] border border-[#383838] cursor-pointer">
                <input
                  type="checkbox"
                  checked={escalateOnCritical}
                  onChange={(e) => setEscalateOnCritical(e.target.checked)}
                  className="w-4 h-4 accent-[#C8FF00]"
                />
                <span className="font-mono text-xs text-white">
                  Auto-flag critical calls for urgent SMS notification
                </span>
              </label>
            </div>
          </div>
        </BrutalCard>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <BrutalButton variant="primary" size="lg" type="submit" disabled={saving}>
            <Save className="w-4 h-4" />
            <span>{saving ? 'UPDATING ROUTING RULES...' : 'SAVE CALL RULES'}</span>
          </BrutalButton>
        </div>
      </form>
    </div>
  );
}
