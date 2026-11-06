import { AdminStats, SubscriptionVerificationRequest } from '../types';

export interface ChatApiPayload {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  language?: string;
  systemPrompt?: string;
  userId?: string;
  plan?: 'free' | 'plus' | 'pro';
}

export interface ChatApiResponse {
  reply: string;
  modelUsed?: string;
  remainingQuota?: number;
  limit?: number;
  error?: string;
}

export interface WritingStudioPayload {
  toolType: string;
  prompt: string;
  tone?: string;
  language?: string;
  options?: Record<string, any>;
  userId?: string;
  plan?: 'free' | 'plus' | 'pro';
}

export interface StudyAssistantPayload {
  mode: string;
  topic: string;
  gradeLevel?: string;
  question?: string;
  options?: Record<string, any>;
  userId?: string;
  plan?: 'free' | 'plus' | 'pro';
}

export interface TranslatorPayload {
  text: string;
  fromLang?: string;
  toLang?: string;
  userId?: string;
  plan?: 'free' | 'plus' | 'pro';
}

export interface BusinessAssistantPayload {
  toolType: string;
  prompt: string;
  marketContext?: string;
  userId?: string;
  plan?: 'free' | 'plus' | 'pro';
}

// 1. Send Chat Message
export async function sendChatMessage(payload: ChatApiPayload): Promise<ChatApiResponse> {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}: Failed to generate chat response`);
  }
  return data;
}

// 2. Writing Studio
export async function generateWritingStudio(payload: WritingStudioPayload): Promise<{ result: string; remainingQuota?: number }> {
  const response = await fetch('/api/gemini/studio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate writing content');
  }
  return data;
}

// 3. Study Assistant
export async function generateStudyAssistant(payload: StudyAssistantPayload): Promise<{ result: string; remainingQuota?: number }> {
  const response = await fetch('/api/gemini/study', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate study guidance');
  }
  return data;
}

// 4. Translator
export async function translateContent(payload: TranslatorPayload): Promise<{ translatedText: string; remainingQuota?: number }> {
  const response = await fetch('/api/gemini/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Translation request failed');
  }
  return data;
}

// 5. Business Assistant
export async function generateBusinessAssistant(payload: BusinessAssistantPayload): Promise<{ result: string; remainingQuota?: number }> {
  const response = await fetch('/api/gemini/business', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Business strategy generation failed');
  }
  return data;
}

// Admin API calls
export async function fetchAdminStats(): Promise<AdminStats> {
  const response = await fetch('/api/admin/stats');
  if (!response.ok) throw new Error('Failed to load admin stats');
  return response.json();
}

export async function fetchAdminUsers(): Promise<{ users: any[] }> {
  const response = await fetch('/api/admin/users');
  if (!response.ok) throw new Error('Failed to load users');
  return response.json();
}

export async function toggleUserAccountStatus(userId: string): Promise<any> {
  const response = await fetch('/api/admin/users/toggle-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error('Failed to toggle user status');
  return response.json();
}

export async function fetchAdminSubscriptions(): Promise<{ subscriptions: SubscriptionVerificationRequest[] }> {
  const response = await fetch('/api/admin/subscriptions');
  if (!response.ok) throw new Error('Failed to load subscriptions');
  return response.json();
}

export async function verifyAdminSubscription(subId: string, action: 'approve' | 'reject'): Promise<any> {
  const response = await fetch('/api/admin/subscriptions/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subId, action }),
  });
  if (!response.ok) throw new Error('Failed to verify subscription');
  return response.json();
}

export async function updateAdminConfig(config: any): Promise<any> {
  const response = await fetch('/api/admin/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error('Failed to update config');
  return response.json();
}
