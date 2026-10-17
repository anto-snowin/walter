const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API Error: ${res.status}`);
  }

  return res.json();
}

// Health
export const checkHealth = () => apiFetch<any>('/health');

// Profile
export const getProfile = (token?: string) =>
  apiFetch<any>('/api/profile/profile', { token });

export const updateProfile = (data: any, token?: string) =>
  apiFetch<any>('/api/profile/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });

// Preferences
export const getPreferences = (token?: string) =>
  apiFetch<any>('/api/preferences/preferences', { token });

export const updatePreferences = (data: any, token?: string) =>
  apiFetch<any>('/api/preferences/preferences', {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });

// Calls
export const getCalls = (params: Record<string, string> = {}, token?: string) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch<any>(`/api/calls/calls${query ? `?${query}` : ''}`, { token });
};

export const getCall = (callId: string, token?: string) =>
  apiFetch<any>(`/api/calls/calls/${callId}`, { token });

export const getCallSummary = (callId: string, token?: string) =>
  apiFetch<any>(`/api/calls/calls/${callId}/summary`, { token });

export const escalateCall = (callId: string, reason?: string, token?: string) =>
  apiFetch<any>(`/api/calls/calls/${callId}/escalate`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
    token,
  });

// Dashboard
export const getDashboardStats = (token?: string) =>
  apiFetch<any>('/api/dashboard/dashboard/stats', { token });

// Simulator
export const createSimulatorSession = (callerName?: string, token?: string) =>
  apiFetch<any>('/api/simulator/simulator/sessions', {
    method: 'POST',
    body: JSON.stringify({ caller_name: callerName }),
    token,
  });

export const sendSimulatorMessage = (sessionId: string, message: string, token?: string) =>
  apiFetch<any>(`/api/simulator/simulator/sessions/${sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
    token,
  });

export const endSimulatorSession = (sessionId: string, token?: string) =>
  apiFetch<any>(`/api/simulator/simulator/sessions/${sessionId}/end`, {
    method: 'POST',
    token,
  });

// Integrations
export const getIntegrationStatus = (token?: string) =>
  apiFetch<any>('/api/integrations/integrations/status', { token });
