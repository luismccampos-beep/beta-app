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
export declare const aiService: {
    getPrompts(): Promise<AIPrompt[]>;
    getPrompt(id: number): Promise<AIPrompt>;
    getWorkflows(): Promise<AIWorkflow[]>;
    runWorkflow(id: number, input: Record<string, unknown>): Promise<AIWorkflowResponse>;
};
export default aiService;
