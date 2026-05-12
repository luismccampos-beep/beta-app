import apiClient from '../lib/api-client';
export const aiService = {
    async getPrompts() {
        const resp = await apiClient.get('/ai/prompts');
        return Array.isArray(resp) ? resp : [];
    },
    async getPrompt(id) {
        const resp = await apiClient.get(`/ai/prompts/${id}`);
        return resp;
    },
    async getWorkflows() {
        const resp = await apiClient.get('/ai/workflows');
        return Array.isArray(resp) ? resp : [];
    },
    async runWorkflow(id, input) {
        const resp = await apiClient.post(`/ai/workflows/${id}/run`, input);
        return resp;
    },
};
export default aiService;
//# sourceMappingURL=aiService.js.map