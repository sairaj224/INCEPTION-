/**
 * API Validation Client Library
 * Validates inputs before sending to server and validates API response structures.
 */

import { AIRecommendation } from '../types';

export interface HealthCheckResponse {
  status: string;
  app: string;
  geminiConfigured: boolean;
  timestamp: string;
}

export interface TroubleshootResponse {
  diagnosis: string;
  checks: Array<{ title: string; detail: string }>;
  codeFixSuggestion?: string;
}

export interface ComponentExplanationResponse {
  name: string;
  whyDoINeedThis: string;
  howDoesItWork: string;
  whatIfIDontUseIt: string;
  realLifeApplications: string[];
  alternativeComponents: string[];
}

/**
 * Check backend health & Gemini status
 */
export async function checkApiHealth(): Promise<HealthCheckResponse> {
  const res = await fetch('/api/health');
  if (!res.ok) {
    throw new Error(`API Health check failed with status ${res.status}`);
  }
  const data = await res.json();
  if (!data || typeof data.status !== 'string') {
    throw new Error('Invalid response structure from health API');
  }
  return data;
}

/**
 * Fetch AI project recommendations with strict request and response validation
 */
export async function fetchAiRecommendations(params: {
  budget: number;
  interest: string;
  skillLevel: string;
  customizedGoal?: string;
}): Promise<AIRecommendation[]> {
  // Input Validation
  const validatedBudget = typeof params.budget === 'number' && params.budget > 0 ? params.budget : 500;
  const validatedInterest = (params.interest || 'Sensors & Automation').trim().slice(0, 150);
  const validatedSkillLevel = ['Beginner', 'Intermediate', 'Advanced'].includes(params.skillLevel)
    ? params.skillLevel
    : 'Beginner';
  const validatedGoal = (params.customizedGoal || '').trim().slice(0, 300);

  const res = await fetch('/api/ai/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      budget: validatedBudget,
      interest: validatedInterest,
      skillLevel: validatedSkillLevel,
      customizedGoal: validatedGoal,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to fetch recommendations from server');
  }

  const data = await res.json();

  // Response Validation
  if (!data || !Array.isArray(data.recommendations)) {
    throw new Error('Invalid API response: recommendations array missing');
  }

  return data.recommendations.map((rec: any) => ({
    title: String(rec.title || 'Untitled Project'),
    budget: Number(rec.budget) || validatedBudget,
    difficulty: (['Beginner', 'Intermediate', 'Advanced'].includes(rec.difficulty) ? rec.difficulty : 'Beginner') as any,
    timeCommitment: String(rec.timeCommitment || '2 hours'),
    summary: String(rec.summary || ''),
    whyRecommended: String(rec.whyRecommended || ''),
    coreComponents: Array.isArray(rec.coreComponents) ? rec.coreComponents.map(String) : [],
    learningOutcome: String(rec.learningOutcome || ''),
  }));
}

/**
 * Fetch troubleshooting guidance with request and response validation
 */
export async function fetchAiTroubleshoot(params: {
  problemStatement: string;
  projectTitle?: string;
  componentList?: string[];
}): Promise<TroubleshootResponse> {
  const trimmedProblem = (params.problemStatement || '').trim();
  if (!trimmedProblem || trimmedProblem.length < 3) {
    throw new Error('Validation Error: Problem description must be at least 3 characters');
  }

  const res = await fetch('/api/ai/troubleshoot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      problemStatement: trimmedProblem,
      projectTitle: (params.projectTitle || 'IoT Project').trim().slice(0, 200),
      componentList: Array.isArray(params.componentList) ? params.componentList : [],
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details?.[0] || errorData.error || 'Troubleshooting request failed');
  }

  const data = await res.json();

  // Response Validation
  if (!data || typeof data.diagnosis !== 'string' || !Array.isArray(data.checks)) {
    throw new Error('Invalid troubleshooting payload schema received');
  }

  return {
    diagnosis: String(data.diagnosis),
    checks: data.checks.map((c: any) => ({
      title: String(c.title || 'Check'),
      detail: String(c.detail || 'Review connections and voltage.'),
    })),
    codeFixSuggestion: data.codeFixSuggestion ? String(data.codeFixSuggestion) : undefined,
  };
}

/**
 * Fetch component explanation with input and output schema validation
 */
export async function fetchAiComponentExplanation(componentName: string): Promise<ComponentExplanationResponse> {
  const trimmedName = (componentName || '').trim();
  if (!trimmedName || trimmedName.length < 2) {
    throw new Error('Validation Error: Component name must be at least 2 characters long');
  }

  const res = await fetch('/api/ai/explain-component', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ componentName: trimmedName }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details?.[0] || errorData.error || 'Failed to explain component');
  }

  const data = await res.json();

  if (!data || typeof data.whyDoINeedThis !== 'string') {
    throw new Error('Invalid component explanation structure');
  }

  return {
    name: String(data.name || trimmedName),
    whyDoINeedThis: String(data.whyDoINeedThis),
    howDoesItWork: String(data.howDoesItWork || 'Operates via electronic transducer physics.'),
    whatIfIDontUseIt: String(data.whatIfIDontUseIt || 'Feedback or actuation will be missing in circuit.'),
    realLifeApplications: Array.isArray(data.realLifeApplications) ? data.realLifeApplications.map(String) : [],
    alternativeComponents: Array.isArray(data.alternativeComponents) ? data.alternativeComponents.map(String) : [],
  };
}
