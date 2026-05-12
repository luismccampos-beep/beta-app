import type { AIAdminAction } from '../types/admin.types';
export type AdminActionOptions = {
    apiEndpoint?: string;
    endpointOverride?: string;
};
export declare function runAdminAction(action: AIAdminAction, options?: AdminActionOptions): Promise<Record<string, unknown> | null>;
