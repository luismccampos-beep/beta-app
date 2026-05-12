import apiClient from '../lib/api-client';

export interface AIPrompt {
  id: number;
  key: string;
  title: string;
  description?: string;
  template: string;
  variables?: Record<string, unknown>;
  service: string;
  model?: string;
  tags?: string[];
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AIWorkflow {
  id: number;
  key: string;
  name: string;
  description?: string;
  steps: unknown;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AIWorkflowResponse {
  success: boolean;
  result?: unknown;
  error?: string;
}

export const aiService = {
  async getPrompts(): Promise<AIPrompt[]> {
    const resp = await apiClient.get<AIPrompt[]>('/ai/prompts');
    return Array.isArray(resp) ? resp : [];
  },

  async getPrompt(id: number): Promise<AIPrompt> {
    const resp = await apiClient.get<AIPrompt>(`/ai/prompts/${id}`);
    return resp as AIPrompt;
  },

  async getWorkflows(): Promise<AIWorkflow[]> {
    const resp = await apiClient.get<AIWorkflow[]>('/ai/workflows');
    return Array.isArray(resp) ? resp : [];
  },

  async runWorkflow(id: number, input: Record<string, unknown>): Promise<AIWorkflowResponse> {
    const resp = await apiClient.post<AIWorkflowResponse>(`/ai/workflows/${id}/run`, input);
    return resp as AIWorkflowResponse;
  },
};

export default aiService;