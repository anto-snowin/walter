'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Send,
  PhoneOff,
  PhoneCall,
  User,
  Bot,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { createSimulatorSession, sendSimulatorMessage, endSimulatorSession } from '@/lib/api';
import { SimulatorMessage, SimulatorEndResponse } from '@/types';

export default function SimulatorPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [callerName, setCallerName] = useState('Alex Rivers');
  const [messages, setMessages] = useState<SimulatorMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<string | null>(null);
  const [currentUrgency, setCurrentUrgency] = useState<string | null>(null);
  const [sessionResult, setSessionResult] = useState<SimulatorEndResponse | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartSession = async () => {
    try {
      setIsStarting(true);
      setSessionResult(null);
      setCurrentIntent(null);
      setCurrentUrgency(null);

      const session = await createSimulatorSession(callerName);
      setSessionId(session.session_id);
      setMessages([
        {
          role: 'walter',
          content: session.greeting,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      console.error('Failed to start session:', err);
      alert('Could not start simulator session: ' + (err.message || 'Check backend connection'));
    } finally {
      setIsStarting(false);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || !sessionId || isSending) return;

    const userMsg: SimulatorMessage = {
      role: 'caller',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await sendSimulatorMessage(sessionId, textToSend.trim());
      setMessages((prev) => [
        ...prev,
        {
          role: 'walter',
          content: res.response,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      if (res.intent) setCurrentIntent(res.intent);
      if (res.urgency) setCurrentUrgency(res.urgency);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'walter',
          content: '[ERROR: Message transmission failed. Is Walter backend online?]',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId || isEnding) return;
    try {
      setIsEnding(true);
      const result = await endSimulatorSession(sessionId);
      setSessionResult(result);
      setSessionId(null);
    } catch (err: any) {
      console.error('Failed to end session:', err);
      alert('Error finalizing simulator session: ' + (err.message || 'Unknown error'));
    } finally {
      setIsEnding(false);
    }
  };

  const presets = [
    'Can I schedule a quick 20-minute meeting tomorrow at 3 PM?',
    'This is an urgent security emergency, please contact the owner ASAP!',
    'Hello Walter, I was calling to ask about office hours this week.',
    'Please tell the owner that Sarah called and to call me back.',
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#171717] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold bg-[#171717] text-[#C8FF00] px-2 py-0.5 border-[1px] border-[#171717]">
              BROWSER SIMULATION HARNESS
            </span>
            <span className="font-mono text-xs font-bold bg-[#EDE8DD] text-[#171717] px-2 py-0.5 border-[1px] border-[#171717]">
              ZERO TELEPHONY COST
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#171717] font-display">
            WALTER CALL SIMULATOR
          </h1>
          <p className="text-sm font-medium text-[#171717]/80 mt-1">
            Conduct two-way simulated phone calls to test agent behavior, intent extraction, and AI summarization.
          </p>
        </div>
      </div>

      {!sessionId && !sessionResult && (
        <BrutalCard className="p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 border-b-[2px] border-[#171717] pb-4 mb-6">
            <div className="w-12 h-12 bg-[#C8FF00] border-[2px] border-[#171717] flex items-center justify-center shadow-[2px_2px_0px_#171717]">
              <PhoneCall className="w-6 h-6 text-[#171717]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight">
                Initiate Inbound Call Session
              </h2>
              <p className="text-xs text-[#171717]/80 font-medium">
                Simulate a telephone call placed to Walter by configuring the caller persona.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <BrutalInput
              label="Simulated Caller Identity / Name"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="e.g. Sarah Connor, Dr. Robert Ford"
            />

            <div className="p-4 bg-[#EDE8DD] border-[2px] border-[#171717] text-xs font-mono space-y-1">
              <div className="font-bold text-[#171717] uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF6B4A]" />
                What happens during simulation:
              </div>
              <p className="text-[#171717]/80">
                1. Walter initializes owner profile & answering rules.
              </p>
              <p className="text-[#171717]/80">
                2. Walter answers with the configured custom greeting.
              </p>
              <p className="text-[#171717]/80">
                3. Each prompt triggers intent classification & urgency triage.
              </p>
              <p className="text-[#171717]/80">
                4. Ending the call stores an official summary in call history.
              </p>
            </div>

            <BrutalButton
              variant="primary"
              size="lg"
              className="w-full justify-center mt-6"
              onClick={handleStartSession}
              disabled={isStarting}
            >
              {isStarting ? 'CONNECTING CALL...' : 'START SIMULATED CALL'}
            </BrutalButton>
          </div>
        </BrutalCard>
      )}

      {/* Active Call UI */}
      {sessionId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Call Audio / Chat Monitor */}
          <BrutalCard className="lg:col-span-2 p-6 flex flex-col justify-between min-h-[520px]">
            {/* Call Header Status */}
            <div className="flex items-center justify-between border-b-[2px] border-[#171717] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B4A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF6B4A]"></span>
                </span>
                <div>
                  <div className="font-display font-black text-sm uppercase text-[#171717] flex items-center gap-2">
                    <span>CALL IN PROGRESS</span>
                    <span className="text-[10px] bg-[#FF6B4A] text-white px-2 py-0.2 font-mono">
                      LIVE
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#8a8a7a]">
                    Caller: {callerName || 'Unknown Caller'}
                  </div>
                </div>
              </div>

              <BrutalButton
                variant="danger"
                size="sm"
                onClick={handleEndSession}
                disabled={isEnding}
              >
                <PhoneOff className="w-4 h-4" />
                <span>{isEnding ? 'Finalizing...' : 'Hang Up Call'}</span>
              </BrutalButton>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto max-h-[380px] p-4 bg-[#EDE8DD] border-[2px] border-[#171717] space-y-4 mb-4">
              {messages.map((msg, index) => {
                const isWalter = msg.role === 'walter';
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isWalter ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold mb-1 text-[#171717]/70">
                      {isWalter ? (
                        <>
                          <Bot className="w-3.5 h-3.5 text-[#171717]" />
                          <span>WALTER AI</span>
                        </>
                      ) : (
                        <>
                          <span>{callerName.toUpperCase()}</span>
                          <User className="w-3.5 h-3.5 text-[#171717]" />
                        </>
                      )}
                      <span className="text-[10px] text-[#8a8a7a] font-normal">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div
                      className={`p-3.5 max-w-[85%] border-[2px] border-[#171717] font-medium text-sm leading-relaxed ${
                        isWalter
                          ? 'bg-white text-[#171717] shadow-[3px_3px_0px_#171717]'
                          : 'bg-[#C8FF00] text-[#171717] shadow-[3px_3px_0px_#171717]'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Controls */}
            <div className="space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Speak or type what the caller says..."
                  className="brutal-input flex-1"
                  disabled={isSending}
                />
                <BrutalButton variant="primary" type="submit" disabled={isSending}>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </BrutalButton>
              </form>

              {/* Preset Messages for Fast Testing */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase text-[#8a8a7a]">
                  Presets:
                </span>
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(preset)}
                    className="text-[11px] font-mono bg-white border-[1px] border-[#171717] px-2 py-1 hover:bg-[#C8FF00] transition-colors truncate max-w-[200px]"
                    title={preset}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </BrutalCard>

          {/* Telemetry & Analysis Panel */}
          <div className="space-y-6">
            <BrutalCard variant="dark" className="p-6">
              <h3 className="section-header text-xs text-[#C8FF00] mb-4">
                REAL-TIME TELEMETRY
              </h3>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <span className="text-[#8a8a7a] block mb-1">CALL STATUS:</span>
                  <span className="text-[#C8FF00] font-bold">STREAM ACTIVE (BI-DIRECTIONAL)</span>
                </div>

                <div>
                  <span className="text-[#8a8a7a] block mb-1">DETECTED INTENT:</span>
                  <span className="text-white font-bold bg-[#171717] px-2 py-1 border border-[#383838] inline-block">
                    {currentIntent ? currentIntent.toUpperCase() : 'AWAITING INPUT'}
                  </span>
                </div>

                <div>
                  <span className="text-[#8a8a7a] block mb-1">ASSESSED URGENCY:</span>
                  <span
                    className={`font-bold px-2 py-1 border border-[#383838] inline-block ${
                      currentUrgency === 'critical' || currentUrgency === 'high'
                        ? 'bg-[#FF6B4A] text-white'
                        : 'bg-[#C8FF00] text-[#171717]'
                    }`}
                  >
                    {currentUrgency ? currentUrgency.toUpperCase() : 'NORMAL (LOW)'}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#383838]">
                  <span className="text-[#8a8a7a] block mb-1">AUDIO BUFFER:</span>
                  <div className="flex items-center gap-2 text-white">
                    <Volume2 className="w-4 h-4 text-[#C8FF00]" />
                    <span>8 kHz μ-law Twilio stream format</span>
                  </div>
                </div>
              </div>
            </BrutalCard>
          </div>
        </div>
      )}

      {/* Completed Session Summary View */}
      {sessionResult && (
        <BrutalCard className="p-8 max-w-3xl mx-auto border-[3px] border-[#171717] shadow-[6px_6px_0px_#171717]">
          <div className="flex items-center justify-between border-b-[2px] border-[#171717] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C8FF00] border-[2px] border-[#171717] flex items-center justify-center shadow-[2px_2px_0px_#171717]">
                <CheckCircle2 className="w-6 h-6 text-[#171717]" />
              </div>
              <div>
                <h2 className="text-2xl font-black font-display uppercase tracking-tight">
                  Call Finalized & Summarized
                </h2>
                <div className="text-xs font-mono text-[#8a8a7a]">
                  Session ID: {sessionResult.session_id}
                </div>
              </div>
            </div>

            <StatusBadge status={(sessionResult.urgency as any) || 'low'}>
              {sessionResult.urgency.toUpperCase()}
            </StatusBadge>
          </div>

          <div className="space-y-6">
            {/* AI Summary Banner */}
            <div className="p-5 bg-[#EDE8DD] border-[2px] border-[#171717]">
              <span className="section-header text-xs text-[#171717] mb-2 block">
                EXECUTIVE SUMMARY
              </span>
              <p className="text-base font-semibold text-[#171717] leading-relaxed">
                {sessionResult.summary}
              </p>
            </div>

            {/* Categorization & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border-[2px] border-[#171717] bg-white">
                <span className="text-xs font-mono text-[#8a8a7a] block mb-1">
                  CALL CATEGORY
                </span>
                <span className="font-display font-bold text-lg text-[#171717] uppercase">
                  {sessionResult.category}
                </span>
              </div>
              <div className="p-4 border-[2px] border-[#171717] bg-white">
                <span className="text-xs font-mono text-[#8a8a7a] block mb-1">
                  URGENCY RATING
                </span>
                <span className="font-display font-bold text-lg text-[#171717] uppercase">
                  {sessionResult.urgency}
                </span>
              </div>
            </div>

            {/* Follow-Up Action Checklist */}
            {sessionResult.follow_up_actions && sessionResult.follow_up_actions.length > 0 && (
              <div className="p-4 border-[2px] border-[#171717] bg-white space-y-3">
                <span className="section-header text-xs text-[#171717] block" style={{ marginBottom: 0 }}>
                  EXTRACTED FOLLOW-UP ACTIONS
                </span>
                <ul className="space-y-2">
                  {sessionResult.follow_up_actions.map((act, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-mono">
                      <span className="w-4 h-4 bg-[#C8FF00] border-[1px] border-[#171717] flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-[#171717]">{act.action}</span>
                      <span className="text-[10px] bg-[#EDE8DD] border border-[#171717] px-1.5 py-0.2">
                        {act.priority.toUpperCase()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions: Start New Call or View in History */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t-[2px] border-[#171717]">
              {sessionResult.call_id && (
                <Link href={`/dashboard/calls/${sessionResult.call_id}`} className="w-full sm:w-auto">
                  <BrutalButton variant="primary" className="w-full justify-center">
                    <span>View Stored Call Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </BrutalButton>
                </Link>
              )}
              <BrutalButton
                variant="secondary"
                className="w-full sm:w-auto justify-center"
                onClick={() => setSessionResult(null)}
              >
                Run Another Simulation
              </BrutalButton>
            </div>
          </div>
        </BrutalCard>
      )}
    </div>
  );
}
