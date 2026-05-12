export interface AIAdminAction {
    id: string;
    type: string;
    payload?: Record<string, unknown>;
}
