/* Walter AI — TypeScript Type Definitions */

// ---- Profile ----
export interface Profile {
  id: string;
  display_name: string | null;
  occupation: string | null;
  introduction: string | null;
  approved_information: Record<string, unknown>;
  private_information_rules: Record<string, unknown>;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProfileUpdate {
  display_name?: string;
  occupation?: string;
  introduction?: string;
  approved_information?: Record<string, unknown>;
  private_information_rules?: Record<string, unknown>;
}

// ---- Answering Rules / Preferences ----
export interface AnsweringRules {
  id: string | null;
  user_id: string;
  greeting: string;
  communication_style: string;
  working_hours: Record<string, unknown>;
  urgency_rules: Record<string, unknown>;
  fallback_message: string;
  escalation_settings: Record<string, unknown>;
  updated_at: string | null;
}

export interface AnsweringRulesUpdate {
  greeting?: string;
  communication_style?: string;
  working_hours?: Record<string, unknown>;
  urgency_rules?: Record<string, unknown>;
  fallback_message?: string;
  escalation_settings?: Record<string, unknown>;
}

// ---- Calls ----
export type CallStatus = 'active' | 'completed' | 'failed' | 'missed';
export type CallSource = 'twilio' | 'simulator';
export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';
export type CallCategory =
  | 'general'
  | 'scheduling'
  | 'urgent_message'
  | 'callback_request'
  | 'message_delivery'
  | 'inquiry'
  | 'complaint'
  | 'business'
  | 'personal'
  | 'unknown';

export interface CallSummary {
  id: string;
  call_id: string;
  user_id: string;
  summary: string;
  category: CallCategory;
  urgency: UrgencyLevel;
  key_details: Record<string, unknown>;
  follow_up_actions: FollowUpAction[];
  escalation_required: boolean;
  created_at: string | null;
}

export interface FollowUpAction {
  action: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

export interface CallSession {
  id: string;
  user_id: string;
  provider_call_id: string | null;
  caller_number: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  status: CallStatus;
  source: CallSource;
  created_at: string | null;
  summary: CallSummary | null;
}

export interface CallListResponse {
  calls: CallSession[];
  total: number;
  page: number;
  page_size: number;
}

// ---- Dashboard ----
export interface DashboardStats {
  total_calls: number;
  calls_today: number;
  urgent_calls: number;
  failed_calls: number;
  recent_calls: CallSession[];
  walter_status: string;
}

// ---- Simulator ----
export interface SimulatorSession {
  session_id: string;
  status: string;
  greeting: string;
}

export interface SimulatorMessage {
  role: 'caller' | 'walter';
  content: string;
  timestamp?: string;
}

export interface SimulatorMessageResponse {
  response: string;
  intent: string | null;
  urgency: string | null;
}

export interface SimulatorEndResponse {
  session_id: string;
  summary: string;
  category: string;
  urgency: string;
  key_details: Record<string, unknown>;
  follow_up_actions: FollowUpAction[];
  duration_seconds: number;
  call_id: string | null;
}

// ---- Integrations ----
export interface IntegrationInfo {
  status: 'configured' | 'not_configured' | 'connected' | 'error';
  description: string;
  requires: string[];
  configured_fields?: Record<string, boolean>;
  model?: string | null;
  note?: string;
}

export interface IntegrationStatus {
  twilio: IntegrationInfo;
  openai: IntegrationInfo;
  supabase: IntegrationInfo;
  alexa: IntegrationInfo;
}

// ---- Navigation ----
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
}
